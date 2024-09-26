import { ethers } from 'ethers';

// Function to check if an address is a contract or wallet
export async function checkAddressType(address, provider) {
    // Ensure the address is valid
    if (!ethers.isAddress(address)) {
        // console.log('Invalid address format');
        return "Invalid Address!";
    }

    // Get the code at the address
    const code = await provider.getCode(address);
    // Check if the code is empty
    if (code === '0x') {
        console.log(`${address} is a wallet address (EOA)`);
        return "account";
    } else {
        console.log(`${address} is a contract address`);
        return "contract";
    }
}