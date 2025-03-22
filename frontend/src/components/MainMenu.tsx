import { Link } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, CardHeader } from '@chakra-ui/react';

interface MainMenuProps {
  wallet: string;
}

function MainMenu({ wallet }: MainMenuProps) {
  return (
    <Box maxW="800px" mx="auto">
      <Heading as="h2" size="lg" color="gray.800" mb={6}>
        Welcome, {wallet.slice(0, 6)}...{wallet.slice(-4)}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Link to="/chat/Food Delivery">
          <Card.Root bg="white" shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardHeader>
              <Heading as="h3" size="md" color="gray.700">
                Food Delivery Support
              </Heading>
            </CardHeader>
            <CardBody>
              <Text color="gray.500">
                Raise a complaint or get help with your food delivery.
              </Text>
            </CardBody>
          </Card.Root>
        </Link>
        <Link to="/chat/Ecommerce">
          <Card.Root bg="white" shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
            <CardHeader>
              <Heading as="h3" size="md" color="gray.700">
                Ecommerce Support
              </Heading>
            </CardHeader>
            <CardBody>
              <Text color="gray.500">
                Get assistance with your online shopping issues.
              </Text>
            </CardBody>
          </Card.Root>
        </Link>
      </SimpleGrid>
    </Box>
  );
}

export default MainMenu;