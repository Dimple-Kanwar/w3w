import dotenv from 'dotenv';
dotenv.config();
const DEFAULT_CONTRACT_ADDRESS = "0x77cbfeA07320f53110C3144e1e75Fd610A37F01a";
const PRIVATE_KEY = process.env.VITE_PRIVATE_KEY;
const HEDERA_ACCOUNT_PRIVATE_KEY = process.env.VITE_HEDERA_ACCOUNT_PRIVATE_KEY;

export const networks = [
  {
    chainId: 296,
    name: "Hedera Testnet",
    rpcUrl: "https://testnet.hashio.io/api",
    privateKey: HEDERA_ACCOUNT_PRIVATE_KEY,
    contractAddress: "0x57131553a355d2E80446f7EEE92333d15188A338"
  },
  // {
  //   chainId: 398,
  //   name: "Near Testnet",
  //   rpcUrl: "https://rpc.testnet.near.org",
  //   privateKey: PRIVATE_KEY,
  //   contractAddress: "0x57131553a355d2E80446f7EEE92333d15188A338"
  // },
  {
    chainId: 31,
    name: "Rootstock Testnet",
    rpcUrl: "https://rpc.testnet.rootstock.io/ONuqyqARiafWi1R18x0p3eu4C1PoQg-T",
    privateKey: PRIVATE_KEY,
    contractAddress: "0xE4981EA428c2FAA950b01C22D87b64fbe60Fa584"
  },
  {
    chainId: 59141,
    name: "Linea Sepolia",
    rpcUrl: "https://linea-sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    privateKey: PRIVATE_KEY,
    contractAddress: "0x77cbfeA07320f53110C3144e1e75Fd610A37F01a"
  },
  {
    chainId: 545,
    name: "EVM on Flow Testnet",
    rpcUrl: "https://testnet.evm.nodes.onflow.org",
    privateKey: PRIVATE_KEY,
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    gas: 500000
  },
  {
    chainId: null,
    name: "Aurora Testnet",
    rpcUrl: process.env.NEAR_AURORA_TESTNET_RPC,
    privateKey: PRIVATE_KEY,
    contractAddress: DEFAULT_CONTRACT_ADDRESS
  },
  {
    chainId: 2810,
    name: "Morph Holesky Testnet",
    rpcUrl: process.env.MORPH_RPC_URL,
    privateKey: PRIVATE_KEY,
    contractAddress: DEFAULT_CONTRACT_ADDRESS
  }
];

export default networks;
