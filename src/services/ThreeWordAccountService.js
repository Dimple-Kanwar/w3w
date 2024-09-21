const {ethers} = require("hardhat");
const { generate } = require("../utils/random-words");
const abi = require("../utils/contract-abi.json")
require("dotenv/config");

// ABI of the ThreeWordAccount contract

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const wordCount = 3;

class ThreeWordAccountService {

  constructor(networks) {
    this.networks = networks;
    this.contracts = new Map();
    this.signers = new Map();
    console.log("network--------------------------->", networks);
    networks.forEach(async network => {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const signer = new ethers.Wallet(network.privateKey, provider);
      this.signers.set(network.chainId, signer);
      const Contract_ABI = abi;
      this.contracts.set(network.chainId, new ethers.Contract(network.contractAddress, Contract_ABI, signer));
    });
  }

  // Function to generate a random word
  async getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  async getContract(chainId) {
    const contract = this.contracts.get(chainId);
    if (!contract) {
      throw new Error(`Contract not found for chain ID ${chainId}`);
    }
    return contract;
  }

  async mapAccount(chainId, account){
    const contract = await this.getContract(chainId);
    const words = generate(wordCount);
    const tx = await contract.setAccountName(...words, account);
    console.log("tx: ", tx);
    const receipt = await tx.wait();
    console.log("receipt: ", receipt);
    // const event = receipt.events?.find((e) =>{ 
    //   console.log({event: e})
    //   if(e.event === 'accountNameSet') return e.event;
    // });
    // console.log({ event })
    return receipt;
  }

  async getAccountNameByAddress(chainId, account) {
    const contract = await this.getContract(chainId);
    console.log({contract});
    console.log({account});
    const accountName = await contract.getAccountName(account);
    console.log({accountName});
    if (!accountName) {
      await this.mapAccount(chainId, account);
    }
    return accountName;
  }

  async getAccountAddressByName(chainId, accountName) {
    const contract = await this.getContract(chainId);
    const accountAddress = await contract.getAddressByAccountName(accountName);
    console.log({ accountAddress })
    return accountAddress;
  }

  async getNetworks() {
    return this.networks;
  }
}

const networks = [
  {
    chainId: 31337,
    name: 'Hardhat local',
    rpcUrl: "http://127.0.0.1:8545/",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Contract address on HardHat
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  }
];
// Example usage
async function main() {


  const threeWordAccount = new ThreeWordAccountService(networks);

  try {
    const user1Key = `${process.env.USER1_KEY}`;
    const user1Wallet = new ethers.Wallet(user1Key);

    const user2Key = `${process.env.USER2_KEY}`;
    const user2Wallet = new ethers.Wallet(user2Key);

    const user3Key = `${process.env.USER3_KEY}`;
    const user3Wallet = new ethers.Wallet(user3Key);

    // Complete Flow on Hardhat
    const mapAccountResponse = await threeWordAccount.mapAccount(networks[0].chainId, user2Wallet.address);
    console.log('Added quotation on Hardhat:', mapAccountResponse);

    const accountName = await threeWordAccount.getAccountNameByAddress(networks[0].chainId, user2Wallet.address);
    console.log('getAccountNameByAddress on Hardhat:', accountName);

    const words = generate(wordCount);
    const name = words.concat(".")[0];
    const accountAddress = await threeWordAccount.getAccountAddressByName(networks[0].chainId, name);
    console.log('getAccountAddressByName on Hardhat:', accountAddress);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();