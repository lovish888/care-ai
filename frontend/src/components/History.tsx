import { Box, Heading, Text, VStack } from '@chakra-ui/react';

interface HistoryProps {
  wallet: string;
}

interface ChatEntry {
  chatId: string;
  context: string;
  resolution: string;
  rating: number;
  shareLink: string;
}

function History({ wallet }: HistoryProps) {
  const chatHistory: ChatEntry[] = [
    {
      chatId: 'chat_123',
      context: 'Food Delivery',
      resolution: 'Refund processed—resolved.',
      rating: 4,
      shareLink: 'https://care-ai.example.com/chat/chat_123',
    },
  ];

  return (
    <Box maxW="900px" mx="auto">
      <Heading as="h2" size="lg" color="gray.800" mb={6}>
        Chat History
      </Heading>
      {chatHistory.length === 0 ? (
        <Text color="gray.600">No past chats found.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {chatHistory.map((chat) => (
            <Box key={chat.chatId} bg="white" p={4} rounded="lg" shadow="md">
              <Heading as="h3" size="sm" color="gray.700">
                {chat.context} Support
              </Heading>
              <Text color="gray.600" mt={1}>
                Resolution: {chat.resolution}
              </Text>
              <Text color="gray.600">
                Rating: {chat.rating} stars
              </Text>
              <Text
                as="a"
                href={chat.shareLink}
                target="_blank"
                rel="noopener noreferrer"
                color="brand.primary"
                _hover={{ textDecoration: 'underline' }}
                mt={2}
                display="inline-block"
              >
                Share Link
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default History;