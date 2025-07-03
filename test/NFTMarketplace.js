const {
    loadFixture,
    } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
    
    const { expect } = require("chai");
    
    describe("NFTMarketplace", () => {
    async function deployNFTMarketplace() {
      var factory = await ethers.getContractFactory("TTPLNFT");
      const nft = await factory.deploy();
      factory = await ethers.getContractFactory("NFTMarketplace");
    
      const marketplace = await factory.deploy(nft);
    
      const accounts = await ethers.getSigners();
    
      return { nft, marketplace, accounts };
    }
    
    describe("Test ERC721 Mint", () => {
      it("Mint NFT 0001", async () => {
        const { nft, accounts } = await loadFixture(deployNFTMarketplace);
        await nft.mintNFT(accounts[0], "0001");
        expect(await nft.tokenURI(0)).to.equal("0001");
      });
    
      it("Test Owner", async () => {
        const { nft, accounts } = await loadFixture(deployNFTMarketplace);
        await nft.mintNFT(accounts[0], "0002");
        expect(await nft.ownerOf(0)).to.equal(accounts[0]);
      });
    
      it("Only Owner can mint NFT", async () => {
        const { nft, accounts } = await loadFixture(deployNFTMarketplace);
        await expect(nft.connect(accounts[1]).mintNFT(accounts[0], "0001"))
          .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount")
          .withArgs(accounts[1]);
      });
    });
    
    describe("Test Marketplace Token", () => {
      it("listNFT 0001", async () => {
        const { marketplace, nft, accounts } = await loadFixture(
          deployNFTMarketplace
        );
    
        await nft.mintNFT(accounts[0], "0001");
    
        await nft.approve(marketplace.target, 0);
    
        await expect(
          marketplace.connect(accounts[0]).listNFT(0, ethers.parseEther("5"))
        )
          .to.emit(marketplace, "ListedNFT")
          .withArgs(accounts[0], 0, ethers.parseEther("5"));
      });
    
      it("Only owner of nft can list token", async () => {
        const { marketplace, nft, accounts } = await loadFixture(
          deployNFTMarketplace
        );
    
        await nft.mintNFT(accounts[0], "0001");
    
        await nft.approve(marketplace.target, 0);
    
        await expect(
          marketplace.connect(accounts[1]).listNFT(0, ethers.parseEther("5"))
        ).to.be.revertedWith("You are not the owner of this NFT");
      });
    
      it("Buy NFT", async () => {
        const { marketplace, nft, accounts } = await loadFixture(
          deployNFTMarketplace
        );
    
        await nft.mintNFT(accounts[0], "0001");
    
        await nft.approve(marketplace.target, 0);
    
        await marketplace.connect(accounts[0]).listNFT(0, ethers.parseEther("5"));
    
        await expect(
          marketplace
            .connect(accounts[1])
            .buyNFT(0, { value: ethers.parseEther("5") })
        )
          .to.emit(marketplace, "SoldNFT")
          .withArgs(accounts[1], accounts[0], 0, ethers.parseEther("5"));
      });
    
      // Write test cases for other cases as well
    });
    });