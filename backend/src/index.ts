import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSocket } from './socket';
import { zeroGStorage } from './storage/zeroGStorage';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// API to fetch all chats for a wallet using chatIds and rootHashes
app.get('/history/:wallet', async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const chatIdsParam = req.query.chatIds as string;
    const rootHashesParam = req.query.rootHashes as string;

    if (!chatIdsParam || !rootHashesParam) {
      res.status(400).json({ error: 'chatIds and rootHashes query parameters are required' });
      return; // Return void to satisfy Express handler
    }

    const chatIds = chatIdsParam.split(',');
    const rootHashes = rootHashesParam.split(',');

    if (chatIds.length !== rootHashes.length) {
      res.status(400).json({ error: 'Number of chatIds must match number of rootHashes' });
      return; // Return void
    }

    const chats = await zeroGStorage.getChatsByRootHashes(rootHashes);

    // Filter chats by wallet and update status if expired
    const now = new Date();
    const updatedChats = chats
      .filter((chat) => chat.wallet === wallet)
      .map((chat) => {
        const expiresAt = new Date(chat.expiresAt);
        if (now > expiresAt && chat.status !== 'resolved') {
          chat.status = 'expired';
          // We won't save the updated status to 0g.ai to keep the demo simple
        }
        return chat;
      });

    res.json(updatedChats);
  } catch (error) {
    console.error(`Error fetching chats for wallet ${req.params.wallet}:`, error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
  // No explicit return needed here; the handler should return void
});

// Set up socket.io
setupSocket(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});