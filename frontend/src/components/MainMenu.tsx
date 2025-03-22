import { Link } from "react-router-dom";
import { Box, Heading, Text, Grid, Flex, Icon } from "@chakra-ui/react";
import { FiTruck, FiShoppingBag } from "react-icons/fi";
import SupportChat from "./SupportChat";
import { useState, useEffect } from "react";

interface MainMenuProps {
  wallet: string;
}

const MainMenu = ({ wallet }: MainMenuProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for active chat state
    const activeChat = localStorage.getItem("activeChat");
    if (activeChat) {
      const { category } = JSON.parse(activeChat);
      setSelectedCategory(category);
      setIsChatOpen(true);
    }
  }, []);

  const handleSupportSelect = (category: string) => {
    setSelectedCategory(category);
    setIsChatOpen(true);
    // Save active chat state to localStorage
    localStorage.setItem("activeChat", JSON.stringify({ category }));
  };

  const handleEndChat = () => {
    setIsChatOpen(false);
    setSelectedCategory(null);
    // Remove active chat state from localStorage
    localStorage.removeItem("activeChat");
  };

  return (
    <Box maxW="1000px" mx="auto">
      {!isChatOpen && (
        <Heading as="h3" size="lg" color="gray.700" mt={16} mb={8} textAlign="center">
          What do you need help with?
        </Heading>
      )}
      {!isChatOpen && (
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <Link to="#" onClick={() => handleSupportSelect("Food Delivery")}>
            <Box
              bg={"white"}
              shadow="md"
              _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
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
                  Get instant help with your food delivery issues, track orders,
                  and resolve complaints.
                </Text>
              </Box>
            </Box>
          </Link>
          <Link to="#" onClick={() => handleSupportSelect("Ecommerce")}>
            <Box
              bg={"white"}
              shadow="md"
              _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
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
                  Get assistance with orders, returns, refunds, and other
                  shopping-related issues.
                </Text>
              </Box>
            </Box>
          </Link>
        </Grid>
      )}
      {isChatOpen && selectedCategory && (
        <Box mt={8}>
          <SupportChat
            wallet={wallet}
            category={selectedCategory}
            onEndChat={handleEndChat}
          />
        </Box>
      )}
    </Box>
  );
};

export default MainMenu;
