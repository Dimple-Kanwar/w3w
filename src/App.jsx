import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, hedera, hederaTestnet, polygon, polygonAmoy, rootstock, rootstockTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import bgImage from "./assets/bg.png";
import Box from "./components/Box";
import ConnectButton from "./components/ConnectButton";

// 1. Get projectId
const projectId = '2c4250b0ed1c4c85027974613fc83eaf'

// 2. Create wagmiConfig
const metadata = {
  name: 'dApp',
  description: 'dApp for testing',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, hedera, hederaTestnet, polygon, polygonAmoy, rootstock, rootstockTestnet]
const config = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig: config, projectId, chains })

// 4. Create query client
const queryClient = new QueryClient()

function App() {
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
            <header className="relative z-20 w-full p-4 flex justify-end">
              <ConnectButton />
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
  )
}

export default App;