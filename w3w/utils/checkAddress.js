import { ethers } from 'ethers';

// Function to check if an address is a contract or wallet
export async function checkAddressType(address, provider) {
    console.log({address,provider})
    // Ensure the address is valid
    if (!ethers.isAddress(address)) {
        console.log('Invalid address format');
        return "invalidAddress";
    }

    // Connect to an Ethereum provider (you can use Infura, Alchemy, etc.)
    // const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

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

// Example usage
// const addressToCheck = '0xYourAddressHere';
// checkAddressType(addressToCheck)
//     .then(() => console.log('Check completed'))
//     .catch((error) => console.error('Error:', error.message));
