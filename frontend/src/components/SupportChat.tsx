import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Stack, Input, Button, Text, Flex, Icon } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import io, { Socket } from 'socket.io-client';

interface SupportChatProps {
  wallet: string;
  category?: string; // Made optional since it's also coming from useParams
  onEndChat: () => void;
}

interface Message {
  id: string;
  role: string;
  content: string;
  timestamp?: string;
}

const SupportChat = ({ wallet, category: propCategory, onEndChat }: SupportChatProps) => {
  const { category: urlCategory } = useParams<{ category: string }>();
  const category = propCategory || urlCategory || 'Food Delivery'; // Fallback to 'Food Delivery' if undefined
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chatId
    const newChatId = 'chat_' + Date.now();
    setChatId(newChatId);

    // Connect to Socket.IO server
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      // Start the chat
      socketInstance.emit('start_chat', { wallet, context: category });
      console.log('Starting chat');
    });

    socketInstance.on('chat_started', (data: { chatId: string }) => {
      setChatId(data.chatId);
      console.log('Chat started with ID:', data.chatId);
    });

    socketInstance.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      console.log('Received message:', message);
    });

    socketInstance.on('chat_resolved', (data: { chatId: string; rootHash: string, txhash: string }) => {
      console.log('Chat resolved');
      saveChatMetadata(data.chatId, data.rootHash, data.txhash);
      navigate(`/feedback/${data.chatId}`);
      onEndChat();
    });

    return () => {
      socketInstance.disconnect();
      console.log('Disconnected from Socket.IO server');
    };
  }, [wallet, category, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveChatMetadata = (chatId: string, rootHash: string, txhash: string) => {
    const chatMetadata = JSON.parse(localStorage.getItem('chatMetadata') || '{}');
    if (!chatMetadata[wallet]) {
      chatMetadata[wallet] = [];
    }
    const chatEntry = chatMetadata[wallet].find((entry: any) => entry.chatId === chatId);
    if (chatEntry) {
      chatEntry.rootHash = rootHash;
      chatEntry.txhash = txhash;
    } else {
      chatMetadata[wallet].push({ chatId, rootHash, txhash });
    }
    localStorage.setItem('chatMetadata', JSON.stringify(chatMetadata));
  };

  const handleSendMessage = () => {
    if (!input.trim() || !socket || !chatId) return;

    const userMessage: Message = {
      id: 'temp_' + Date.now(), // Temporary ID for UI, until the backend assigns a real one
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    socket.emit('send_message', { chatId, content: input });
    console.log('Sending message:', input);
    setInput('');
  };

  const handleEndChat = () => {
    if (socket && chatId) {
      socket.emit('end_chat', { chatId, rating: null }); // Rating will be set in ChatFeedback
      console.log('Ending chat:', chatId);
    }
  };

  return (
    <Box maxW="1000px" mx="auto" bg="white" p={8} rounded="xl" shadow="lg">
      <Flex justify="space-between" mb={6}>
        <Heading 
          as="h2" 
          size="lg"
          color="black"
        >
          {category} Support
        </Heading>
        <Button
          onClick={handleEndChat}
          color="red"
          size="lg"
          background="white"
          px={8}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          transition="all 0.2s"
        >
          End Chat
        </Button>
      </Flex>
      <Stack
        h="500px"
        overflowY="auto"
        bg="gray.50"
        rounded="lg"
        p={6}
        gap={4}
        align="stretch"
        mb={6}
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'gray.100',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'gray.300',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'gray.400',
            },
          },
        }}
      >
        {messages.map((msg) => (
          <Flex key={msg.id} justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
            <Box
              maxW="70%"
              p={4}
              bg={msg.role === 'user' ? 'brand.primary' : 'white'}
              color={msg.role === 'user' ? 'white' : 'gray.800'}
              rounded="2xl"
              shadow="sm"
              position="relative"
              css={{
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '12px',
                  [msg.role === 'user' ? 'right' : 'left']: '-6px',
                  borderStyle: 'solid',
                  borderColor: `transparent ${msg.role === 'user' ? 'brand.primary' : 'white'} transparent transparent`,
                  transform: msg.role === 'user' ? 'rotate(180deg)' : 'none',
                }
              }}
            >
              <Text>
                {msg.content.split(' ').map((word) => {
                  if (word.startsWith('http://') || word.startsWith('https://')) {
                    return <a href={word} target="_blank" rel="noopener noreferrer" style={{ color: 'blue.500', textDecoration: 'underline' }}>{word}</a>;
                  }
                  return word + ' ';
                })}
              </Text>
              {msg.timestamp && (
                <Text fontSize="xs" color={msg.role === 'user' ? 'gray.200' : 'gray.500'} mt={1}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </Text>
              )}
            </Box>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Stack>
      <Flex gap={4}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          size="lg"
          borderColor="brand.primary"
          bg="gray.50"
          border="2px solid"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ bg: 'white' }}
        />
        <Button
          onClick={handleSendMessage}
          bg="brand.primary"
          color="white"
          size="lg"
          px={8}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          transition="all 0.2s"
        >
          <Flex align="center" gap={2}>
            <Icon as={FiSend} />
            <Text>Send</Text>
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
};

export default SupportChat;