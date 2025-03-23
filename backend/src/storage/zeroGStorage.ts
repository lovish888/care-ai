import { ZgFile, Indexer } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import { Chat } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import dotenv from 'dotenv';

dotenv.config();

export class ZeroGStorage {
  private indexer: Indexer;
  private rpcUrl: string;
  private signer: ethers.Wallet;

  constructor() {
    // Network Constants
    this.rpcUrl = process.env.ZEROG_RPC!;
    const privateKey = process.env.ZEROG_PRIVATE_KEY!;
    const indexerRPC = process.env.ZEROG_STORAGE_NODE!;

    // Initialize provider, signer and indexer
    const provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.signer = new ethers.Wallet(privateKey, provider);
    this.indexer = new Indexer(indexerRPC);
  }

  async saveChat(chat: Chat): Promise<string> {
    // Convert chat to Buffer
    const data = Buffer.from(JSON.stringify(chat));

    // Create a temporary file to use ZgFile.fromFilePath
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `chat_${chat.chatId}.json`);
    await fs.writeFile(tempFilePath, data);
    console.log('File created temporarily at:', tempFilePath)

    try {
      // Create file object from file path
      const zgFile = await ZgFile.fromFilePath(tempFilePath);

      // Generate Merkle tree for verification
      const [tree, treeErr] = await zgFile.merkleTree();
      if (treeErr !== null) {
        throw new Error(`Error generating Merkle tree: ${treeErr}`);
      }
    
      // Get root hash for future reference
      const rootHash = tree?.rootHash();
      if (!rootHash) {
        throw new Error('Failed to get root hash');
      }

      // Upload the file
      const [tx, uploadErr] = await this.indexer.upload(zgFile, this.rpcUrl, this.signer);
      if (uploadErr !== null) {
        console.log(`Upload error: ${uploadErr}`);
      }

      console.log(`Uploaded chat ${chat.chatId} successfuly, transaction hash: ${tx}`);

      // Close the file
      await zgFile.close();

      // Return the root hash to the frontend
      return rootHash;
    } catch (error) {
      console.error(`Failed to save chat ${chat.chatId}:`, error);
      throw error;
    } finally {
      // Clean up the temporary file
      await fs.unlink(tempFilePath).catch((err) => {
        console.error(`Failed to delete temp file ${tempFilePath}:`, err);
      });
    }
  }

  // Fetch multiple chats by their root hashes
  async getChatsByRootHashes(rootHashes: string[]): Promise<Chat[]> {
    const chats: Chat[] = [];

    for (const rootHash of rootHashes) {
      // Download the file to a temporary path
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `download_${rootHash.slice(0, 8)}.json`);

      try {
        // Download with proof verification
        const downloadErr = await this.indexer.download(rootHash, tempFilePath, false);
        if (downloadErr !== null) {
          console.error(`Failed to download file for root hash ${rootHash}: ${downloadErr}`);
          continue;
        }
        console.log('File downloaded successfully at:', tempFilePath)

        // Read the downloaded file into a Buffer
        const data = await fs.readFile(tempFilePath);
        const chat: Chat = JSON.parse(data.toString());
        chats.push(chat);
        console.log(`Successfully fetched chat`);
      } catch (error) {
        console.error(`Failed to fetch chat from file`, error);
        continue;
      } finally {
        // Clean up the temporary file
        await fs.unlink(tempFilePath).catch((err) => {
          console.error(`Failed to delete temp file ${tempFilePath}:`, err);
        });
      }
    }

    return chats;
  }
}

export const zeroGStorage = new ZeroGStorage();