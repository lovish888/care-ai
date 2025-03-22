import { Box, Flex, Heading, Text, Button, SimpleGrid, Icon, Image } from "@chakra-ui/react";
import { FiWifi, FiList, FiMessageCircle, FiArrowRight } from "react-icons/fi";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  return (
    <Flex direction="column" align="center" justify="center" minH="calc(100vh - 400px)" textAlign="center" p={4}>
      <Box maxW="4xl" mx="auto">
          <Flex
            w="48"
            h="48"
            align="center"
            justify="center"
            mx="auto"
          >
            <Image src="/logo.jpg" alt="CareAI Logo" h="84px" mr={4} rounded="md" />
          </Flex>
        
        <Heading 
          as="h1" 
          size="3xl" 
          mb={6}
          color="gray.600"
          lineHeight="1.2"
        >
          AI-Powered Support
          <br />
          Fast & Efficient
        </Heading>
        
        <Text color="gray.600" fontSize="xl" maxW="2xl" mx="auto" mb={12}>
          Connect your wallet to access personalized AI support for food delivery 
          and e-commerce services. Resolve issues instantly with our intelligent assistant.
        </Text>
        
        <Button
          onClick={onLogin}
          bg="brand.primary"
          color="white"
          size="lg"
          px={8}
          py={7}
          rounded="full"
          fontSize="lg"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          <Flex align="center" gap={2}>
            Connect Wallet
            <Icon as={FiArrowRight} />
          </Flex>
        </Button>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} mt={20}>
          <Box p={6} bg="white" rounded="xl" shadow="md" transition="all 0.2s" _hover={{ shadow: 'lg' }}>
            <Flex
              w="12"
              h="12"
              bg="blue.100"
              rounded="full"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiWifi} color="brand.primary" boxSize={5} />
            </Flex>
            <Heading as="h3" size="md" mb={2}>Connect Wallet</Heading>
            <Text color="gray.600" fontSize="sm">Securely connect your wallet for personalized support sessions.</Text>
          </Box>
          
          <Box p={6} bg="white" rounded="xl" shadow="md" transition="all 0.2s" _hover={{ shadow: 'lg' }}>
            <Flex
              w="12"
              h="12"
              bg="blue.100"
              rounded="full"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiList} color="brand.primary" boxSize={5} />
            </Flex>
            <Heading as="h3" size="md" mb={2}>Select Category</Heading>
            <Text color="gray.600" fontSize="sm">Choose between food delivery or e-commerce support.</Text>
          </Box>
          
          <Box p={6} bg="white" rounded="xl" shadow="md" transition="all 0.2s" _hover={{ shadow: 'lg' }}>
            <Flex
              w="12"
              h="12"
              bg="blue.100"
              rounded="full"
              align="center"
              justify="center"
              mx="auto"
              mb={4}
            >
              <Icon as={FiMessageCircle} color="brand.primary" boxSize={5} />
            </Flex>
            <Heading as="h3" size="md" mb={2}>Get Support</Heading>
            <Text color="gray.600" fontSize="sm">Instant AI-powered solutions to resolve your issues quickly.</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default LandingPage;