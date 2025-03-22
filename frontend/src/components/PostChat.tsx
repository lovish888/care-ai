import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, VStack, Button, Flex } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface PostChatProps {
  wallet: string;
}

function PostChat({ wallet }: PostChatProps) {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingSubmit = () => {
    if (rating) {
      setSubmitted(true);
    }
  };

  const handleShare = () => {
    alert('Shared on social media!');
  };

  return (
    <Box maxW="500px" mx="auto" bg="white" p={6} rounded="lg" shadow="md" textAlign="center">
      <Heading as="h2" size="md" color="gray.800" mb={4}>
        Chat Ended
      </Heading>
      {!submitted ? (
        <VStack spacing={4}>
          <Text color="gray.600">
            How would you rate this support session? (1-5 stars)
          </Text>
          <Flex gap={2}>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  size={30}
                  color={ratingValue <= (hover || rating || 0) ? '#FFD700' : '#E5E7EB'}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  cursor="pointer"
                />
              );
            })}
          </Flex>
          <Button
            onClick={handleRatingSubmit}
            isDisabled={!rating}
            bg="brand.primary"
            color="white"
            size="lg"
            _hover={{ bg: 'blue.700' }}
            _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
          >
            Submit Rating
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3}>
          <Text color="gray.600">Thank you for your feedback!</Text>
          <Button
            onClick={handleShare}
            bg="brand.accent"
            color="white"
            size="lg"
            w="full"
            _hover={{ bg: 'red.600' }}
          >
            Share on Social Media
          </Button>
          <Button
            onClick={() => navigate('/chat/Food Delivery')}
            bg="brand.primary"
            color="white"
            size="lg"
            w="full"
            _hover={{ bg: 'blue.700' }}
          >
            Raise Further Complaint
          </Button>
          <Button
            onClick={() => navigate('/')}
            bg="gray.500"
            color="white"
            size="lg"
            w="full"
            _hover={{ bg: 'gray.600' }}
          >
            Back to Home
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default PostChat;