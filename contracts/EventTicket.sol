// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721URIStorage, Ownable {
    constructor() ERC721("Thimphu Tech Park Limited NFT", "TTPLNFT") Ownable(msg.sender) {}

    uint256 private tokenCounter;

    function mintNFT(address owner, string memory tokenURI) external onlyOwner {
        uint256 _tokenId = tokenCounter++;
        _mint(owner, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
    }

    function totalNFT() external view returns (uint256) {
        return tokenCounter;
    }

}