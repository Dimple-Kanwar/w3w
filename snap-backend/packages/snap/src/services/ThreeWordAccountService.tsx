import {ethers} from "ethers";
import { generate } from "../utils/random-words";
import abi from "../utils/contract-abi.json";
import("dotenv/config");
import networks from "../constants";
// ABI of the ThreeWordAccount contract

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const wordCount = 3;
export default class ThreeWordAccountService {
  networks: any;
  contracts: Map<any, any>;
  signers: Map<any, any>;

  constructor() {
    this.networks = networks;
    this.contracts = new Map();
    this.signers = new Map();
    // console.log("network--------------------------->", networks);
    networks.forEach(async (network: { rpcUrl: string | ethers.FetchRequest | undefined; privateKey: string | ethers.SigningKey; chainId: any; contractAddress: string | ethers.Addressable; }) => {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      // console.log("provider--------------------------->", provider);
      // console.log("network.privateKey--------------------------->", network.privateKey);
      const signer = new ethers.Wallet(network.privateKey, provider);
      // console.log("signer--------------------------->", signer);
      this.signers.set(network.chainId, signer);
      const Contract_ABI = abi;
      this.contracts.set(network.chainId, new ethers.Contract(network.contractAddress, Contract_ABI, signer));
    });
  }

  // Function to generate a random word
  // async getRandomWord() {
  //   const randomIndex = Math.floor(Math.random() * words.length);
  //   return words[randomIndex];
  // }

  async getContract(chainId: any) {
    const contract = this.contracts.get(chainId);
    if (!contract) {
      throw new Error(`Contract not found for chain ID ${chainId}`);
    }
    return contract;
  }

  async mapAccount(chainId: any, account: any){
    const contract = await this.getContract(chainId);
    const words = generate(wordCount);
    const tx = await contract.setAccountName(...words!, account);
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

  async getAccountNameByAddress(chainId: any, account: any) {
    console.log({chainId, account})
    const contract = await this.getContract(chainId);
    const accountName = await contract.getAccountName(account);
    if (!accountName) {
      await this.mapAccount(chainId, account);
    }
    return accountName;
  }

  async getAccountAddressByName(chainId: any, accountName: any) {
    console.log({chainId, accountName})
    const contract = await this.getContract(chainId);
    const accountAddress = await contract.getAddressByAccountName(accountName);
    console.log({ accountAddress })
    return accountAddress;
  }

  async getNetworks() {
    return this.networks;
  }
}
