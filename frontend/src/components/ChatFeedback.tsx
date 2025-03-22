import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Stack, Button, Flex, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';

interface ChatFeedbackProps {
  wallet: string;
}

const ChatFeedback = ({ wallet }: ChatFeedbackProps) => {
  const { chatId } = useParams();
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
        <Stack gap={4}>
          <Text color="gray.600">
            How would you rate this support session? (1-5 stars)
          </Text>
          
          <Flex gap={2} justify="center">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <Icon
                  key={index}
                  as={FaStar}
                  boxSize={8}
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
            disabled={!rating}
            bg="brand.primary"
            color="white"
            size="lg"
            width="full"
            _hover={{ bg: 'blue.700' }}
            _disabled={{
              bg: 'gray.400',
              cursor: 'not-allowed'
            }}
          >
            Submit Rating
          </Button>
        </Stack>
      ) : (
        <Stack gap={3}>
          <Text color="gray.600">
            Thank you for your feedback!
          </Text>
          
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
            onClick={() => navigate('/dashboard')}
            bg="gray.500"
            color="white"
            size="lg"
            w="full"
            _hover={{ bg: 'gray.600' }}
          >
            Back to Home
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default ChatFeedback;