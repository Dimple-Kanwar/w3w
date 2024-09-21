require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

module.exports = {
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
    tests: "./src/test",
    cache: "./cache",
    artifacts: "./artifacts"
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
      testnet_aurora: {
        url: `${process.env.NEAR_AURORA_TESTNET_RPC}`,
        accounts: [`${process.env.PRIVATE_KEY}`]
      },
      develop_aurora: {
        url: `${process.env.NEAR_AURORA_DEVELOP_RPC}`,
        accounts: [`${process.env.PRIVATE_KEY}`]
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
      morph_holesky_testnet: {
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.MORPH_RPC_URL}`,
        chainId: 2810
      },
      gnosis: {
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.GNOSIS_RPC_URL}`
      },
      linea: {
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.LINEA_RPC_URL}`
      },
      flow: {
        accounts: [`${process.env.PRIVATE_KEY}`],
        url: `${process.env.FLOW_RPC_URL}`,
        gas: 500000
      }

    }
  
};