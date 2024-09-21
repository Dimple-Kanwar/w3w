import React, { useState } from 'react';
import logo from "../assets/logo.jpg"

// Simulated wallet address to account name mapping
const addressToNameMapping = {
    '0xABC1234567890abcdef1234567890ABCDEF1234': { accountName: '///a.b.c', status: 'account' },
    '0xDEF1234567890abcdef1234567890ABCDEF5678': { accountName: '///another.name.here', status: 'contract' },
    '0xGHI1234567890abcdef1234567890ABCDEF9012': { accountName: '///example.wallet.name', status: 'scam' },
};

const statusColors = {
    account: 'bg-green-500',
    contract: 'bg-yellow-500',
    scam: 'bg-red-500',
    notFound: 'bg-gray-500'
};

// CheckForm Component
export const SwapForm = ({ accountName, setAccountName, walletAddress, setWalletAddress, walletStatus, setWalletStatus }) => {
    
    const [walletAddress, setWalletAddress] = useState('');
    const [walletStatus, setWalletStatus] = useState('');
    const [accountName, setAccountName] = useState('');
    const [activeNav, setActiveNav] = useState('Check'); // Track active menu item
    
    const handleInputChange = (e) => {
        const input = e.target.value;
        setWalletAddress(input);

        // Fetch wallet address based on the account name
        if (addressToNameMapping[input]) {
            const { accountName, status } = addressToNameMapping[input];
            setAccountName(accountName);
            setWalletStatus(status);
        } else {
            const newAccountName = '///gift.try.help';
            setAccountName(newAccountName);
            setWalletStatus('account'); // set by voting for scam based on thumps up, it is valid account or if there are more -ve or thumps down, then it's a scam
        }
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