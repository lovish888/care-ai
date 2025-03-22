import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { usePrivy } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import MainMenu from "./components/MainMenu";
import SupportChat from "./components/SupportChat";
import ChatHistory from "./components/ChatHistory";
import ChatFeedback from "./components/ChatFeedback";
import { Box, Text, Button } from '@chakra-ui/react';

const App = () => {
  const { login, authenticated, user, ready } = usePrivy();
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && user?.wallet?.address && wallet !== user.wallet.address) {
      setWallet(user.wallet.address);
      console.log("User authenticated with wallet:", user.wallet.address);
    }
  }, [authenticated, user, wallet]);

  // Wait for Privy to be ready
  if (!ready) {
    return (
      <Box p={8} textAlign="center">
        <Text>Loading authentication...</Text>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout authenticated={authenticated} wallet={wallet} />}>
          <Route index element={
            authenticated ? <Navigate to="/dashboard" replace /> : <LandingPage onLogin={login} />
          } />
          {authenticated && wallet && (
            <>
              <Route path="dashboard" element={<MainMenu wallet={wallet} />} />
              <Route path="chat/:category" element={<SupportChat wallet={wallet} />} />
              <Route path="history" element={<ChatHistory wallet={wallet} />} />
              <Route path="feedback/:chatId" element={<ChatFeedback wallet={wallet} />} />
            </>
          )}
          {authenticated && !wallet && (
            <Route path="*" element={
              <Box p={8} textAlign="center">
                <Text fontSize="xl" mb={4}>Wallet connection required</Text>
                <Text color="gray.600" mb={6}>
                  Please connect your wallet to access this feature.
                </Text>
                <Button 
                  bg="brand.primary" 
                  color="white" 
                  onClick={login}
                >
                  Connect Wallet
                </Button>
              </Box>
            } />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;