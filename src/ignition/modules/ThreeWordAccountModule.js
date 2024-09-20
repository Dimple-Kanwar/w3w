import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ThreeWordAccountModule = buildModule("ThreeWordAccountModule", (m) => {
  const threeWordAccountModule = m.contract("ThreeWordAccount", []);
  return { threeWordAccountModule };
});

export default ThreeWordAccountModule;
