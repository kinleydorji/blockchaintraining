import { useState } from "react";

const MintForm = ({ onMint }) => {
  const [uri, setUri] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uri) return alert("Enter a valid Token URI");
    onMint(uri);
    setUri("");
  };

  return (
    <div className="mb-5">
      <h3 className="mb-4 text-primary">Mint New NFT</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="tokenURI" className="form-label">
            Token URI
          </label>
          <input
            type="url"
            className="form-control"
            id="tokenURI"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            placeholder="Enter token URI"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Mint NFT
        </button>
      </form>
    </div>
  );
};

export default MintForm;
