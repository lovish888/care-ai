import { Coinbase, Wallet, WalletAddress } from "@coinbase/coinbase-sdk";
import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

const assetId = Coinbase.assets.Eth;
const seedFileName = "./encrypted_seed.json";
const walletFileName = "./wallet.json";
let sendingWallet: Wallet;

(async () => {
  Coinbase.configure({
    apiKeyName: process.env.CDP_API_KEY_NAME!,
    privateKey: process.env.CDP_API_KEY_PRIVATE_KEY!,
  });

  if (fs.existsSync(seedFileName) && fs.existsSync(walletFileName)) {
    sendingWallet = await importExistingWallet();
  } else {
    sendingWallet = await createSendingWallet();
  }
})();

// Create a sending Wallet.
async function createSendingWallet(): Promise<Wallet> {
  const sendingWallet: Wallet = await Wallet.create();
  const walletIdString = JSON.stringify(sendingWallet.getId());
  fs.writeFileSync(walletFileName, walletIdString);
  sendingWallet.saveSeed(seedFileName);
  maybeFundWallet(sendingWallet);
  
  return sendingWallet;
}

// Import an existing wallet.
async function importExistingWallet(): Promise<Wallet> {
  // Get the wallet ID.
  const walletData = fs.readFileSync(walletFileName, "utf8");
  const walletId = JSON.parse(walletData);

  // Get the wallet.
  const wallet = await Wallet.fetch(walletId);

  // Load the seed on the wallet.
  const successString = await wallet.loadSeed(seedFileName);

  maybeFundWallet(wallet);
  return wallet;
}

// Attempts to fund a wallet if it does not have enough ETH.
async function maybeFundWallet(sendingWallet: Wallet) {
    const ethBalance = await sendingWallet.getBalance(assetId);
    // console.log(`Current ETH balance: ${ethBalance.toString()}`);
    const ethRequired = 0.001;
    if (ethBalance.lt(ethRequired)) {
      const faucetTransaction = await sendingWallet.faucet();
      const newEthBalance = await sendingWallet.getBalance(assetId);
    //   console.log(`New ETH balance: ${newEthBalance.toString()}`);
    }
  }

export async function refundWithAgentKit(
  walletAddress: string,
  amount: number
): Promise<string | null> {
  try {
    console.log(`Sending ${amount} to ${walletAddress}...`);
    const transfer = await sendingWallet.createTransfer({
      amount: amount,
      assetId: assetId,
      destination: walletAddress,
    });
    await transfer.wait();

    console.log(`Transfer to ${walletAddress} successful`);
    console.log(`Transaction link: ${transfer.getTransactionLink()}`);
    console.log(`Transaction hash: ${transfer.getTransactionHash()}`);

    return transfer.getTransactionLink() || null;

  } catch (error) {
    console.error("Error processing refund with Coinbase AgentKit:", error);
    throw error;
  }
}
