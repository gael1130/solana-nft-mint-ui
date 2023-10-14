
# Minting Website for your NFTs

You can try the mainnet version here if you want to mint one of my NFTs: [RealBricks](https://realbricks.xyz/) \
[Tutorial Video Link](https://www.youtube.com/watch?v=awzE0MP0Ewc)

Let's go!
Again, but now in Prod

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
You can use the free tier version of
- [Quicknode](https://www.quicknode.com/)
- [Alchemy](https://www.alchemy.com/)
