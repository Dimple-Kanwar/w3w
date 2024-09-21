import React, { useState } from 'react';
import logo from "../assets/logo.jpg"

// Simulated wallet address mapping
const walletAddressMapping = {
    '///a.b.c': { address: '0xABC1234567890abcdef1234567890ABCDEF1234', status: 'account' },
    '///another.name.here': { address: '0xDEF1234567890abcdef1234567890ABCDEF5678', status: 'contract' },
    '///example.wallet.name': { address: '0xGHI1234567890abcdef1234567890ABCDEF9012', status: 'scam' },
};

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
const CheckForm = ({ accountName, setAccountName, walletAddress, setWalletAddress, walletStatus, setWalletStatus }) => {
    const handleInputChange = (e) => {
        const input = e.target.value;
        setAccountName(input);

        // Fetch wallet address based on the account name
        if (walletAddressMapping[input]) {
            const { address, status } = walletAddressMapping[input];
            setWalletAddress(address);
            setWalletStatus(status);
        } else {
            setWalletAddress('Not Found!!');
            setWalletStatus('notFound');
        }
    };

    return (
        <form className="space-y-6">
            <div className="mb-6 relative">
                <strong><label>Enter WNS:</label></strong>
                <input
                    type="text"
                    value={accountName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="///taste.good.food"
                />
            </div>
            <div className="mt-4 flex items-center">
                <div
                    className={`w-4 h-4 rounded-full ${statusColors[walletStatus]}`}
                    title={walletStatus.charAt(0).toUpperCase() + walletStatus.slice(1)}
                ></div>
                <div className="ml-2">
                    <strong>Wallet Address:</strong><br /> {walletAddress}
                </div>
            </div>
        </form>
    );
};

// SwapForm Component (Placeholder for other forms)
const SwapForm = () => {
    return <div><h2>Swap Form</h2><p>This is the Swap form.</p></div>;
};

// BridgeForm Component (Placeholder for other forms)
const BridgeForm = () => {
    return <div><h2>Donate Form</h2><p>This is the Donate form.</p></div>;
};

export default function Box() {
    const [accountName, setAccountName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [walletStatus, setWalletStatus] = useState('');
    const [activeNav, setActiveNav] = useState('Check'); // Track active menu item

    const renderForm = () => {
        switch (activeNav) {
            case 'Check':
                return (
                    <CheckForm
                        accountName={accountName}
                        setAccountName={setAccountName}
                        walletAddress={walletAddress}
                        setWalletAddress={setWalletAddress}
                        walletStatus={walletStatus}
                        setWalletStatus={setWalletStatus}
                    />
                );
            case 'Report Scam':
                return <RegistryForm />;
            case 'Swap':
                return <SwapForm />;
            case 'Donate':
                return <BridgeForm />;
            default:
                return null;
        }
    };

    return (
        <>
            <header style={{backgroundColor: '#144c7c'}} className="bg-black-200 p-4 text-center mt-10 relative z-10">
            {/* <img
                src={logo}
                alt="Logo"
                style={{ height: '6rem', width: '6rem', objectFit: 'contain' }} // Adjust the size here
            /> */}
                <h1 className="text-6xl p-5 mb-8 londrina-solid-regular text-black break-words">
                    WORD NAME SYSTEM
                </h1>
            </header>
            {/* <div className="flex bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto mt-10 inline-block">
                <h1 className="text-6xl p-5 mb-8 londrina-solid-regular text-black break-words">
                    WORD NAME SYSTEM
                </h1>
            </div> */}

            {/* Menu Bar and Form Box */}
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl mx-auto mt-10 inline-block">
                <nav className="flex justify-around mb-6">
                    {['Check', 'Report Scam', 'Swap', 'Donate'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            onClick={() => setActiveNav(item)}
                            className={`px-4 py-2 text-blue-600 hover:underline ${activeNav === item ? 'font-bold' : ''}`}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {renderForm()}

            </div>

           
        </>
    );
}
