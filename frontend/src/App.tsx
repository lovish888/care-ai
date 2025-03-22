import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Flex, Heading, Button, Text, Image } from '@chakra-ui/react';
import MainMenu from './components/MainMenu';
import Chat from './components/Chat';
import History from './components/History';
import PostChat from './components/PostChat';

function App() {
  const { login, authenticated, user } = usePrivy();
  const [wallet, setWallet] = useState<string | null>(null);

  if (authenticated && user?.wallet?.address && wallet !== user.wallet.address) {
    setWallet(user.wallet.address);
  }

  return (
    <Router>
      <Box minH="100vh" bg="brand.secondary">
        <Box as="header" bg="white" shadow="md" p={4}>
          <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
            <Flex align="center">
              <Image src="/logo.jpg" alt="care-ai Logo" h="40px" mr={3} />
              <Heading as="h1" size="lg" color="gray.800">
                Care AI
              </Heading>
            </Flex>
            {authenticated && wallet && (
              <Flex gap={4}>
                <Link to="/">
                  <Button variant="link" color="brand.primary">
                    Home
                  </Button>
                </Link>
                <Link to="/history">
                  <Button variant="link" color="brand.primary">
                    History
                  </Button>
                </Link>
              </Flex>
            )}
          </Flex>
        </Box>

        <Box as="main" p={6}>
          {authenticated && wallet ? (
            <Routes>
              <Route path="/" element={<MainMenu wallet={wallet} />} />
              <Route path="/chat/:context" element={<Chat wallet={wallet} />} />
              <Route path="/post-chat/:chatId" element={<PostChat wallet={wallet} />} />
              <Route path="/history" element={<History wallet={wallet} />} />
            </Routes>
          ) : (
            <Flex direction="column" align="center" justify="center" h="calc(100vh - 80px)">
              <Heading as="h2" size="xl" color="gray.700" mb={4}>
                Welcome to care-ai
              </Heading>
              <Text color="gray.500" mb={6}>
                Connect your wallet to get started with seamless support.
              </Text>
              <Button
                onClick={login}
                bg="brand.primary"
                color="white"
                size="lg"
                px={8}
                py={6}
                _hover={{ bg: 'blue.700' }}
              >
                Connect Wallet
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
    </Router>
  );
}

export default App;