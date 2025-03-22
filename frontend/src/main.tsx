import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrivyProvider } from "@privy-io/react-auth";
import { ChakraProvider } from '@chakra-ui/react';
import { createSystem, defineConfig, defaultConfig } from '@chakra-ui/react';

// Define the custom theme using defineConfig
const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: '#676FFF' },
          secondary: { value: '#F3F4F6' },
          accent: { value: '#FF6B6B' },
        },
      },
      fonts: {
        heading: { value: `'Inter', sans-serif` },
        body: { value: `'Inter', sans-serif` },
      },
    },
  },
});

// Create the system with the custom config
const customSystem = createSystem(defaultConfig, customConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: "/logo.jpg",
        },
        loginMethods: ["wallet"],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <ChakraProvider value={customSystem}>
        <App />
      </ChakraProvider>
    </PrivyProvider>
  </StrictMode>
);
