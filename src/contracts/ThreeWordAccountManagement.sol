// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// import "hardhat/console.sol";

contract ThreeWordAccount {
    address public owner;

    // account mapping with account name
    mapping(address => string) private accountName;
    // account name mapping with account address
    mapping(string => address) private accountAddress;

    // Event triggered when a account is mapped with account name 
    event accountNameSet(address indexed user, string _accountName);

    constructor(){
        owner = msg.sender;
    }

    function setAccountName(string memory _word1, string memory _word2, string memory _word3, address account) public {
        require(bytes(_word1).length > 0 && bytes(_word2).length > 0 && bytes(_word3).length > 0, "All words must be non-empty");
        string memory _accountName = string(abi.encodePacked("///",_word1, ".", _word2, ".", _word3));
        accountName[account] = _accountName;
        accountAddress[_accountName] = account;
        emit accountNameSet(account, _accountName);
    }

    function getAccountName(address _address) public view returns (string memory) {
        string memory _accountName = accountName[_address];
        // console.log("_accountName: ", _accountName);
        // require(bytes(_accountName).length > 0, "Account name not set for this address");
        return (_accountName);
    }

    function getAddressByAccountName(string memory _accountName) public view returns (address){
        address _accountAddress = accountAddress[_accountName];
        // console.log("_accountAddress: ", _accountAddress);
        if (_accountAddress == address(0)) {
            bytes memory accountNameBytes = bytes(_accountName);
            uint256 firstDot = 0;
            uint256 secondDot = 0;

            for (uint i = 0; i < accountNameBytes.length; i++) {
                if (accountNameBytes[i] == '.') {
                    if (firstDot == 0) {
                        firstDot = i;
                    } else {
                        secondDot = i;
                        break;
                    }
                }
            }
            require(firstDot != 0 && secondDot != 0, "Invalid account name format");
            // accountName[msg.sender] = _accountName;
            // accountAddress[_accountName] = msg.sender;
            // _accountAddress = msg.sender;
            // emit accountNameSet(msg.sender, _accountName);
        }
        return _accountAddress;
    }
}