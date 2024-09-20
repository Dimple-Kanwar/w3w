import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000
  },
  defaultNetwork: "hardhat",
  networks: 
    {
      local: {
        url: "http://127.0.0.1:8545/",
        accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
      },
      amoy: {
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.AMOY_RPC}`
      },
      hedera: {
        accounts: [`${process.env.HEDERA_ACCOUNT_PRIVATE_KEY}`],
        url: `${process.env.HEDERA_RPC_RELAY_URL}`
      },
      rootstock: {
        chainId: 31,
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.ROOTSTOCK_RPC_URL}`
      },
      barachain_bartio: {
        accounts: [`${process.env.BERACHAIN_PRIVATE_KEY}`],
        url: `${process.env.BERACHAIN_RPC_URL}`
      }

    }
  
};

export default config;
