import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import ThreeWordAccountService from "../services/ThreeWordAccountService";
import { ethers } from 'ethers';
import { checkAddressType } from '../utils/checkAddress';
const threeWordAccountService = new ThreeWordAccountService();
let provider;

const statusColors = {
    account: 'bg-green-500',
    contract: 'bg-yellow-500',
    scam: 'bg-red-500',
    notFound: 'bg-gray-500',
    "Invalid Address!": 'bg-gray-500'
};

// CheckForm Component
export default function CheckForm() {
    const { isConnected, address } = useAccount();
    const [walletAddress, setWalletAddress] = useState('');
    const [walletStatus, setWalletStatus] = useState('');
    const [accountName, setAccountName] = useState('');

    const chainId = useChainId();
    useEffect(() => {
        if (ethers.BrowserProvider) {
            provider = new ethers.BrowserProvider(window.ethereum)
        }
        const setAccountMapping = async () => {
            try {
                const accountName = await threeWordAccountService.getAccountNameByAddress(chainId, address);
                // console.log({ accountName })
                if (!accountName) {
                    const mapAccountResponse = await threeWordAccountService.mapAccount(chainId, address);
                    console.log('Account mapped response:', mapAccountResponse);
                }
            } catch (error) {
                console.error('Error mapping account:', error);
            }
        };

        if (isConnected) {
            setAccountMapping();
        }
    }, [isConnected]);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        if (input) {
            setWalletAddress(input);
            // console.log({ input });
            const accountType = await checkAddressType(input, provider);
            console.log({ accountType });
            setWalletStatus(accountType);
            if (accountType != "Invalid Address!") {
                // Fetch account name by the address
                const accountName = await threeWordAccountService.getAccountNameByAddress(chainId, input);
                console.log({ accountName });
                if (accountName) {
                    setAccountName(accountName);
                } else {
                    const mapAccountResponse = await threeWordAccountService.mapAccount(chainId, input);
                    console.log('Account mapped response:', mapAccountResponse);
                    const newAccountName = await threeWordAccountService.getAccountNameByAddress(chainId, input);
                    // console.log({ newAccountName });
                    setAccountName(newAccountName);
                }
            }else{
                setAccountName(accountType);
            }
        }else{}
    };

    return (
        <form className="space-y-6">
            <div className="mb-6 relative">
                <strong><label>Enter Address:</label></strong>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0xABC1234567890abcdef1234567890ABCDEF1234"
                />
            </div>
            <div className="mt-4 flex items-center">
                <div
                    className={`w-4 h-4 rounded-full ${statusColors[walletStatus]}`}
                    title={walletStatus.charAt(0).toUpperCase() + walletStatus.slice(1)}
                ></div>
                <div className="ml-2">
                    <strong>Wallet's name:</strong><br /> {accountName}
                </div>
            </div>
        </form>
    );
};