import React, { useState } from 'react';

export const SwapForm = () => {
    
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
