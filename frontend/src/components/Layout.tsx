import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Button,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IoLogOutOutline } from "react-icons/io5";
import { usePrivy } from "@privy-io/react-auth";
import { FaUserCircle } from "react-icons/fa";

interface LayoutProps {
  authenticated: boolean;
  wallet: string | null;
}

const Layout = ({ authenticated, wallet }: LayoutProps) => {
  const {
    open: menuOpen,
    onClose: closeMenu,
    onToggle: toggleMenu,
  } = useDisclosure();
  const { logout } = usePrivy();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Box
        as="header"
        bg="white"
        boxShadow="lg"
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={4}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap="4">
            <Image src="/logo.jpg" alt="CareAI Logo" h="45px" rounded="md" />
            <Heading as="h1" size="lg" color="black">
              CareAI
            </Heading>
          </Flex>

          {authenticated && wallet && (
            <Flex gap="6" align="center">
              <Flex justify="center" align="center" flex={1}>
                <Flex
                  bg="brand.secondary"
                  rounded="full"
                  p={1}
                  justify="center"
                >
                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      color={
                        location.pathname === "/dashboard"
                          ? "white"
                          : "gray.700"
                      }
                      fontSize="md"
                      fontWeight="600"
                      px={6}
                      py={2}
                      rounded="full"
                      transition="all 0.2s"
                      bg={
                        location.pathname === "/dashboard"
                          ? "brand.primary"
                          : "transparent"
                      }
                      _hover={{}}
                    >
                      Home
                    </Button>
                  </Link>
                  <Link to="/history">
                    <Button
                      variant="ghost"
                      color={
                        location.pathname === "/history" ? "white" : "gray.700"
                      }
                      fontSize="md"
                      fontWeight="600"
                      px={6}
                      py={2}
                      rounded="full"
                      transition="all 0.2s"
                      bg={
                        location.pathname === "/history"
                          ? "brand.primary"
                          : "transparent"
                      }
                      _hover={{}}
                    >
                      History
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          )}
          {authenticated && wallet && (
            <Flex gap="6" align="center">
              <Box position="relative">
                <Box
                  as="button"
                  onClick={toggleMenu}
                  rounded="full"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  h="40px"
                  bg="brand.primary"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  paddingRight={4}
                  paddingLeft={4}
                  _hover={{
                    transition: "all 0.2s",
                    cursor: "pointer",
                    shadow: "md",
                  }}
                >
                  <FaUserCircle size={24} />
                  <Box mx={1} />
                  <Text>{wallet.slice(0, 2) + "..." + wallet.slice(-2)}</Text>
                </Box>

                {menuOpen && (
                  <Box
                    position="absolute"
                    top="100%"
                    right="0"
                    mt="2"
                    bg="white"
                    boxShadow="md"
                    rounded="md"
                    minW="200px"
                    zIndex={2}
                  >
                    <Box
                      as="button"
                      onClick={() => {
                        navigator.clipboard.writeText(wallet);
                        closeMenu();
                      }}
                      width="100%"
                      py="2"
                      px="3"
                      _hover={{ bg: "gray.100" }}
                    >
                      <Box fontWeight="medium">Wallet</Box>
                      <Box fontSize="sm" color="gray.500">
                        {wallet.slice(0, 6)}...{wallet.slice(-4)}
                      </Box>
                    </Box>
                    <Box
                      as="button"
                      onClick={handleLogout}
                      display="flex"
                      alignItems="center"
                      width="100%"
                      textAlign="left"
                      py="2"
                      px="3"
                      _hover={{ bg: "gray.100" }}
                    >
                      <IoLogOutOutline
                        size={16}
                        style={{ marginRight: "8px" }}
                      />
                      <Text>Logout</Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Flex>
          )}
        </Flex>
      </Box>

      <Box as="main" p={6} maxW="1200px" mx="auto">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
