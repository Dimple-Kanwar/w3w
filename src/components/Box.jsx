import React, { useState } from 'react';
import CheckForm from './CheckForm';
import logo from '../assets/logo.jpg';
import { SwapForm } from './SwapForm';
import DonationForm from './Donate';

export default function Box() {
    const [activeNav, setActiveNav] = useState('Check');

    const renderForm = () => {
        switch (activeNav) {
            case 'Check':
                return <CheckForm />;
            case 'Registry':
                return <RegistryForm />;
            case 'Swap':
                return <SwapForm />;
            case 'Donate':
                return <DonationForm/>;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-md">
        <div className="flex items-center justify-center bg-[#144c7c] py-2 rounded-t-lg">
            <img src={logo} alt="WNS Logo" className="h-12 w-12 mr-3" />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                WORD NAME SYSTEM
            </h1>
        </div>
        <nav className="mb-2 bg-white rounded-b-lg overflow-hidden">
            <ul className="flex">
                {['Check', 'Registry', 'Swap', 'Donate'].map((item) => (
                    <li key={item} className="flex-1">
                        <button 
                            onClick={() => setActiveNav(item)}
                            className={`w-full py-2 text-blue-900 hover:bg-blue-100 transition-colors ${activeNav === item ? 'bg-blue-100' : ''}`}
                        >
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="bg-white p-6 rounded-lg shadow-md">
            {renderForm()}
            </div>
        </div>
    );
}

