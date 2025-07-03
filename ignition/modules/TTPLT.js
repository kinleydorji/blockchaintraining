const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TTPLT", (m)=>{
    const ttplt = m.contract("TTPL");
    return ttplt;
});