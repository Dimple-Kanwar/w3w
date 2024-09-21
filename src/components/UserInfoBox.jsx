import React, { useState, useEffect } from 'react'; 
import { useAccount } from 'wagmi'; 
import { CopyToClipboard } from 'react-copy-to-clipboard'; 
import copyIcon from "../assets/copy-icon.png";

const UserInfoBox = () => { 
  const { address } = useAccount(); 
  const [associatedName, setAssociatedName] = useState(''); 
  const [copied, setCopied] = useState(false); 
 
  useEffect(() => { 
    // Fetch associated name here 
    // For now, let's use a placeholder 
    setAssociatedName('///fruit.apple.grape'); 
  }, [address]); 
 
  const handleCopy = () => { 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  }; 
 
  if (!address) return null; 
 
  return ( 
    <div className="text-black p-2 rounded-lg mt-2 flex items-center justify-between"> 
      <div className="flex items-center w-full"> 
        <p className="text-sm truncate flex-grow mr-2">{associatedName}</p>
        <CopyToClipboard text={`${address}\n${associatedName}`} onCopy={handleCopy}> 
          <button className="bg-transparent border-none p-0 focus:outline-none flex-shrink-0"> 
            <img 
              src={copyIcon} 
              alt="Copy" 
              className="w-20 h-20 cursor-pointer transition-opacity duration-200 hover:opacity-80" 
            /> 
          </button> 
        </CopyToClipboard> 
      </div> 
      {copied && ( 
        <span className="text-xs text-green-400 absolute right-2 top-full mt-1">Copied!</span> 
      )} 
    </div> 
  );
}; 
 
export default UserInfoBox;