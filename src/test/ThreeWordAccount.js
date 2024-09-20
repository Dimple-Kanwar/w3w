import { expect } from "chai";
import hre from "hardhat";
import { ThreeWordAccount } from "../typechain-types";

describe("ThreeWordAccount", function () {
  let threeWordAccount;
  let owner, user1, user2, user3;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  this.beforeAll(async function () {
    // Contracts are deployed using the first signer/account by default
    [owner, user1, user2, user3] = await hre.ethers.getSigners();
    // Get the ContractFactory 
    const ThreeWordAccount = await hre.ethers.getContractFactory("ThreeWordAccount");
    // Deploy a new PolicyManagement contract before each test
    threeWordAccount = await ThreeWordAccount.deploy();
    // console.log("threeWordAccount.address: ", await threeWordAccount.getAddress())
    const txReceipt = threeWordAccount.deploymentTransaction();
    // console.log("txReceipt: ", txReceipt?.hash)
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await threeWordAccount.owner()).to.equal(await owner.getAddress());
    });

    it("Should set name for an address", async function () {
      const word1 = "apple";
      const word2 = "green";
      const word3 = "fruit";
      await expect(threeWordAccount.connect(user1).setAccountName(word1, word2, word3, await user1.getAddress()))
        .to.emit(threeWordAccount, "accountNameSet")
        .withArgs(await user1.getAddress(), `${word1}.${word2}.${word3}`);
    });

    it("Should get the account name", async function () {
      const word1 = "apple";
      const word2 = "green";
      const word3 = "fruit";
      const accountName = await threeWordAccount.getAccountName(await user1.getAddress());
      // console.log({accountName});
      expect(accountName).to.be.eq(`${word1}.${word2}.${word3}`)
    });

    it("Should get the account address by account name", async function () {
      const word1 = "apple";
      const word2 = "green";
      const word3 = "fruit";
      // console.log({accountName: `${word1}.${word2}.${word3}`});
      const accountAddress = await threeWordAccount.getAddressByAccountName(`${word1}.${word2}.${word3}`);
      // console.log({accountAddress});
      expect(accountAddress).to.be.eq(await user1.getAddress())
    });

    it("Should revert if account name format is wrong", async function () {
      const word1 = "apple";
      const word2 = "green";
      const word3 = "fruit";
      await expect(threeWordAccount.getAddressByAccountName(`${word1}-${word2}-${word3}`)).to.be.revertedWith('Invalid account name format');
    });

    it("Should set the account name if mapping does not exist", async function () {
      const word1 = "taste";
      const word2 = "good";
      const word3 = "food";
      const accountName = await threeWordAccount.getAccountName(await user2.getAddress());
      // console.log({accountName});
      expect(accountName).to.be.empty;
      await expect(threeWordAccount.connect(user3).setAccountName(word1, word2, word3, await user2.getAddress()))
        .to.emit(threeWordAccount, "accountNameSet")
        .withArgs(await user2.getAddress(), `${word1}.${word2}.${word3}`);
    });

    it("Should set the account address if account name does not exist", async function () {
      const word1 = "free";
      const word2 = "feel";
      const word3 = "try";
      const accountAddress = await threeWordAccount.connect(user3).getAddressByAccountName(`${word1}.${word2}.${word3}`);
      // console.log({accountAddress});
      expect(accountAddress).to.be.eq('0x0000000000000000000000000000000000000000');
      await expect(threeWordAccount.connect(user3).setAccountName(word1, word2, word3,await user3.getAddress()))
        .to.emit(threeWordAccount, "accountNameSet")
        .withArgs(await user3.getAddress(), `${word1}.${word2}.${word3}`);
    });
  });
});
