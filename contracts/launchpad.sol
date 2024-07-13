// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "./token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
// import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";

contract Launchpad is Ownable {
    uint256 public constant TOKEN_PRICE = 1 wei;
    uint256 public constant MIN_ETH_RESERVE = 0.000001 ether;
    uint256 public tokenIdCounter;
    address public uniswapRouter;
    address public uniswapFactory;

    struct Token {
        string name;
        string symbol;
        uint256 reserve0; // токены
        uint256 reserve1; // ETH
        address tokenAddress;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => uint256) private _userTokensId;

    event TokenCreated(uint256 tokenId, address tokenAddress, string name, string symbol, uint256 initialSupply);
    event TokensSwapped(uint256 tokenId, address tokenAddress, int256 amount0, int256 amount1);
    event PoolCreated(address poolAddress);

    constructor(address _uniswapRouter, address _uniswapFactory) {
        uniswapRouter = _uniswapRouter;
        uniswapFactory = _uniswapFactory;
        tokenIdCounter = 1;
    }

    function createToken(string memory name, string memory symbol) public payable returns (uint256){
        require(msg.value > TOKEN_PRICE, "Incorrect amount of ETH sent");

        CustomToken newToken = new CustomToken(name, symbol, 10**18, address(this));

        tokens[tokenIdCounter] = Token({
            name: name,
            symbol: symbol,
            reserve0: 10**4, // начальный запас токенов
            reserve1: msg.value, // ETH, отправленный при создании токена
            tokenAddress: address(newToken)
        });

        _userTokensId[address(newToken)] = tokenIdCounter;

        emit TokenCreated(tokenIdCounter, address(newToken), name, symbol, 10**18);

        return tokenIdCounter++;
    }

    function swap(address tokenAddress, uint256 amount0In, uint256 amount1In) public payable {
        uint256 tokenId = _userTokensId[tokenAddress];
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
            emit TokensSwapped(tokenId, token.tokenAddress, int256(amount0In), -1 * int256(amountOut));
        } else { // Swap ETH to Tokens
            require(msg.value == amount1In, "Incorrect ETH amount sent");

            // Пересчитываем количество токенов
            uint256 newReserve1 = token.reserve1 + amount1In;
            uint256 newReserve0 = k / newReserve1;

            amountOut = token.reserve0 - newReserve0;

            require(amountOut <= token.reserve0, "Not enough tokens in reserve");

            // Обновляем резервы
            token.reserve1 = newReserve1;
            token.reserve0 = newReserve0;

            // Переводим токены пользователю
            require(IERC20(token.tokenAddress).transfer(msg.sender, amountOut), "Token transfer failed");
            emit TokensSwapped(tokenId, token.tokenAddress, -1 * int256(amountOut), int256(amount1In));
        }
    }

    // Функция для создания пула в Uniswap V2
    function createPool(address tokenAddress) public onlyOwner {
        IUniswapV2Router02 router = IUniswapV2Router02(uniswapRouter);
        IUniswapV2Factory factory = IUniswapV2Factory(uniswapFactory);

        uint256 tokenId = _userTokensId[tokenAddress];
        Token storage token = tokens[tokenId];

        // Получаем все токены на контракте
        uint256 allTokenAmount = IERC20(tokenAddress).balanceOf(address(this));
        require(allTokenAmount > 0, "No tokens available for liquidity");

        // Используем все токены и часть резервов ETH для ликвидности
        uint256 ethToAdd = token.reserve1;

        // Проверяем, существует ли уже пул
        address pool = factory.getPair(tokenAddress, router.WETH());
        if (pool == address(0)) {
            // Создаем новый пул
            pool = factory.createPair(tokenAddress, router.WETH());
        }

        IERC20(tokenAddress).approve(address(router), allTokenAmount);

        router.addLiquidityETH{value: ethToAdd}(
            tokenAddress,
            allTokenAmount,
            0,
            0,
            address(this),
            block.timestamp
        );
        token.reserve0 = 0;
        token.reserve1 = 0;

        emit PoolCreated(tokenAddress);
    }

    // Функция для получения резервов токенов и ETH
    function getReserves(uint256 tokenId) public view returns (uint256 reserve0, uint256 reserve1) {
        Token memory token = tokens[tokenId];
        return (token.reserve0, token.reserve1);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}