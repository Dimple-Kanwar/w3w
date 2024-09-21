const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ThreeWordAccountModule", (m) => {
  const threeWordAccountModule = m.contract("ThreeWordAccount", []);
  return { threeWordAccountModule };
});