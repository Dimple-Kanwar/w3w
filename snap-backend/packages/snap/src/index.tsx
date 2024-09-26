import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// Mock data for WNS lookup
const mockData = {
  '///fix.fight.moving':'0xF64Aff53E004282334a451009ec01358d2FD866d',
  '///previous.lamp.hot': '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  '///needle.mysterious.food': '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  '///wore.door.roar': '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
};

// Validation function
const isValidWNS = (input: string): boolean => {
  const wnsRegex = /^\/\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  return wnsRegex.test(input);
};

// WNS lookup function
const wnsLookup = (input: string) => {
  const address = mockData[input as keyof typeof mockData];
  if (address) return { wns: input, address: address };
  return { wns: input, address: 'Not found' };
};

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      const userInput = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: (
            <Box>
              <Text>Check</Text>
              <Heading>WNS</Heading>
            </Box>
          ),
          placeholder: '///fix.fight.moving',
        },
      });

      if (!userInput) {
        return { error: 'No input provided' };
      }

      if (!isValidWNS(userInput as string)) {
        await snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: (
              <Box>
                <Heading>Invalid WNS Format</Heading>
                <Text>Please enter a valid WNS in the format: ///name.fruit.food</Text>
              </Box>
            ),
          },
        });
        return { error: 'Invalid WNS format' };
      }

      const result = wnsLookup(userInput as string);

      await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: (
            <Box>
              <Heading>WNS</Heading>
              {/* <Divider /> */}
              <Text>{result.wns}</Text>
              {/* <Divider /> */}
              <Heading>Wallet Address</Heading>
              <Text>{result.address}</Text>
            </Box>
          ),
        },
      });

      return { success: true, message: 'WNS lookup completed' };

    default:
      throw new Error('Method not found.');
  }
};
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock data for bidirectional lookup
// const mockData = {
//   '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//   '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//   '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
// };

// // Bidirectional lookup function
// const bidirectionalLookup = (input: string) => {
//   const lowercaseInput = input.toLowerCase();

//   // Check if input is an address
//   const nameForAddress = Object.entries(mockData).find(([addr,]) => addr.toLowerCase() === lowercaseInput)?.[1];
//   if (nameForAddress) return { address: input, name: nameForAddress };

//   // Check if input is a name
//   const addressForName = Object.entries(mockData).find(([, name]) => name.toLowerCase() === lowercaseInput)?.[0];
//   if (addressForName) return { address: addressForName, name: input };

//   return { address: 'Not found', name: 'Not found' };
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       const userInput = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'prompt',
//           content: (
//             <Box>
//               <Text>Check</Text>
//               <Heading>WNS</Heading>
//               {/* <Text>WNS name:</Text> */}
//             </Box>
//           ),
//           placeholder: '///apple.orange.banana',
//         },
//       });

//       if (!userInput) {
//         return { error: 'No input provided' };
//       }

//       const result = bidirectionalLookup(userInput as string);

//       await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: (
//             <Box>
//               <Heading>WNS Lookup Result</Heading>
//               <Divider />
//               <Text>Input: {String(userInput)}</Text>
//               <Divider />
//               <Text>Wallet Address:</Text>
//               <Text>{result.address}</Text>
//               <Divider />
//               <Text>WNS Name:</Text>
//               <Text>{result.name}</Text>
//             </Box>
//           ),
//         },
//       });

//       return { success: true, message: 'WNS lookup completed' };

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock function to simulate reverse WNS lookup
// const mockReverseWNSLookup = (address: string) => {
//   const names = {
//     '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//     '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//     '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
//   };
//   // Convert input to lowercase for case-insensitive comparison
//   const lowercaseAddress = address.toLowerCase();
//   return Object.entries(names).find(([addr, ]) => addr.toLowerCase() === lowercaseAddress)?.[1] || 'No name found';
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       // Prompt the user to enter their wallet address
//       const addressInput = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'prompt',
//           content: (
//             <Box>
//               <Heading>Enter Wallet Address</Heading>
//               <Text>Please enter your wallet address for WNS lookup:</Text>
//             </Box>
//           ),
//           placeholder: 'alice.web',
//         },
//       });

//       if (!addressInput) {
//         return { error: 'No address provided' };
//       }

//       const userAddress = addressInput as string;
//       const wnsName = mockReverseWNSLookup(userAddress);

//       // Display the result
//       await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: (
//             <Box>
//               <Heading>WNS Lookup Result</Heading>
//               <Divider />
//               <Text>Wallet Address:</Text>
//               <Text>{userAddress}</Text>
//               <Divider />
//               <Text>WNS Name:</Text>
//               <Text>{wnsName}</Text>
//             </Box>
//           ),
//         },
//       });

//       return { success: true, message: 'WNS lookup completed' };

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock function to simulate reverse WNS lookup
// const mockReverseWNSLookup = (address: string) => {
//   const names = {
//     '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//     '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//     '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
//   };
//   return names[address as keyof typeof names] || 'No name found';
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       // Prompt the user to enter their wallet address
//       const addressInput = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'prompt',
//           content: (
//             <Box>
//               <Heading>Enter Wallet Address</Heading>
//               <Text>Please enter your wallet address for WNS lookup:</Text>
//             </Box>
//           ),
//           placeholder: '0x...',
//         },
//       });

//       if (!addressInput) {
//         return { error: 'No address provided' };
//       }

//       const userAddress = addressInput as string;
//       const wnsName = mockReverseWNSLookup(userAddress);

//       // Display the initial result
//       const showNameResponse = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'confirmation',
//           content: (
//             <Box>
//               <Heading>Your Wallet Details</Heading>
//               <Divider />
//               <Text>Wallet Address:</Text>
//               <Text>{userAddress}</Text>
//               <Divider />
//               <Text>Click Confirm to view your WNS name</Text>
//             </Box>
//           ),
//         },
//       });

//       if (showNameResponse) {
//         // If user confirms, show the WNS name
//         await snap.request({
//           method: 'snap_dialog',
//           params: {
//             type: 'alert',
//             content: (
//               <Box>
//                 <Heading>Your WNS Name</Heading>
//                 <Divider />
//                 <Text>Wallet Address:</Text>
//                 <Text>{userAddress}</Text>
//                 <Divider />
//                 <Text>WNS Name:</Text>
//                 <Text>{wnsName}</Text>
//               </Box>
//             ),
//           },
//         });
//       }

//       return { success: true, message: 'WNS lookup completed' };

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock function to simulate reverse WNS lookup
// const mockReverseWNSLookup = (address: string) => {
//   const names = {
//     '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//     '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//     '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
//   };
//   return names[address as keyof typeof names] || 'No name found';
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       // Fetch the user's wallet address
//       const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//       const userAddress = accounts?.[0];

//       // Perform the reverse lookup
//       const wnsName = mockReverseWNSLookup(userAddress || '');

//       // Display the initial result
//       const showNameResponse = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'confirmation',
//           content: (
//             <Box>
//               <Heading>Your Wallet Details</Heading>
//               <Divider />
//               <Text>Wallet Address:</Text>
//               <Text>{userAddress}</Text>
//               <Divider />
//               <Text>Click Confirm to view your WNS name</Text>
//             </Box>
//           ),
//         },
//       });

//       if (showNameResponse) {
//         // If user confirms, show the WNS name
//         await snap.request({
//           method: 'snap_dialog',
//           params: {
//             type: 'alert',
//             content: (
//               <Box>
//                 <Heading>Your WNS Name</Heading>
//                 <Divider />
//                 <Text>Wallet Address:</Text>
//                 <Text>{userAddress}</Text>
//                 <Divider />
//                 <Text>WNS Name:</Text>
//                 <Text>{wnsName}</Text>
//               </Box>
//             ),
//           },
//         });
//       }

//       return { success: true, message: 'WNS lookup completed' };

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock function to simulate WNS lookup
// const mockWNSLookup = (address: string) => {
//   const names = {
//     '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//     '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//     '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
//   };
//   return names[address as keyof typeof names] || 'No name found';
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       let continueSearching = true;
//       let lastAddress = '';
//       let lastWNSName = '';

//       while (continueSearching) {
//         const addressInput = await snap.request({
//           method: 'snap_dialog',
//           params: {
//             type: 'prompt',
//             content: (
//               <Box>
//                 <Heading>WNS Lookup</Heading>
//                 <Text>Enter a wallet address to find its WNS name:</Text>
//                 {lastAddress !== '' && (
//                   <Box>
//                     <Divider />
//                     <Text>Last lookup:</Text>
//                     <Text>Address: {lastAddress}</Text>
//                     <Text>WNS Name: {lastWNSName}</Text>
//                   </Box>
//                 )}
//               </Box>
//             ),
//             placeholder: '0x...',
//           },
//         });

//         if (!addressInput) {
//           continueSearching = false;
//           break;
//         }

//         lastAddress = addressInput as string;
//         lastWNSName = mockWNSLookup(lastAddress);

//         const continueResponse = await snap.request({
//           method: 'snap_dialog',
//           params: {
//             type: 'confirmation',
//             content: (
//               <Box>
//                 <Heading>WNS Lookup Result</Heading>
//                 <Divider />
//                 <Text>WNS Lookup Details:</Text>
//                 <Box>
//                   <Text>Wallet Address:</Text>
//                   <Text>{lastAddress}</Text>
//                   <Divider />
//                   <Text>WNS Name:</Text>
//                   <Text>{lastWNSName}</Text>
//                 </Box>
//                 <Divider />
//                 <Text>Would you like to perform another lookup?</Text>
//               </Box>
//             ),
//           },
//         });

//         continueSearching = continueResponse === true;
//       }

//       return { success: true, message: 'WNS lookup completed' };

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Heading, Divider } from '@metamask/snaps-sdk/jsx';

// // Mock function to simulate WNS lookup
// const mockWNSLookup = (address: string) => {
//   const names = {
//     '0x742d35Cc6634C0532925a3b844Bc454e4438f44e': 'alice.web',
//     '0x8ba1f109551bD432803012645Ac136ddd64DBA72': 'bob.web',
//     '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B': 'charlie.web',
//   };
//   return names[address as keyof typeof names] || 'No name found';
// };

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       const addressInput = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'prompt',
//           content: (
//             <Box>
//               <Heading>WNS Lookup</Heading>
//               <Text>Enter a wallet address to find its WNS name:</Text>
//             </Box>
//           ),
//           placeholder: '0x...',
//         },
//       });

//       if (!addressInput) {
//         return { error: 'No address provided' };
//       }

//       const wnsName = mockWNSLookup(addressInput as string);

//       return snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: (
//             <Box>
//               <Heading>WNS Lookup Result</Heading>
//               <Divider />
//               <Box>
//                 <Text>Wallet Address:</Text>
//                 <Text>{String(addressInput)}</Text>
//                 <Divider />
//                 <Text>WNS Name:</Text>
//                 <Text>{String(wnsName)}</Text>
//               </Box>
//             </Box>
//           ),
//         },
//       });

//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Divider, Heading } from '@metamask/snaps-sdk/jsx';

// // Your existing onRpcRequest handler
// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       // Mock transaction data (replace with actual data in real implementation)
//       const transaction = {
//         from: '0x0bc38...A...',
//         to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//         value: '0.01',
//         contractAddress: '0x0bc38...AB45C'
//       };

//       return snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: (
//             <Box>
//               <Text>Account 4 → {transaction.from}</Text>
//               <Text>{transaction.contractAddress} : CONTRACT INTERACTION</Text>
//               <Text>{transaction.value} ETH</Text>
//               <Text>$31.97</Text>
//               <Divider />
//               {/* <Panel values={['DETAILS', 'WNS']} selectedIndex={0} /> */}
//               <Heading>Transaction Insights</Heading>
//               <Text>From: {transaction.from}</Text>
//               <Text>To: {transaction.to}</Text>
//               <Text>Value: {transaction.value} ETH</Text>
//               <Divider />
//               <Text>Reject     Confirm</Text>
//             </Box>
//           ),
//         },
//       });

//     default:
//       throw new Error('Method not found.');
//   }
// };

// // New onTransaction handler
// export const onTransaction: OnTransactionHandler = async ({
//   transaction,
//   chainId,
//   transactionOrigin,
// }) => {
//   const insights = [
//     { value: `Chain ID: 1` }, // Ethereum Mainnet
//     { value: `Transaction Origin: https://example.com` },
//     { value: `To: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e` },
//     { value: `Value: 0.1 ETH` },
//   ];

//   return {
//     content: (
//       <Box>
//         <Heading>Transaction Insights</Heading>
//         <Text>Here are the insights:</Text>
//         {insights.map((insight, index) => (
//           <Text key={index}>{insight.value}</Text>
//         ))}
//       </Box>
//     ),
//   };
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Divider } from '@metamask/snaps-sdk/jsx';

// export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       const response = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'alert',
//           content: (
//             <Box>
//               <Text>Account 4 → 0x0bc38...A...</Text>
//               <Text>0x0bc38...AB45C : CONTRACT INTERACTION</Text>
//               <Text>0.01 ETH</Text>
//               <Text>$31.97</Text>
//               <Divider />
//               <Box>
//                 <Text>DETAILS | WNS</Text>
//               </Box>
//               <Box>
//                 <Text>WNS Lookup</Text>
//                 <Text>Enter a WNS name to resolve:</Text>
//                 <Text>example.web</Text>
//                 <Text>Resolves to: 0x1234...5678</Text>
//               </Box>
//               <Divider />

//               <Text >Reject     Confirm</Text>
//             </Box>
//           ),
//         },
//       });
//       return { success: true, response };
//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { OnRpcRequestHandler } from '@metamask/snaps-sdk';
// import { Box, Text, Bold, Divider } from '@metamask/snaps-sdk/jsx';

// export const onRpcRequest: OnRpcRequestHandler = async ({
//   origin,
//   request,
// }) => {
//   switch (request.method) {
//     case 'hello':
//       const response = await snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'confirmation',
//           content: (
//             <Box>
//               <Text>Tabs: Your accounts | Contacts | <Bold>WNS</Bold></Text>
//               <Text>
//                 The WNS tab has been added to the interface.
//               </Text>
//             </Box>
//           ),
//         },
//       });
//       return { success: true, response };
//     default:
//       throw new Error('Method not found.');
//   }
// };
// import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';

// /**
//  * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
//  *
//  * @param args - The request handler args as object.
//  * @param args.origin - The origin of the request, e.g., the website that
//  * invoked the snap.
//  * @param args.request - A validated JSON-RPC request object.
//  * @returns The result of `snap_dialog`.
//  * @throws If the request method is not valid for this snap.
//  */
// export const onRpcRequest: OnRpcRequestHandler = async ({
//   origin,
//   request,
// }) => {
//   switch (request.method) {
//     case 'hello':
//       return snap.request({
//         method: 'snap_dialog',
//         params: {
//           type: 'confirmation',
//           content: (
//             <Box>
//               <Text>
//                 Hello, <Bold>{origin}</Bold>!
//               </Text>
//               <Text>
//                 This custom confirmation is just for display purposes.
//               </Text>
//               <Text>
//                 But you can edit the snap source code to make it do something,
//                 if you want to!
//               </Text>
//             </Box>
//           ),
//         },
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };
