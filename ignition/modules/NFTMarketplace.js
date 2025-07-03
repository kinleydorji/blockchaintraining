const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTMarketplace", (m) => {
    const ttplnft = m.contract("TTPLNFT");
    const nftmarketplace = m.contract("NFTMarketplace", [ttplnft]);

    return {
        ttplnft,
        nftmarketplace
    };
})