import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, VStack, Input, Button, Text, Flex } from '@chakra-ui/react';

interface ChatProps {
  wallet: string;
}

interface Message {
  role: string;
  content: string;
}

function Chat({ wallet }: ChatProps) {
  const { context } = useParams<{ context: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'support', content: 'Welcome to care-ai support! How may I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    setChatId('chat_' + Date.now());
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const supportMessage: Message = { role: 'support', content: 'I’m looking into your issue—resolved.' };
      setMessages((prev) => [...prev, supportMessage]);
      if (supportMessage.content.includes('resolved')) {
        navigate(`/post-chat/${chatId}`);
      }
    }, 1000);
  };

  return (
    <Box maxW="900px" mx="auto" bg="white" p={6} rounded="lg" shadow="md">
      <Heading as="h2" size="md" color="gray.800" mb={4}>
        {context} Support
      </Heading>
      <VStack
        h="400px"
        overflowY="auto"
        border="1px"
        borderColor="gray.200"
        rounded="md"
        p={4}
        spacing={3}
        align="stretch"
        mb={4}
      >
        {messages.map((msg, index) => (
          <Flex key={index} justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
            <Box
              maxW="70%"
              p={3}
              bg={msg.role === 'user' ? 'brand.primary' : 'gray.100'}
              color={msg.role === 'user' ? 'white' : 'gray.800'}
              rounded="lg"
            >
              <Text>{msg.content}</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
      <Flex gap={3}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          size="lg"
          focusBorderColor="brand.primary"
        />
        <Button
          onClick={handleSendMessage}
          bg="brand.primary"
          color="white"
          size="lg"
          _hover={{ bg: 'blue.700' }}
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}

export default Chat;