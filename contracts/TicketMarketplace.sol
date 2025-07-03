// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract TicketMarketplace {
    struct NFTinfo{
        address seller;
        uint256 price;
    }

    IERC721 private nftContract;

    event ListedNFT(
        address indexed seller, 
        uint256 indexed tokenId, 
        uint256 indexed price
    );

    event SoldNFT(
        address indexed buyer,
        address indexed seller,
        uint256 indexed tokenId, 
        uint256 price
    );
    //mapping data type
    mapping (uint256 => NFTinfo) _listedNFT;

    constructor(address nftAddress) {
        nftContract = IERC721(nftAddress);
    }
    
    function listNFT(uint256 tokenId, uint256 price) external{
        require(msg.sender == nftContract.ownerOf(tokenId), "You are not the Organizer of this Event");
        require(nftContract.getApproved(tokenId) == address(this), "Marketplace is not approved to manage this NFT");
        _listedNFT[tokenId] = NFTinfo({
            seller: msg.sender,
            price: price
        });
        emit ListedNFT(msg.sender, tokenId, price);
    }

    function buyNFT(uint256 tokenId) external payable{
        NFTinfo memory nftInfo = _listedNFT[tokenId];
        require(nftContract.getApproved(tokenId) == address(this), "Marketplace is not approved to manage this NFT");
        require(msg.value == _listedNFT[tokenId].price, "Incorrect price sent");
        delete _listedNFT[tokenId];
        nftContract.transferFrom(nftInfo.seller, msg.sender, tokenId);
        payable(nftInfo.seller).transfer(msg.value);
        emit SoldNFT(msg.sender, nftInfo.seller, tokenId, msg.value);
    }
    //view keyword is used to read data from the blockchain without modifying it
    //This function returns the NFT information for a given tokenId
    //It returns an NFTinfo struct which contains the seller address and price of the NFT
    //This function is used to get the NFT information for a given tokenId
    //It is a view function which means it does not modify the state of the contract        
    function getNFTInfo(uint256 tokenId) external view returns (NFTinfo memory) {
        return _listedNFT[tokenId];
    }

    function isNFTListed(uint256 tokenId) external view returns (bool) {
        return _listedNFT[tokenId].seller != address(0);
    }
}
