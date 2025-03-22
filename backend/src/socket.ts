import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { zeroGStorage } from './storage/zeroGStorage';
import { Chat, Message } from './types';
import { handleFoodDeliveryQuery } from './agents/foodDeliveryagent';
import { handleEcommerceQuery } from './agents/ecommerceAgent';
import { chatLogger } from './blockchain/chatLogger';
import { refundWithAgentKit } from './agents/coinbaseAgentKit';

interface ActiveChat {
  chat: Chat;
  rootHash: string;
  refundIssued: boolean;
}

const activeChats: { [chatId: string]: ActiveChat } = {};

export function setupSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('start_chat', async (data: { wallet: string; context: string }) => {
      console.log('Socket: Start chat');
      const { wallet, context } = data;
      const chatId = `chat_${uuidv4()}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      const chat: Chat = {
        chatId,
        wallet,
        category: context,
        status: 'ongoing',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        messages: [],
        rating: null,
      };

      activeChats[chatId] = { chat, rootHash: '', refundIssued: false };

      socket.join(chatId);
      socket.emit('chat_started', { chatId });
    });

    socket.on('send_message', async (data: { chatId: string; content: string }) => {
      console.log('Socket: Received user message');
      const { chatId, content } = data;
      const activeChat = activeChats[chatId];
      if (!activeChat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      const userMessage: Message = {
        id: uuidv4(), // Add unique ID for the user message
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };
      activeChat.chat.messages.push(userMessage);

      let supportResponse: string;
      
      if (activeChat.chat.category === 'Food Delivery') {
        supportResponse = await handleFoodDeliveryQuery(content, activeChat.chat);
      } else if (activeChat.chat.category === 'Ecommerce') {
        supportResponse = await handleEcommerceQuery(content, activeChat.chat);
      } else {
        supportResponse = 'I am not sure how to assist with that. Please provide more details.';
      }

      const supportMessage: Message = {
        id: uuidv4(), // Add unique ID for the support message
        role: 'support',
        content: supportResponse,
        timestamp: new Date().toISOString(),
      };
      activeChat.chat.messages.push(supportMessage);
      io.to(chatId).emit('message', supportMessage);

      // Check if the support response includes the refund trigger phrase
      if (
        supportResponse.includes('I am working to process') && supportResponse.includes('refund') &&
        !activeChat.refundIssued
      ) {
        try {
          // Trigger refund via Coinbase AgentKit
          const refundAmount = Math.round((Math.random() * (0.0001 - 0.00001) + 0.00001) * 100000) / 100000; // Random value between 0.00001 to 0.0001 (in ETH), rounded off to 5 decimal places
          const txlink = await refundWithAgentKit(activeChat.chat.wallet, refundAmount);

          // Mark refund as issued to prevent duplicates
          activeChat.refundIssued = true;

          // Notify the LLM (and frontend) that the refund has been processed
          const refundMessage: Message = {
            id: uuidv4(),
            role: 'support',
            content: `The refund of ${refundAmount} ETH has been successfully processed to your wallet. 
            You can check its status at the following link: ${txlink}`,
            timestamp: new Date().toISOString(),
          };
          activeChat.chat.messages.push(refundMessage);
          io.to(chatId).emit('message', refundMessage);
        
        } catch (error) {
          console.error(`Error processing refund for chat ${chatId}:`, error);
          const errorMessage: Message = {
            id: uuidv4(),
            role: 'support',
            content: 'I encountered an issue while processing your refund. I’ve escalated this to our team, and we’ll ensure it’s resolved soon.',
            timestamp: new Date().toISOString(),
          };
          activeChat.chat.messages.push(errorMessage);
          io.to(chatId).emit('message', errorMessage);
        }
      }
    });

    socket.on('end_chat', async (data: { chatId: string; rating: number | null }) => {
      console.log('Socket: End chat');
      const { chatId, rating } = data;
      const activeChat = activeChats[chatId];
      if (!activeChat) {
        socket.emit('error', { message: 'Failed to end chat: Chat not found' });
        return;
      }

      // Update the chat with the rating and status
      activeChat.chat.rating = rating;
      activeChat.chat.status = 'resolved';

      try {
        // Save the entire chat to 0g.ai
        // TODO: Fix
        // const rootHash = await zeroGStorage.saveChat(activeChat.chat);
        activeChat.rootHash = uuidv4();

        // Log the chat resolution to the blockchain
        // await chatLogger.logChatResolution(activeChat.chat.chatId, activeChat.chat.status);

        // Emit the final rootHash to the frontend
        io.to(chatId).emit('chat_resolved', { chatId, roothash: activeChat.rootHash });

        // Clean up
        delete activeChats[chatId];
        socket.leave(chatId);
      } catch (error) {
        console.error(`Error ending chat ${chatId}:`, error);
        socket.emit('error', { message: 'Failed to end chat' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}