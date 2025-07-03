const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const {expect}  = require("chai");
const { ethers } = require("hardhat");

describe("Ter Token", ()=> {
    async function deployTer(){
        const factory =  await ethers.getContractFactory("Ter");
        const ter = await factory.deploy();
        const accounts = await ethers.getSigners();
        return {accounts, ter};
    }
    describe("Test ERC20 Openzeppelin Default", ()=> {
        it("Token Symbol should be Ter"), async ()=>{
            const { ter } = await loadFixture(deployTer);
            expect(await ter.symbol()).to.equal("Ter");
        }
    });

    describe("Test methods", () => {
        it("Mint 10 Ter tokens", async () => {
            const { ter } = await loadFixture(deployTer);
            await ter.mint(ethers.parseEther("10"));
            expect(await ter.totalSupply()).to.equal(ethers.parseEther("1000010"));
        });

        it("Burn 10 Ter tokens", async () => {
            const { ter } = await loadFixture(deployTer);
            await ter.burn(ethers.parseEther("10"));
            expect(await ter.totalSupply()).to.equal(ethers.parseEther("999990"));
        });

        it("Owner should be able to mint", async() => {
            const { ter, accounts } = await loadFixture(deployTer);
            await expect(ter.connect(accounts[1]).mint(ethers.parseEther("10")))
            .to.be.revertedWithCustomError(ter, "OwnableUnauthorizedAccount")
            .withArgs(accounts[1]);
        });
    });
});