import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const contractABI = [
  "function logChat(string memory data) public",
  "event ChatLogged(string data)",
];

export class ChatLogger {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!);
    this.wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, this.provider);
    // Replace with your deployed contract address
    const contractAddress = 'your_contract_address';
    this.contract = new ethers.Contract(contractAddress, contractABI, this.wallet);
  }

  async logChatResolution(chatId: string, resolution: string): Promise<void> {
    const data = `Chat ${chatId}: ${resolution}`;
    const tx = await this.contract.logChat(data);
    await tx.wait();
    console.log(`Logged chat resolution on Sepolia: ${data}`);
  }
}

export const chatLogger = new ChatLogger();