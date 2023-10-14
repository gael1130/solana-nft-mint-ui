
# Solana dApp Scaffold Next

Let's go!
Again, but now in Prod?

[Original Repo: Solana Labs Dapp Scaffold](https://github.com/solana-labs/dapp-scaffold)

How to use it? \
Install dependencies
```
npm install
```
Run it in dev to try
```
npm run dev
```
When everything is ready, run build before deploying
```
npm run build
```
Create an env file
```
echo > .env
```
add the following values in the `.env` file, replacing the values with your own
```
NEXT_PUBLIC_RPC=<YOUR_QUICKNODE_ALCHEMY_OR_OTHER_URL>
NEXT_PUBLIC_CANDY_MACHINE_ID=<YOUR_CANDY_MACHINE_PUBKEY>
NEXT_PUBLIC_TREASURY=<YOUR_WALLET_ADDRESS>
```
You can use the free tier version of [Quicknode]([url](https://www.quicknode.com/)https://www.quicknode.com/) or [Alchemy]([url](https://www.alchemy.com/)https://www.alchemy.com/)
