// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// In order to show my image
import Image from 'next/image';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import pkg from '../../../package.json';
import { CandyMint } from '../../components/CandyMint';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-2">
      <div className="md:hero-content flex flex-col">
        <div className='mt-2'>
        <div className='text-sm font-normal align-bottom text-right text-slate-600 mt-2'>v0.1</div>
        <h1 className="h-[7rem] text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500">
          Real Bricks
        </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p>98 Bricks ❤️ on Solana</p>
          <p className='text-slate-500 text-2x1 leading-relaxed'>Mint a NFT for access</p>
        </h4>
        <div className="relative group">

          {/* <Image src="/17.png" alt="Solana Love Badges Collection Image" width={300} height={300} className='rounded mx-auto' /> */}
          {/* <video src="public/gif-video.mp4" autoPlay loop className='w-full'/> */}
          {/* public/17.png */}
          <video autoPlay loop muted width={300} height={300} className='rounded mx-auto'>
            <source src="/gif-video.mp4" type="video/mp4" />
            {/* /home/kalel1130/projects/nft-solana-1/quicknode-guide/test2/dapp-scaffold/public/gif-video.mp4 */}
            {/* public/gif-video.mp4 */}

          </video>

          {/* public/gif-video.mp4 */}

        </div>
        <div className="flex flex-col mt-2">
          {/* <RequestAirdrop /> */}
          
          <CandyMint />
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            <div>
              {(balance || 0).toLocaleString()}
              </div>
              <div className='text-slate-600 ml-2'>
                SOL
              </div>
          </div>
          }
          </h4>
        </div>
      </div>
    </div>
  );
};
