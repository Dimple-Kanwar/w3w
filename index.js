import express from 'express';
import cors from 'cors';
import  ThreeWordAccountService  from './w3w/ThreeWordAccountService.js';
import { checkAddressType } from './w3w/utils/checkAddress.js';
import { networks } from './constants.js';



const app = express();
const port = 9000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const threeWordAccountService = new ThreeWordAccountService(networks);
// API endpoint

app.get('/api/account-info', async (req, res) => {
    const { chainId, accountName } = req.query;

    if (!chainId || !accountName) {
        return res.status(400).json({ error: 'Chain ID and account name are required' });
    }

    try {
        const accountAddress = await threeWordAccountService.getAccountAddressByName(parseInt(chainId), accountName);
        console.log("accountAddress", accountAddress);
        
        if (accountAddress && accountAddress !== '0x0000000000000000000000000000000000000000') {
            res.json({ accountAddress });
        } else {
            res.json({ message: 'No accounts found' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        if (error.shortMessage && error.shortMessage.includes('Invalid account name format')) {
            res.status(400).json({ error: error.shortMessage });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
// app.get('/api/account-info', async (req, res) => {
//     const { chainId, accountName } = req.query;

//     if (!chainId || !accountName) {
//         return res.status(400).json({ error: 'Chain ID and account name are required' });
//     }

//     try {
//         const accountAddress = await threeWordAccountService.getAccountAddressByName(parseInt(chainId), accountName);
//         console.log("accountAddress", accountAddress);
        
//         if (accountAddress && accountAddress !== '0x0000000000000000000000000000000000000000') {
//             res.json({ accountAddress });
//         } else {
//             res.json({ message: 'No accounts found' });
//         }
//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
// app.get('/api/account-info', async (req, res) => {
//     const { chainId, accountName } = req.query;

//     if (!chainId || !accountName) {
//         return res.status(400).json({ error: 'Chain ID and account name are required' });
//     }

//     try {
//         const accountAddress = await threeWordAccountService.getAccountAddressByName(parseInt(chainId), accountName);
//         console.log("accountAddress", accountAddress);
        
//         if (accountAddress) {
//             const network = networks.find(n => n.chainId === parseInt(chainId));
//             if (!network) {
//                 return res.status(400).json({ error: 'Invalid chain ID' });
//             }

//             const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
//             const accountType = await checkAddressType(accountAddress, provider);

//             if (accountType !== 'invalidAddress') {
//                 res.json({
//                     accountAddress,
//                     accountType,
//                     walletStatus: accountType
//                 });
//             } else {
//                 res.json({
//                     accountAddress: 'Invalid Address!',
//                     accountType: 'invalidAddress',
//                     walletStatus: 'invalidAddress'
//                 });
//             }
//         } else {
//             res.json({
//                 accountAddress: '',
//                 accountType: '',
//                 walletStatus: ''
//             });
//         }
//     } catch (error) {
//         console.error('Error processing request:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// Basic route
app.get('/', (req, res) => {
  res.send('Hello from the Express server with CORS!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


