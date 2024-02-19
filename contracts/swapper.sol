// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./transfer_helper.sol";

// Goerli
// Operating on WETH-USDC pair
contract PancakeSwapper {
    address public uniswapRouter02 = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1;
    address public uniswapFactory = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;

    address public weth;
    address public tokenA = 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C; // hardhcoded the address of deployed tokena contract

    IUniswapV2Router02 private router;
    IUniswapV2Factory private factory;
    IUniswapV2Pair private pair;

    constructor() {
        router = IUniswapV2Router02(uniswapRouter02);
        factory = IUniswapV2Factory(uniswapFactory);
        weth = router.WETH();

        address pairAddress = factory.getPair(weth, tokenA);
        require(pairAddress != address(0), "Pair not found for the tokens");
        pair = IUniswapV2Pair(pairAddress);

        // Approve router to access this contract's WETHswapBNBForTokenA & USDC
        TransferHelper.safeApprove(weth, uniswapRouter02, type(uint256).max);
        TransferHelper.safeApprove(tokenA, uniswapRouter02, type(uint256).max);
    }

    function routerFactory() external view returns (address) {
        return router.factory();
    }

    function getUSDCBalanceOf(address _account) public view returns (uint256) {
        IERC20 usdcToken = IERC20(tokenA);
        return usdcToken.balanceOf(_account);
    }

    function swapBNBForTokenA(
        address to,
        address _tokenA,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 deadline
    ) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = _tokenA;
        router.swapExactETHForTokens{value: amountIn}(
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    function getReserves() public view returns (uint112, uint112) {
        (uint112 reserves0, uint112 reserves1, ) = pair.getReserves();
        return (reserves0, reserves1);
    }

    function addLiquidity(uint256 deadline) external payable {
        (uint112 reserves0, uint112 reserves1, ) = pair.getReserves();

        uint256 ethAmount = msg.value;

        uint256 amountTokenDesired = (((ethAmount / 2) * reserves1) /
            reserves0);

        swapBNBForTokenA(address(this), tokenA, ethAmount / 2, 0, deadline);

        router.addLiquidityETH{value: ethAmount / 2}(
            tokenA,
            amountTokenDesired,
            0,
            ethAmount,
            msg.sender,
            deadline
        );

        // Refund any weth or tokenA back to user (Amount that wasn't sent to router or similar)
        uint256 usdcBalance = getUSDCBalanceOf(address(this));
        if (usdcBalance > 0) {
            IERC20 usdcToken = IERC20(tokenA);
            usdcToken.transfer(msg.sender, usdcBalance);
        }

        if (address(this).balance > 0) {
            msg.sender.call{value: address(this).balance};
        }
    }

    function lptBalanceOf(address _account) external view returns (uint256) {
        return pair.balanceOf(_account);
    }
}
