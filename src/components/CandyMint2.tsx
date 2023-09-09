// Imports Above + env variables
export const CandyMint: FC = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();
    const umi = 
    createUmi(quicknodeEndpoint)
        .use(walletAdapterIdentity(wallet))
        .use(mplCandyMachine())
        .use(mplTokenMetadata());

const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
const [nftsTotal, setnftsTotal] = useState<number>(0);
const [nftsMinted, setNftsMinted] = useState<number>(0);
const [nftsRemaining, setNftsRemaining] = useState<number>(0);
const [costInSol, setCostInSol] = useState<number>(0);
const [defaultCandyGuardSet, setDefaultCandyGuardSet] = useState<CandyGuard<DefaultGuardSet>>();
const [cmv3v2, setCandyMachine] = useState<CandyMachine>();




const retrieveAvailability = async() => {
    const candyMachine = await fetchCandyMachine(
        umi,
        candyMachineAddress,
    );
    setCandyMachine(candyMachine);
    setnftsTotal(candyMachine.itemsLoaded);
    setNftsMinted(Number(candyMachine.itemsRedeemed));
    const remaining = candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed)
    setNftsRemaining(remaining);
    const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
    if (candyGuard) {
        setDefaultCandyGuardSet(candyGuard);
    }
    const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
    const solPaymentGuard: Option<SolPayment> | undefined = defaultGuards?.solPayment;
    if (solPaymentGuard) {
        const solPayment: SolPayment | null  = unwrapOption(solPaymentGuard);
        if (solPayment) {
            const lamports: SolAmount = solPayment.lamports;
            const solCost = Number(lamports.basisPoints) / 1000000000;
            setCostInSol(solCost);
        }
    }
    if (remaining > 0) {
        console.log('info', `NFTs still available: ${remaining}`)
    } else {
        console.log('info', `No NFTs available`)
    }
};


useEffect(() => {
    retrieveAvailability();
  }, [mintCreated]);

const onClick = useCallback(async () => {
    if (!wallet.publicKey) {
        notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
        return;
    }
    // Fetch the Candy Machine.
    const candyMachine = await fetchCandyMachine(
        umi,
        candyMachineAddress,
    );
    // Fetch the Candy Guard.
    const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority,
    );
    try {
        // Mint from the Candy Machine.
        const nftMint = generateSigner(umi);
        const transaction = await transactionBuilder()
            .add(setComputeUnitLimit(umi, { units: 800_000 }))
            .add(
                mintV2(umi, {
                    candyMachine: candyMachine.publicKey,
                    candyGuard: candyGuard?.publicKey,
                    nftMint,
                    collectionMint: candyMachine.collectionMint,
                    collectionUpdateAuthority: candyMachine.authority,
                    mintArgs: {
                        solPayment: some({ destination: treasury }),
                    },
                })
            );
        const { signature } = await transaction.sendAndConfirm(umi, {
            confirm: { commitment: "confirmed" },
        });
        const txid = bs58.encode(signature);
        console.log('success', `Mint successful! ${txid}`)
        notify({ type: 'success', message: 'Mint successful!', txid });
        getUserSOLBalance(wallet.publicKey, connection);
        setMintCreated(nftMint.publicKey);
        const remaining = candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed)
        setNftsRemaining(remaining);
    } catch (error: any) {
        notify({ type: 'error', message: `Error minting!`, description: error?.message });
        console.log('error', `Mint failed! ${error?.message}`);
    }
}, [wallet, connection, getUserSOLBalance, umi, candyMachineAddress, treasury, mintCreated, nftsRemaining, setMintCreated]);

    return (
        <div className="flex flex-row justify-center">
                <div className="flex flex-col relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20"></div>
                        <button
                            className="px-4 m-1 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
                            onClick={onClick}
                            >
                                <span>Mint a Badge for {costInSol} Sol  </span>
                        </button>
                        <p className='text-slate-600 ml-2 text-center'>{nftsRemaining} NFTs remaining / {nftsTotal} total, {nftsMinted} already minted</p>
                </div>
        </div>
    );
};

