// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply, address contractAddress) ERC20(name, symbol) {
        _mint(contractAddress, initialSupply);
    }
}