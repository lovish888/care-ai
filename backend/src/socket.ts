import { v4 as uuidv4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { Chat, Message } from './types';
import { zeroGStorage } from './storage/zeroGStorage';
import { handleFoodDeliveryQuery } from './agents/foodDeliveryagent';
import { handleEcommerceQuery } from './agents/ecommerceAgent';

interface ActiveChat {
  chat: Chat;
  socket: Socket;
}

const activeChats: { [chatId: string]: ActiveChat } = {};

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('start_chat', async (data: { wallet: string; context: 'Food Delivery' | 'Ecommerce' }) => {
      const { wallet, context } = data;
      const chatId = `chat_${uuidv4()}`;
      const createdAt = new Date(Date.now()).toISOString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now

      const chat: Chat = {
        chatId,
        wallet,
        context,
        messages: [],
        status: 'ongoing',
        createdAt,
        expiresAt,
        rating: null,
      };

      const welcomeMessage: Message = {
        id: uuidv4(),
        role: 'support',
        content: 'Welcome to CareAI support! How may I assist you today?',
        timestamp: new Date().toISOString(),
      };

      chat.messages.push(welcomeMessage);

      activeChats[chatId] = { chat, socket };

      // Save the chat to 0g.ai and get the root hash
      const rootHash = await zeroGStorage.saveChat(chat);

      // Emit the chatId and rootHash to the frontend
      socket.emit('chat_started', { chatId, rootHash });

      // Send the welcome message
      socket.emit('message', welcomeMessage);
    });

    socket.on('send_message', async (data: { chatId: string; content: string }) => {
      const { chatId, content } = data;
      const activeChat = activeChats[chatId];
      if (!activeChat || activeChat.chat.status !== 'ongoing') return;

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      activeChat.chat.messages.push(userMessage);

      // Save the updated chat to 0g.ai and get the new root hash
      const rootHash = await zeroGStorage.saveChat(activeChat.chat);

      socket.emit('message', userMessage);

      // Emit the new root hash to the frontend
      socket.emit('root_hash_updated', { chatId, rootHash });

      const agentResponse = activeChat.chat.context === 'Food Delivery'
        ? await handleFoodDeliveryQuery(content, activeChat.chat)
        : await handleEcommerceQuery(content, activeChat.chat);

      const supportMessage: Message = {
        id: uuidv4(),
        role: 'support',
        content: agentResponse,
        timestamp: new Date().toISOString(),
      };
      activeChat.chat.messages.push(supportMessage);

      // Save the updated chat again
      const newRootHash = await zeroGStorage.saveChat(activeChat.chat);

      socket.emit('message', supportMessage);

      // Emit the new root hash again
      socket.emit('root_hash_updated', { chatId, rootHash: newRootHash });

      if (supportMessage.content.includes('resolved')) {
        activeChat.chat.status = 'resolved';
        await zeroGStorage.saveChat(activeChat.chat);
        socket.emit('chat_resolved', { chatId });
      }
    });

    socket.on('end_chat', async (data: { chatId: string; rating: number }) => {
      const { chatId, rating } = data;
      const activeChat = activeChats[chatId];
      if (!activeChat) return;

      activeChat.chat.status = 'resolved';
      activeChat.chat.rating = rating;

      // Save the final chat state
      const rootHash = await zeroGStorage.saveChat(activeChat.chat);

      socket.emit('chat_resolved', { chatId, rootHash });

      delete activeChats[chatId];
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const chatId in activeChats) {
        if (activeChats[chatId].socket.id === socket.id) {
          delete activeChats[chatId];
          break;
        }
      }
    });
  });
}