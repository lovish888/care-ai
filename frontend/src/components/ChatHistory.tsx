import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Stack, Button, Flex, Badge, Icon } from "@chakra-ui/react";
import { FiTruck, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

interface ChatHistoryProps {
  wallet: string;
}

interface ChatEntry {
  id: string;
  category: string;
  status: "resolved" | "pending" | "closed";
  lastUpdated: string;
  resolution?: string;
  rating?: number;
}

const ChatHistory = ({ wallet }: ChatHistoryProps) => {
  const [filter, setFilter] = useState<string>("all");
  
  // Mock chat history data
  const [chats] = useState<ChatEntry[]>([
    {
      id: "chat_1721384522",
      category: "Food Delivery",
      status: "resolved",
      lastUpdated: "2023-10-15",
      resolution: "Refund processed for missing items",
      rating: 4,
    },
    {
      id: "chat_1721381234",
      category: "Ecommerce",
      status: "resolved",
      lastUpdated: "2023-10-10",
      resolution: "Replacement shipped for damaged product",
      rating: 5,
    },
    {
      id: "chat_1721380321",
      category: "Food Delivery",
      status: "closed",
      lastUpdated: "2023-10-05",
      resolution: "Delivery delay compensation provided",
      rating: 3,
    },
    {
      id: "chat_1721376543",
      category: "Ecommerce",
      status: "pending",
      lastUpdated: "2023-10-01",
    },
  ]);

  // Filter chats based on selected filter
  const filteredChats = filter === "all" 
    ? chats 
    : chats.filter(chat => chat.status === filter);

  // Get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return { bg: "green.100", text: "green.700" };
      case "pending":
        return { bg: "yellow.100", text: "yellow.700" };
      case "closed":
        return { bg: "gray.100", text: "gray.700" };
      default:
        return { bg: "blue.100", text: "blue.700" };
    }
  };

  return (
    <Box maxW="4xl" mx="auto">
      <Box mb={8}>
        <Heading 
          as="h2" 
          size="lg"
          bgGradient="linear(to-r, brand.primary, blue.600)"
          bgClip="text"
          mb={2}
        >
          Your Support History
        </Heading>
        <Text color="gray.600" mb={6}>
          View and manage your past support conversations
        </Text>

        <Flex flexWrap="wrap" justify="space-between" gap={4} mb={6}>
          <Flex flexWrap="wrap" gap={2}>
            <Button
              variant={filter === "all" ? "solid" : "outline"}
              onClick={() => setFilter("all")}
              bg={filter === "all" ? "brand.primary" : undefined}
              color={filter === "all" ? "white" : undefined}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === "resolved" ? "solid" : "outline"}
              onClick={() => setFilter("resolved")}
              bg={filter === "resolved" ? "green.500" : undefined}
              color={filter === "resolved" ? "white" : undefined}
              size="sm"
            >
              Resolved
            </Button>
            <Button
              variant={filter === "pending" ? "solid" : "outline"}
              onClick={() => setFilter("pending")}
              bg={filter === "pending" ? "yellow.500" : undefined}
              color={filter === "pending" ? "white" : undefined}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filter === "closed" ? "solid" : "outline"}
              onClick={() => setFilter("closed")}
              bg={filter === "closed" ? "gray.500" : undefined}
              color={filter === "closed" ? "white" : undefined}
              size="sm"
            >
              Closed
            </Button>
          </Flex>
          
        </Flex>
      </Box>

      {filteredChats.length === 0 ? (
        <Box textAlign="center" py={12} bg="white" rounded="lg" border="1px" borderColor="gray.100">
          <Text color="gray.500">No chat history found for this filter</Text>
        </Box>
      ) : (
        <Stack gap={4} align="stretch">
          {filteredChats.map((chat) => (
            <Box 
              key={chat.id} 
              bg="white" 
              p={4} 
              rounded="lg" 
              shadow="md" 
              border="1px" 
              borderColor="gray.100"
              transition="all 0.2s"
              _hover={{ shadow: "md" }}
            >
              <Flex flexWrap="wrap" justify="space-between" align="start" gap={3} mb={3}>
                <Flex align="center" gap={2}>
                  <Flex 
                    p={2} 
                    rounded="full" 
                    bg={chat.category.includes("Food") ? "blue.50" : "purple.50"}
                    justify="center"
                    align="center"
                  >
                    <Icon 
                      as={chat.category.includes("Food") ? FiTruck : FiShoppingBag} 
                      boxSize={5} 
                    />
                  </Flex>
                  <Box>
                    <Heading as="h3" size="sm">{chat.category} Support</Heading>
                    <Text fontSize="sm" color="gray.500">{chat.id.replace("chat_", "#")}</Text>
                  </Box>
                </Flex>
                <Badge 
                  px={2.5} 
                  py={1} 
                  rounded="full" 
                  fontSize="xs" 
                  bg={getStatusColor(chat.status).bg} 
                  color={getStatusColor(chat.status).text}
                >
                  {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                </Badge>
              </Flex>

              {chat.resolution && (
                <Box mb={3}>
                  <Text fontSize="sm" color="gray.600">
                    <Text as="span" fontWeight="medium">Resolution:</Text> {chat.resolution}
                  </Text>
                </Box>
              )}

              {chat.rating && (
                <Flex align="center" gap={1} mb={3}>
                  <Text fontSize="sm" color="gray.600" mr={1}>Rating:</Text>
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      as={FaStar}
                      boxSize={4}
                      color={i < chat.rating! ? "yellow.400" : "gray.300"}
                    />
                  ))}
                </Flex>
              )}

              <Text fontSize="xs" color="gray.500">
                Last updated: {chat.lastUpdated}
              </Text>

              <Flex justify="flex-end" mt={4} pt={2} borderTop="1px" borderColor="gray.100">
                <Link to={`/chat/${chat.category}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    color="brand.primary"
                    _hover={{ bg: "blue.50" }}
                  >
                    <Flex align="center" gap={1}>
                      View Chat
                      <Icon as={FiArrowRight} />
                    </Flex>
                  </Button>
                </Link>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ChatHistory;