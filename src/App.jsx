import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, hedera, hederaTestnet, polygon, polygonAmoy, rootstock, rootstockTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import bgImage from "./assets/bg.png";
import Box from "./components/Box";
// 1. Get projectId
const projectId = '2c4250b0ed1c4c85027974613fc83eaf'

// 2. Create wagmiConfig
const metadata = {
  name: 'deApp',
  description: 'deApp for testing',
  url: 'http://localhost:5173', // Update this to match your dev server port
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, hedera, hederaTestnet, polygon, polygonAmoy, rootstock, rootstockTestnet]
const config = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig: config, projectId, chains })

// 4. Create query client
const queryClient = new QueryClient()


function App() {

  const snapId = 'local:http://localhost:9000'; 


  const installSnap = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: { [snapId]: {} },
      });
    } catch (error) {
      console.error('Failed to install Snap:', error);
      setStatus('Failed to install Snap');
    }
  };

  const getWalletAddress = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: { 
          snapId: snapId,
          request: { method: 'getWalletAddress' }
        },
      });
      console.log(response);
    } catch (error) {
      console.error('Failed to get wallet address:', error);
    }
  };



  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <div className="relative min-h-screen">
            <img 
              src={bgImage} 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 min-h-screen flex flex-col items-center px-4">
              <Box/>
            </div>
            <footer style={{backgroundColor: '#144c7c'}} className="bg-black-200 p-4 text-center mt-10 relative z-10">
                <p style={{color: 'white'}}>Made with ❤️ by team W3W</p>
            </footer>
          </div>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  )
}

export default App
