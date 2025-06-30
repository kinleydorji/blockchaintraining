import { useState } from "react";

import WalletButton from "./components/WalletButton";
import MintForm from "./components/MintForm";
import UserNFTs from "./components/UserNFTs";
import MarketplaceNFTs from "./components/MarketplaceNFTs";

const App = () => {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  const handleMint = (tokenURI) => {};

  const handleList = (tokenId, price) => {};

  const handleBuy = (tokenId) => {};

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7476/7476273.png"
            alt="logo"
            style={{ width: 40, height: 40 }}
            className="me-2"
          />
          <h4 className="mb-0">NFT Marketplace</h4>
        </div>
        <WalletButton isConnected={connected} onConnect={handleConnect} />
      </div>

      <MintForm onMint={handleMint} />

      <UserNFTs nfts={[]} onList={handleList} />

      <hr className="my-5" />

      <MarketplaceNFTs nfts={[]} onBuy={handleBuy} />
    </div>
  );
};

export default App;
