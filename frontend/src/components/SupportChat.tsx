import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Stack, Input, Button, Text, Flex, Icon } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';

interface SupportChatProps {
  wallet: string;
}

interface Message {
  role: string;
  content: string;
}

const SupportChat = ({ wallet }: SupportChatProps) => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'support', content: `Welcome to ${category} support! How may I assist you today?` },
  ]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatId('chat_' + Date.now());
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const supportMessage: Message = { role: 'support', content: "I'm looking into your issue—this is now resolved." };
      setMessages((prev) => [...prev, supportMessage]);
      if (supportMessage.content.includes('resolved')) {
        setTimeout(() => {
          navigate(`/feedback/${chatId}`);
        }, 1000);
      }
    }, 1000);
  };

  return (
    <Box maxW="900px" mx="auto" bg="white" p={8} rounded="xl" shadow="lg">
      <Heading 
        as="h2" 
        size="lg" 
        color="gray.800" 
        mb={6}
        bgGradient="linear(to-r, brand.primary, blue.600)"
        bgClip="text"
      >
        {category} Support
      </Heading>
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
        {messages.map((msg, index) => (
          <Flex key={index} justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
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
                  borderWidth: '6px',
                  borderColor: `transparent ${msg.role === 'user' ? 'brand.primary' : 'white'} transparent transparent`,
                  transform: msg.role === 'user' ? 'rotate(180deg)' : 'none',
                }
              }}
            >
              <Text>{msg.content}</Text>
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