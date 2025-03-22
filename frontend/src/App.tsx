import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import './App.css';

function App() {
  const { login, authenticated, user, logout } = usePrivy();
  const [wallet, setWallet] = useState<string | null>(null);

  // Update wallet state when user logs in
  if (authenticated && user?.wallet?.address && wallet !== user.wallet.address) {
    setWallet(user.wallet.address);
  }

  return (
    <div className="App">
      <h1>CareAI</h1>
      {authenticated && wallet ? (
        <div>
          <p>Connected Wallet: {wallet}</p>
          <p>Welcome to CareAI! You can now start a chat or view past chats.</p>
          <button onClick={logout}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={login}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;