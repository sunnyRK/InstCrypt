pragma solidity ^0.6.0;

import "./IUniswapV2Router01.sol";
import "./IUniswapV2Pair.sol";
import "./UniswapV2Library.sol";
import "./IUniswapV2Factory.sol";
import "./IUniswapV2ERC20.sol";
import "./TransferHelper.sol";

contract InstCryp {
    
    IUniswapV2Factory public iUniswapV2Factory;
    IUniswapV2Pair public iUniswapV2Pair;
    IUniswapV2Router01 public iUniswapV2Router01;
    
    constructor(address factory, address router) public {
        iUniswapV2Factory = IUniswapV2Factory(factory);
        iUniswapV2Router01 = IUniswapV2Router01(router);
        iUniswapV2Pair = IUniswapV2Pair(0x2084b246D7455E973F646Eac00D655541F50aD61);
    }
    
    ////// iUniswapV2Factory
    function createPair(address tokenA, address tokenB) public {
        iUniswapV2Factory.createPair(tokenA, tokenB);
    } 
    
    function getPair(address tokenA, address tokenB) public view returns(address) {
        return iUniswapV2Factory.getPair(tokenA, tokenB);
    }
    
    function feeTo() public view returns(address) {
        iUniswapV2Factory.feeTo();
    } 
    
    ////// iUniswapV2Router01
    function addLiquidity(
      address tokenA,
      address tokenB,
      uint amountADesired,
      uint amountBDesired,
      uint amountAMin,
      uint amountBMin,
      address to,
      uint deadline
    ) public returns (uint, uint, uint) {
        return iUniswapV2Router01.addLiquidity(
            tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline    
        );
    }
    
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) public payable returns(uint, uint, uint) {
        return iUniswapV2Router01.addLiquidityETH(
            token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline    
        );
    }
    
    function removeLiquidity(
      address tokenA,
      address tokenB,
      uint liquidity,
      uint amountAMin,
      uint amountBMin,
      address to,
      uint deadline
    ) public returns (uint, uint){
       return iUniswapV2Router01.removeLiquidity(
            tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline    
        ); 
    }
    
    function swapExactTokensForTokens(
      uint amountIn,
      uint amountOutMin,
      address[] memory path,
      address to,
      uint deadline
    ) public returns (uint[] memory){
        return iUniswapV2Router01.swapExactTokensForTokens(
            amountIn, amountOutMin, path, to, deadline    
        );
    }
    
    function WETH() public view returns (address){
        return iUniswapV2Router01.WETH();
    }
    
    /////// approve router contract 
    function approveForSwap(address tokenA, uint256 amountToken) public {
        IUniswapV2ERC20(tokenA).approve(address(iUniswapV2Router01), amountToken);
    }
    
    function balanceOf(address pair, address addr) public view returns(uint) {
        return IUniswapV2ERC20(pair).balanceOf(addr);
    }
    
    function approveRouter(address tokenA, address tokenB, uint256 amountToken) public {
        IUniswapV2ERC20(tokenA).approve(address(iUniswapV2Router01), amountToken);
        IUniswapV2ERC20(tokenB).approve(address(iUniswapV2Router01), amountToken);   
        // TransferHelper.safeApprove(tokenA, address(iUniswapV2Router01), amountToken);
        // TransferHelper.safeApprove(tokenB, address(iUniswapV2Router01), amountToken);
    }
    
    function transferFrom( address from, address pair, address tokenA, address tokenB, uint256 amount) public {
        // address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
        TransferHelper.safeTransferFrom(tokenA, from, pair, amount);
        TransferHelper.safeTransferFrom(tokenB, from, pair, amount);
    }
    
    //// UniswapV2Library
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public view returns (uint amountOut) {
        return UniswapV2Library.getAmountOut(amountIn, reserveIn, reserveOut);    
    }
    
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) public view returns (uint amountIn) {
        return UniswapV2Library.getAmountIn(amountOut, reserveIn, reserveOut);    
    }
    
    ////// iUniswapV2Pair
    function getV2PairAddress(address pair) public {
        iUniswapV2Pair = IUniswapV2Pair(pair);
    }
    
    function getReserves() public view returns(uint112, uint112, uint32) {
        return iUniswapV2Pair.getReserves();
    }

    function token0() public view returns(address) {
        return iUniswapV2Pair.token0();
    }
    
    function price0CumulativeLast() public view returns(uint) {
        return iUniswapV2Pair.price0CumulativeLast();   
    }
    
    function price1CumulativeLast() public view returns(uint) {
        return iUniswapV2Pair.price1CumulativeLast();   
    }
    
    function kLast() public view returns(uint) {
        return iUniswapV2Pair.kLast();   
    }
    
    ////// UniswapV2Library
    function getPairFor(address factory, address tokenA, address tokenB) public view returns(address) {
        return UniswapV2Library.pairFor(factory, tokenA, tokenB);
    }
    
}