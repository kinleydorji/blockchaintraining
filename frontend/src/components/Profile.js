import React, { useState } from "react";
import { tokenTransfer } from "../App.js";

function Profile({ walletAddress, overallScore, negativeScore, tokenTransfer, mintTer, mintedBalance }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleTransfer = async () => {
    try {
      if (!to || !amount) {
        setStatus("Please enter both address and amount.");
        return;
      }
      setStatus("🔄 Transferring...");
      await tokenTransfer(to, amount);
      setStatus("✅ Transfer complete!");
    } catch (err) {
      setStatus("❌ Error: " + (err.message || err));
    }
  };


  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      padding: "24px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #1e1e3f, #2a2a5e)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
      color: "#f5f5f5",
      fontFamily: "'Segoe UI', Tahoma, sans-serif"
    }}>
      <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>👤 Your Profile</h2>

      <div style={{
        backgroundColor: "#2d2d5e",
        padding: 16,
        borderRadius: 10,
        marginBottom: 20
      }}>
        <p><strong>Wallet:</strong><br />
          <code style={{ fontSize: 14 }}>{walletAddress || "Not connected"}</code>
        </p>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{
          flex: 1,
          backgroundColor: "#393b6d",
          padding: 12,
          borderRadius: 10,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 14, color: "#ccc" }}>Overall Score</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#7df8a3" }}>
            {walletAddress ? overallScore : "--"}
          </div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: "#393b6d",
          padding: 12,
          borderRadius: 10,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 14, color: "#ccc" }}>Negative Score</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#f77" }}>
            {walletAddress ? negativeScore : "--"}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: "#393b6d",
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: "center"
      }}>
        <div style={{ fontSize: 14, color: "#ccc" }}>Your TER Balance</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#ffd86b" }}>
          {walletAddress ? mintedBalance : "--"}
        </div>
        <button
          disabled={!walletAddress || (overallScore === 0 && negativeScore === 0)}
          style={{
            marginTop: 12,
            padding: "10px 20px",
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
            backgroundColor: (!walletAddress || (overallScore === 0 && negativeScore === 0)) ? "#666" : "#6a8eff",
            color: "#fff",
            border: "none",
            cursor: (!walletAddress || (overallScore === 0 && negativeScore === 0)) ? "not-allowed" : "pointer",
            transition: "background 0.3s ease"
          }}
          onClick={() => mintTer(overallScore.toString(), negativeScore.toString())}
        >
          Convert Score to TER
        </button>
      </div>

      <h3 style={{ marginBottom: 10 }}>Transfer TER</h3>
      <input
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: "1px solid #444",
          backgroundColor: "#2e2f63",
          color: "#fff",
          fontSize: 14
        }}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          border: "1px solid #444",
          backgroundColor: "#2e2f63",
          color: "#fff",
          fontSize: 14
        }}
      />
      <button
        onClick={handleTransfer}
        disabled={!walletAddress || amount <= 0}
        style={{
          width: "100%",
          padding: 10,
          fontSize: 16,
          borderRadius: 8,
          backgroundColor: (!walletAddress || amount <= 0) ? "#555" : "#6a8eff",
          color: "#fff",
          border: "none",
          cursor: (!walletAddress || amount <= 0) ? "not-allowed" : "pointer"
        }}
      >
        Send Tokens
      </button>

      {status && <p style={{ marginTop: 12, fontStyle: "italic", color: "#ccc" }}>{status}</p>}
    </div>
  );
}

export default Profile;
