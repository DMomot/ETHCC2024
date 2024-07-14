// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "./token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import { SD59x18, convert } from "@prb/math/src/SD59x18.sol";

contract Launchpad is Ownable {
    uint256 public constant TOKEN_PRICE = 1 wei;
    uint256 public constant MIN_ETH_RESERVE = 0.000001 ether;
    uint256 public tokenIdCounter;
    address public uniswapRouter;
    address public uniswapFactory;

    struct Token {
        string name;
        string symbol;
        uint256 reserve0; // tokens
        uint256 reserve1; // ETH
        address tokenAddress;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => uint256) private _userTokensId;

    event TokenCreated(uint256 tokenId, address tokenAddress, string name, string symbol, uint256 initialSupply);
    event TokensSwapped(uint256 tokenId, address tokenAddress, int256 amount0, int256 amount1);
    event Reserves(uint256 reserve0, uint256 reserve1);
    event PoolCreated(address poolAddress);
    event DebugLog2(string name, int256 value);

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
            reserve0: 10**18,
            reserve1: msg.value,
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
            require(IERC20(token.tokenAddress).transferFrom(msg.sender, address(this), amount0In), "Token transfer failed");
            uint256 newReserve0 = token.reserve0 + amount0In;
            uint256 newReserve1 = k / newReserve0;

            amountOut = token.reserve1 - newReserve1;

            token.reserve0 = newReserve0;
            token.reserve1 = newReserve1;

            payable(msg.sender).transfer(amountOut);
            emit TokensSwapped(tokenId, token.tokenAddress, int256(amount0In), -1 * int256(amountOut));
        } else { // Swap ETH to Tokens
            require(msg.value == amount1In, "Incorrect ETH amount sent");

            uint256 newReserve1 = token.reserve1 + amount1In;
            uint256 newReserve0 = calculateReserves0(int256(newReserve1));

            amountOut = token.reserve0 - newReserve0;

            require(amountOut <= token.reserve0, "Not enough tokens in reserve");

            token.reserve1 = newReserve1;
            token.reserve0 = newReserve0;

            require(IERC20(token.tokenAddress).transfer(msg.sender, amountOut), "Token transfer failed");
            emit TokensSwapped(tokenId, token.tokenAddress, -1 * int256(amountOut), int256(amount1In));
        }
        emit Reserves(token.reserve1, token.reserve0);
    }

    function calculateReserves0(int256 reserves1) public returns (uint256) {
        int256 a = 11345; // 0.11345 * 10^5
        int256 a_scale = 10 ** 5;
        int256 b = 2 * 6; // 2 * 0.00000000000000006 * 10^18

        int256 b_scale = 10 ** 18;
        int256 base_scale = 10 ** 18;

        SD59x18 a_fixed = convert(a);
        SD59x18 a_scale_fixed = convert(a_scale);
        SD59x18 b_fixed = convert(b);
        SD59x18 b_scale_fixed = convert(b_scale);
        SD59x18 base_scale_fixed = convert(base_scale);
        SD59x18 reserves1_fixed = convert(reserves1);

        SD59x18 exponent = b_fixed.div(b_scale_fixed).mul(reserves1_fixed);

        SD59x18 exp_result = exponent.exp();

        SD59x18 result = reserves1_fixed.div(a_fixed.div(a_scale_fixed).mul(exp_result)).div(base_scale_fixed);

        return uint256(result.unwrap());
    }

    function createPool(address tokenAddress) public onlyOwner {
        IUniswapV2Router02 router = IUniswapV2Router02(uniswapRouter);
        IUniswapV2Factory factory = IUniswapV2Factory(uniswapFactory);

        uint256 tokenId = _userTokensId[tokenAddress];
        Token storage token = tokens[tokenId];

        uint256 allTokenAmount = IERC20(tokenAddress).balanceOf(address(this));
        require(allTokenAmount > 0, "No tokens available for liquidity");

        uint256 ethToAdd = token.reserve1;

        address pool = factory.getPair(tokenAddress, router.WETH());
        if (pool == address(0)) {
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

    function getReserves(uint256 tokenId) public view returns (uint256 reserve0, uint256 reserve1) {
        Token memory token = tokens[tokenId];
        return (token.reserve0, token.reserve1);
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}