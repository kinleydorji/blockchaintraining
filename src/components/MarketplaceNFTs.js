function MarketplaceNFTCard({ nft, onBuy }) {
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
          <p className="small">
            Price: <span className="badge bg-info text-dark">{nft.price}</span>
          </p>
        </div>
        <div className="card-footer bg-transparent border-0">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => onBuy(nft.tokenId)}
          >
            <i className="bi bi-cart-plus me-2"></i>Buy NFT
          </button>
        </div>
      </div>
    </div>
  );
}

const MarketplaceNFTs = ({ nfts, onBuy }) => (
  <div>
    <h3 className="mb-4 text-primary">Marketplace NFTs</h3>
    {nfts.length === 0 ? (
      <p className="text-muted">No NFTs are listed on the marketplace.</p>
    ) : (
      <div className="row">
        {nfts.map((nft) => (
          <MarketplaceNFTCard key={nft.tokenId} nft={nft} onBuy={onBuy} />
        ))}
      </div>
    )}
  </div>
);

export default MarketplaceNFTs;
