import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import ThreeWordAccountService from '../services/ThreeWordAccountService';
import networks from '../constants';
import { ethers } from 'ethers';
import { checkAddressType } from '../utils/checkAddress';

const threeWordAccountService = new ThreeWordAccountService(networks);
let provider;

const statusColors = {
    account: 'bg-green-500',
    contract: 'bg-yellow-500',
    scam: 'bg-red-500',
    notFound: 'bg-gray-500',
    invalidAddress: 'bg-gray-500'
};

export default function DonationForm() {
    const { isConnected, address } = useAccount();
    const [walletAddress, setWalletAddress] = useState('');
    const [walletStatus, setWalletStatus] = useState('');
    const [amount, setAmount] = useState(0);
    const [accountName, setAccountName] = useState('');

    const chainId = useChainId();

    useEffect(() => {
        const initializeProvider = async () => {
            if (ethers.BrowserProvider) {
                provider = new ethers.BrowserProvider(window.ethereum);
            }

            if (isConnected && address) {
                await setAccountMapping();
            }
        };

        const setAccountMapping = async () => {
            try {
                const accountName = await threeWordAccountService.getAccountNameByAddress(chainId, address);
                if (!accountName) {
                    const mapAccountResponse = await threeWordAccountService.mapAccount(chainId, address);
                    console.log('Account mapped response:', mapAccountResponse);
                }
            } catch (error) {
                console.error('Error mapping account:', error);
            }
        };

        initializeProvider();
    }, [isConnected, address, chainId]);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        console.log({input});
        setAccountName(input);
        if (input) {
            const accountAddress = await threeWordAccountService.getAccountAddressByName(chainId, input);
            console.log({accountAddress});
            if (accountAddress) {
                const accountType = await checkAddressType(accountAddress, provider);
                console.log({accountType});
                setWalletStatus(accountType);
                if (accountType !== 'invalidAddress') {
                    setWalletAddress(accountAddress);
                } else {
                    setWalletAddress('Invalid Address!');
                    setWalletStatus('invalidAddress');
                }
            } else {
                setAccountName(accountType);
            }
            setAccountName(accountAddress);
        }

    }
    const handleSend = async (e) => {
        e.preventDefault();
        if (!walletAddress || !amount || walletStatus === 'invalidAddress!') {
            alert('Please enter a valid wallet address and amount.');
            return;
        }

        try {
            const signer = await provider.getSigner();
            console.log({signer})
            // const transaction = {
            //     to: walletAddress,
            //     value: ethers.parseEther(amount.toString()), // Convert amount to wei
            // };
            const txResponse = await signer.sendTransaction({
                to: walletAddress,
                value: ethers.parseUnits(amount.toString(), 'ether'),
              });
              console.log(txResponse);
            // const txResponse = await signer.sendTransaction(transaction);
            console.log(`Transaction response: ${txResponse}`);

            await txResponse.wait(); // Wait for the transaction to be mined
            console.log('Transaction confirmed!');

            // Reset the form after sending
            setWalletAddress('');
            setAmount(0);
            setAccountName('');
            setWalletStatus('');
        } catch (error) {
            console.error('Transaction error:', error);
            alert('Transaction failed. Please check the console for details.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSend}>
            <div className="mb-6 relative">
                <strong><label>Enter Recipient Account:</label></strong>
                <input
                    type="text"
                    value={accountName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="///test.good.food"
                />
            </div>
            <div className="mb-6 relative">
                <strong><label>Enter Amount:</label></strong>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} // Added onChange for amount input
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.001"
                />
            </div>
            <div className="mt-4 flex items-center">
                <div
                    className={`w-4 h-4 rounded-full ${statusColors[walletStatus]}`}
                    title={walletStatus.charAt(0).toUpperCase() + walletStatus.slice(1)}
                ></div>
                <div className="ml-2">
                    <strong>Account:</strong><br /> {walletAddress}
                </div>
            </div>
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                Send
            </button>
        </form>
    );
};