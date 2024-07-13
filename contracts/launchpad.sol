// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./token.sol";

contract Launchpad {
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    uint256 public tokenIdCounter;

    struct Token {
        string name;
        string symbol;
        uint256 reserve0; // токены
        uint256 reserve1; // ETH
        address tokenAddress;
    }

    mapping(uint256 => Token) public tokens;

    event TokenCreated(uint256 tokenId, address tokenAddress, string name, string symbol, uint256 initialSupply);
    event TokensSwapped(uint256 tokenId, address sender, uint256 amountIn, uint256 amountOut);
    event DebugLog(uint256 x, uint256 y);

    function createToken(string memory name, string memory symbol) public payable {
        require(msg.value == TOKEN_PRICE, "Incorrect amount of ETH sent");

        CustomToken newToken = new CustomToken(name, symbol, 10**18, address(this));

        tokens[tokenIdCounter] = Token({
            name: name,
            symbol: symbol,
            reserve0: 10**18, // начальный запас токенов
            reserve1: msg.value, // ETH, отправленный при создании токена
            tokenAddress: address(newToken)
        });

        emit TokenCreated(tokenIdCounter, address(newToken), name, symbol, 10**18);

        tokenIdCounter++;
    }

    function swap(uint256 tokenId, uint256 amount0In, uint256 amount1In) public payable {
        require(tokenId < tokenIdCounter, "Token ID does not exist");
        require((amount0In > 0 && amount1In == 0) || (amount0In == 0 && amount1In > 0), "One amount must be zero and the other must be greater than zero");

        Token storage token = tokens[tokenId];

        uint256 k = token.reserve1 * token.reserve0;
        uint256 amountOut;

        if (amount0In > 0) { // Swap Tokens to ETH

            uint256 newReserve0 = token.reserve0 + amount0In;
            uint256 newReserve1 = k / newReserve0;

            amountOut = token.reserve1 - newReserve1;

            token.reserve0 = newReserve0;
            token.reserve1 = newReserve1;

            payable(msg.sender).transfer(amountOut);
            emit TokensSwapped(tokenId, msg.sender, amount0In, amountOut);
        } else { // Swap ETH to Tokens
            require(msg.value == amount1In, "Incorrect ETH amount sent");

            // Пересчитываем количество токенов
            uint256 newReserve1 = token.reserve1 + amount1In;
            uint256 newReserve0 = k / newReserve1;

            require(amountOut <= token.reserve0, "Not enough tokens in reserve");

            // Обновляем резервы
            token.reserve1 = newReserve1;
            token.reserve0 = newReserve0;

            // Переводим токены пользователю
            require(IERC20(token.tokenAddress).transfer(msg.sender, amountOut), "Token transfer failed");
            emit TokensSwapped(tokenId, msg.sender, amount1In, amountOut);
        }
    }

    // Функция для получения резервов токенов и ETH
    function getReserves(uint256 tokenId) public view returns (uint256 reserve0, uint256 reserve1) {
        Token memory token = tokens[tokenId];
        return (token.reserve0, token.reserve1);
    }

    function withdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}
