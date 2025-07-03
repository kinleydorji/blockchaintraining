// const WalletButton = ({ isConnected, onConnect }) => {
//   return (
//     <button
//       className="btn btn-primary px-4 py-2 rounded-pill"
//       onClick={onConnect}
//     >
//       <i className="bi bi-wallet2 me-2"></i>
//       {isConnected ? "Wallet Conected" : "Connect Wallet"}
//     </button>
//   );
// };

// export default WalletButton;
import React from 'react';
const WalletButton = ({ isConnected, onConnect, accountAddress }) => (
  <button
    onClick={onConnect}
    className={`btn ${isConnected ? "btn-secondary" : "btn-primary"}`}
    disabled={isConnected}
  >
    {isConnected ? accountAddress.slice(0, 6) + "..." + accountAddress.slice(-6) : "Connect Wallet"}
  </button>
);

export default WalletButton;

