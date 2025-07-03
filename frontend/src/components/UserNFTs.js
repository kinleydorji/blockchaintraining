import React, { useState } from "react";

function OwnedNFTCard({ nft, onList }) {
  const [price, setPrice] = useState("");

  const handleList = () => {
    if (!price) return alert("Enter a price");
    onList(nft.tokenId, price);
    setPrice("");
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px", overflow: "hidden" }}
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="img-fluid"
            style={{ maxHeight: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="card-body">
          <h5 className="card-title fw-bold">{nft.name}</h5>
          <p className="text-muted">{nft.description}</p>
          <p className="small">
            Token ID: <strong>{nft.tokenId}</strong>
          </p>
          <div className="mb-2">
            <label className="form-label small">Set Price (ETH)</label>
            <input
              type="number"
              className="form-control"
              placeholder="0.1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="card-footer bg-transparent border-0">
          <button className="btn btn-success w-100" onClick={handleList}>
            <i className="bi bi-bag-plus me-2"></i>List NFT
          </button>
        </div>
      </div>
    </div>
  );
}

const UserNFTs = ({ nfts, onList }) => (
  <div>
    <h3 className="mb-4 text-primary">Your NFTs</h3>
    {nfts.length === 0 ? (
      <p className="text-muted">You do not own any NFTs.</p>
    ) : (
      <div className="row">
        {nfts.map((nft) => (
          <OwnedNFTCard key={nft.tokenId} nft={nft} onList={onList} />
        ))}
      </div>
    )}
  </div>
);

export default UserNFTs;
