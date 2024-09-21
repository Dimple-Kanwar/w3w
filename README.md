# w3w
Word Name Service

## Pre-requisites:

    nodejs
    hardhat
    near-cli
    reactJs


## Quick start:

clone repository using following command:

    git clone https://github.com/Dimple-Kanwar/w3w

### Install Dependencies:

    npm install

### Run application:

    npm run dev

### Test smart contracts

    npx hardhat test

### Start hardhat node

    npx hardhat node

### Deploy smart contracts on a network

    npx hardhat ignition deploy ./ignition/modules/ThreeWordAccountModule.js --network <network-name-from-hardhat-config>

    For example:
    npx hardhat ignition deploy ./ignition/modules/ThreeWordAccountModule.js --network hedera

### Test smart contract with gas usage report

    REPORT_GAS=true npx hardhat test

### Hardhat help options

    npx hardhat help


## contract on multiple chains:

### hedera: 

    0x57131553a355d2E80446f7EEE92333d15188A338(https://hashscan.io/testnet/contract/0.0.4886628)

### rootstock: 

    0xE4981EA428c2FAA950b01C22D87b64fbe60Fa584(https://explorer.testnet.rootstock.io/address/0xe4981ea428c2faa950b01c22d87b64fbe60fa584)

### Aurora Testnet:

    0x77cbfeA07320f53110C3144e1e75Fd610A37F01a(https://explorer.aurora.dev/address/0x77cbfeA07320f53110C3144e1e75Fd610A37F01a)
    
### linea:

    

### gnosis:


### flow: 

    0x77cbfeA07320f53110C3144e1e75Fd610A37F01a(https://evm-testnet.flowscan.io/tx/0x65d3e905a6bf5089181462fcba3e11bacd5d74d6bea7710332020eea1b3ddb14)

### morph:

    0x77cbfeA07320f53110C3144e1e75Fd610A37F01a(https://explorer-holesky.morphl2.io/address/0x77cbfeA07320f53110C3144e1e75Fd610A37F01a)