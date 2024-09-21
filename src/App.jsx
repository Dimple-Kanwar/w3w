import React, { useState, useEffect } from 'react'
import { FaBolt } from 'react-icons/fa'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { hederaTestnet, rootstockTestnet, lineaSepolia, auroraTestnet, morphHolesky, flowTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import bgImage from "./assets/bg.png";
import Box from "./components/Box";
import ConnectButton from "./components/ConnectButton";
import UserInfoBox from './components/UserInfoBox'

// 1. Get projectId
const projectId = '2c4250b0ed1c4c85027974613fc83eaf'

const snapId = 'local:http://localhost:8080';

// 2. Create wagmiConfig



const metadata = {
  name: 'dApp',
  description: 'dApp for testing',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [hederaTestnet, rootstockTestnet, lineaSepolia, auroraTestnet, morphHolesky, flowTestnet]
const config = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig: config, projectId, chains })

// 4. Create query client
const queryClient = new QueryClient()

function App() {

  const [status, setStatus] = useState(() => {
    return localStorage.getItem('snapInstalled') === 'true'
  })

  useEffect(() => {
    const checkAndInitializeSnap = async () => {
      const isInstalled = localStorage.getItem('snapInstalled') === 'true'
      console.log('isInstalled', isInstalled)
      if (!isInstalled) {
        await installSnap()
      } else {
        await invokeSnap()
      }
    }
  
    checkAndInitializeSnap()
  }, [localStorage.getItem('snapInstalled')])
 

  // useEffect(() => {
  //   const checkAndInitializeSnap = async () => {
  //     if (!status) {
  //       await installSnap()
  //     } else {
  //       await invokeSnap()
  //     }
  //   }

  //   checkAndInitializeSnap()
  // }, [status])

  const installSnap = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: { [snapId]: {} },
      });
      setStatus(true)
      localStorage.setItem('snapInstalled', 'true')
    } catch (error) {
      console.error('Failed to install Snap:', error);
      setStatus(false);
      localStorage.setItem('snapInstalled', 'false')
    }
  }

  const invokeSnap = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: { 
          snapId: snapId,
          request: { method: 'hello' }
        },
      });
      console.log(response);
    } catch (error) {
      setStatus(false);
      localStorage.setItem('snapInstalled', 'false')
      console.error('hello method failed:', error);
    }
  };
  const handleSnapAction = async () => {
    if (status) {
      await invokeSnap();
    } else {
      await installSnap();
    }
  };


  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div className="relative min-h-screen flex flex-col">
            <img
              src={bgImage}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <header className="relative z-20 w-full p-4">
              <div className="flex justify-end items-center space-x-4">
                <button
                  onClick={handleSnapAction}
                  className="snap-button group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                    <FaBolt className="mr-2 animate-pulse" />
                    {status ? 'Invoke Snap' : 'Install Snap'}
                  </span>
                </button>
                <ConnectButton />
              </div>
              <div className="mt-2 flex justify-end">
                <UserInfoBox />
              </div>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center px-4 relative z-10">
              <Box />
            </main>
            <footer className="bg-[#144c7c] p-4 text-center relative z-10">
              <p className="text-white">Made with ❤️ by team W3W</p>
            </footer>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  //   <ReduxProvider store={store}>
  //   <WagmiProvider config={config}>
  //     <QueryClientProvider client={queryClient}>
  //       <div className="relative min-h-screen flex flex-col">
  //         <img
  //           src={bgImage}
  //           alt="Background"
  //           className="absolute inset-0 w-full h-full object-cover"
  //         />
  //         <header className="relative z-20 w-full p-4 flex justify-between items-center">
  //           <button
  //             onClick={handleSnapAction}
  //             className="snap-button group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
  //           >
  //             <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
  //               <FaBolt className="mr-2 animate-pulse" />
  //               {status ? 'Invoke Snap' : 'Install Snap'}
  //             </span>
  //           </button>
  //           <div className="flex flex-col items-end">
  //             <ConnectButton />
  //             <UserInfoBox />
  //           </div>
  //         </header>
  //         <main className="flex-grow flex flex-col items-center justify-center px-4 relative z-10">
  //           <Box />
  //         </main>
  //         <footer className="bg-[#144c7c] p-4 text-center relative z-10">
  //           <p className="text-white">Made with ❤️ by team W3W</p>
  //         </footer>
  //       </div>
  //     </QueryClientProvider>
  //   </WagmiProvider>
  // </ReduxProvider>
    // <ReduxProvider store={store}>
    //   <WagmiProvider config={config}>
    //     <QueryClientProvider client={queryClient}>
    //       <div className="relative min-h-screen flex flex-col">
    //         <img
    //           src={bgImage}
    //           alt="Background"
    //           className="absolute inset-0 w-full h-full object-cover"
    //         />
    //         <header className="relative z-20 w-full p-4 flex justify-end">
    //           <div className="absolute top-0 right-0 p-4 z-20 flex flex-col items-end">
    //             <ConnectButton />
    //             <UserInfoBox />
    //           </div>
    //         </header>
    //         <main className="flex-grow flex flex-col items-center justify-center px-4 relative z-10">
    //           <Box />
    //         </main>
    //         <footer className="bg-[#144c7c] p-4 text-center relative z-10">
    //           <p className="text-white">Made with ❤️ by team W3W</p>
    //         </footer>
    //       </div>
    //     </QueryClientProvider>
    //   </WagmiProvider>
    // </ReduxProvider>
  )
}

export default App;