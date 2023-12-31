import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useEffect, useState } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
// Option, unwrapSome (deprecated, replaced by unwrapOption), SolAmount below is for the default CandyGuard to get the Price later
// You import publickey (minuscule) and PublicKey (majuscule) from umi
import {
  generateSigner,
  transactionBuilder,
  publicKey,
  PublicKey,
  some,
  Option,
  SolAmount,
  unwrapOption,
} from "@metaplex-foundation/umi";
// SolPayment below is the Candy Guard for payment, same for DefaultGuardSet and CandyGuard to get the price
// The CandyMachine imported below will be used to check if the candy machine exists in my states
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
  SolPayment,
  DefaultGuardSet,
  CandyGuard,
  CandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { clusterApiUrl } from "@solana/web3.js";
import * as bs58 from "bs58";

// These access the environment variables we defined in the .env file
const quicknodeEndpoint =
  process.env.NEXT_PUBLIC_RPC || clusterApiUrl("devnet");
const candyMachineAddress = publicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID);
const treasury = publicKey(process.env.NEXT_PUBLIC_TREASURY);

export const CandyMint: FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { getUserSOLBalance } = useUserSOLBalanceStore();
  const umi = createUmi(quicknodeEndpoint)
    .use(walletAdapterIdentity(wallet))
    .use(mplCandyMachine())
    .use(mplTokenMetadata());
  // [wallet, mplCandyMachine, walletAdapterIdentity, mplTokenMetadata, quicknodeEndpoint, createUmi]
  // );
  // set the state for the nft availability
  const [mintCreated, setMintCreated] = useState<PublicKey | null>(null);
  const [nftsTotal, setnftsTotal] = useState<number>(0);
  const [nftsMinted, setNftsMinted] = useState<number>(0);
  const [nftsRemaining, setNftsRemaining] = useState<number>(0);
  const [costInSol, setCostInSol] = useState<number>(0);
  const [defaultCandyGuardSet, setDefaultCandyGuardSet] =
    useState<CandyGuard<DefaultGuardSet>>();
  const [cmv3v2, setCandyMachine] = useState<CandyMachine>();

  useEffect(() => {
    retrieveAvailability();
  }, []);

  const retrieveAvailability = async () => {
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);

    setCandyMachine(candyMachine);

    // Count the NFTs available, total and minted
    setnftsTotal(candyMachine.itemsLoaded);
    // You have to put number otherwise you get stuck with BigInt
    setNftsMinted(Number(candyMachine.itemsRedeemed));
    const remaining =
      candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed);
    setNftsRemaining(remaining);

    // Fetch the Candy Guard to get the price
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );
    if (candyGuard) {
      // console.log("candyGuard again", candyGuard);
      // console.log("candyGuard guards", candyGuard.guards);
      // console.log("candyGuard guards solpayment", candyGuard.guards.solPayment);
      setDefaultCandyGuardSet(candyGuard);
    }

    const defaultGuards: DefaultGuardSet | undefined = candyGuard?.guards;
    const solPaymentGuard: Option<SolPayment> | undefined =
      defaultGuards?.solPayment;

    if (solPaymentGuard) {
      const solPayment: SolPayment | null = unwrapOption(solPaymentGuard);
      if (solPayment) {
        const lamports: SolAmount = solPayment.lamports;
        const solCost = Number(lamports.basisPoints) / 1000000000;
        setCostInSol(solCost);
        console.log("solCost", solCost);
      }
    }
    if (remaining > 0) {
      console.log("info", `NFTs still available: ${remaining}`);
    } else {
      console.log("info", `No NFTs available`);
      console.log("remaining mama", remaining);
    }
  };

  const onClick = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }
    // Fetch the Candy Machine.
    const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
    // Fetch the Candy Guard.
    const candyGuard = await safeFetchCandyGuard(
      umi,
      candyMachine.mintAuthority
    );
    console.log("candyGuard baby", candyGuard);
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
      console.log("success", `Mint successful! ${txid}`);
      notify({ type: "success", message: "Mint successful!", txid });
      getUserSOLBalance(wallet.publicKey, connection);

      // fetch the numbers of nfts minted
      const updatedCandyMachine = await fetchCandyMachine(
        umi,
        candyMachineAddress
      );
      console.log(
        "updatedCandyMachine after mint $$$ $$$",
        updatedCandyMachine
      );
      const updatedRemaining =
        updatedCandyMachine.itemsLoaded -
        Number(updatedCandyMachine.itemsRedeemed);
      console.log("updatedRemaining 123 ##", updatedRemaining);

      // Update states in a single call
      setCandyMachine(updatedCandyMachine);
      setNftsMinted(Number(updatedCandyMachine.itemsRedeemed));
      setNftsRemaining(updatedRemaining);

      setMintCreated(nftMint.publicKey);

      // Fetch Updated availability
      // const updatedCandyMachine = await fetchCandyMachine(umi, candyMachineAddress);
      // console.log("updatedCandyMachine after mint $$$ $$$", updatedCandyMachine);
      // const updatedRemaining = updatedCandyMachine.itemsLoaded - Number(updatedCandyMachine.itemsRedeemed)
      // console.log("updatedRemaining 123 ##", updatedRemaining);

      // Update states in a single call
      // setCandyMachine(updatedCandyMachine);
      // setNftsMinted(Number(updatedCandyMachine.itemsRedeemed));
      // setNftsRemaining(updatedRemaining);

      // console.log("###a fter success####")
      // console.log("remaining", updatedRemaining);

      // retrieveAvailability();

      // console.log("retrievability",retrieveAvailability());
      // const remaining = candyMachine.itemsLoaded - Number(candyMachine.itemsRedeemed)
      // setNftsRemaining(remaining);
      // console.log("#### after tx success ####")
      // console.log("remaining", remaining)
    } catch (error: any) {
      notify({
        type: "error",
        message: `Error minting!`,
        description: error?.message,
      });
      console.log("error", `Mint failed! ${error?.message}`);
    }
  }, [
    wallet,
    connection,
    getUserSOLBalance,
    umi,
    candyMachineAddress,
    treasury,
  ]);
  // }, [wallet, connection, getUserSOLBalance, umi, candyMachineAddress, treasury, mintCreated, nftsRemaining, setMintCreated]);

  return (
    <div className="flex flex-col justify-center">
      {/* I added below the flex flex-col to align better */}
      <div className="flex flex-col relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                    rounded-lg blur opacity-20"
        ></div>
        <button
          className="px-4 m-1 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
          onClick={onClick}
        >
          <span>Mint a brick for {costInSol} Sol </span>
        </button>
      </div>
      <p className="text-white ml-2 text-center drop-shadow">
        {nftsRemaining} NFTs remaining = {nftsTotal} total - {nftsMinted}{" "}
        already minted
      </p>
    </div>
  );
};
