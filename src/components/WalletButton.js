const WalletButton = ({ isConnected, onConnect }) => {
  return (
    <button
      className="btn btn-primary px-4 py-2 rounded-pill"
      onClick={onConnect}
    >
      <i className="bi bi-wallet2 me-2"></i>
      {isConnected ? "Wallet Conected" : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
