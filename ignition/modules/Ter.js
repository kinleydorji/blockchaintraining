const {buildModule} = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("Ter", (m) => {
    const Ter = m.contract("Ter");
    return Ter;
});