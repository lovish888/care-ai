import { Link } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  Grid, 
  Flex, 
  Icon 
} from '@chakra-ui/react';
import { FiTruck, FiShoppingBag } from 'react-icons/fi';

interface MainMenuProps {
  wallet: string;
}

const MainMenu = ({ wallet }: MainMenuProps) => {

  return (
    <Box maxW="1000px" mx="auto">
      <Heading 
        as="h2" 
        size="lg" 
        color="gray.800" 
        mb={8}
        bgGradient="linear(to-r, brand.primary, blue.600)"
        bgClip="text"
      >
        Welcome, {wallet.slice(0, 6)}...{wallet.slice(-4)}
      </Heading>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <Link to="/chat/Food Delivery">
          <Box
            bg="white" 
            shadow="md" 
            _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} 
            transition="all 0.2s"
            h="full"
            p={6}
            borderRadius="md"
          >
            <Box as="header" mb={4}>
              <Flex align="center" gap={3}>
                <Icon as={FiTruck} boxSize={6} color="brand.primary" />
                <Heading as="h3" size="md" color="gray.700">
                  Food Delivery Support
                </Heading>
              </Flex>
            </Box>
            <Box>
              <Text color="gray.600">
                Get instant help with your food delivery issues, track orders, and resolve complaints.
              </Text>
            </Box>
          </Box>
        </Link>
        <Link to="/chat/Ecommerce">
          <Box
            bg="white" 
            shadow="md" 
            _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} 
            transition="all 0.2s"
            h="full"
            p={6}
            borderRadius="md"
          >
            <Box as="header" mb={4}>
              <Flex align="center" gap={3}>
                <Icon as={FiShoppingBag} boxSize={6} color="brand.primary" />
                <Heading as="h3" size="md" color="gray.700">
                  Ecommerce Support
                </Heading>
              </Flex>
            </Box>
            <Box>
              <Text color="gray.600">
                Get assistance with orders, returns, refunds, and other shopping-related issues.
              </Text>
            </Box>
          </Box>
        </Link>
      </Grid>
    </Box>
  );
};

export default MainMenu;