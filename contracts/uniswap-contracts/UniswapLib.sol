pragma solidity ^0.6.0;

import "./UniswapV2Library.sol";

contract UniswapV2LibraryWrapper {
    
    //// UniswapV2Library
    function getAmountsOut(address factory, uint amountIn, address[] memory path) public view returns (uint[] memory amounts) {
        return UniswapV2Library.getAmountsOut(factory, amountIn, path);    
    }
    
    function getAmountsIn(address factory, uint amountOut, address[] memory path) public view returns (uint[] memory amounts) {
        return UniswapV2Library.getAmountsIn(factory, amountOut, path);    
    }
    
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public view returns (uint amountOut) {
        return UniswapV2Library.getAmountOut(amountIn, reserveIn, reserveOut);    
    }
    
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) public view returns (uint amountIn) {
        return UniswapV2Library.getAmountIn(amountOut, reserveIn, reserveOut);    
    }
    
    function getPairFor(address factory, address tokenA, address tokenB) public view returns(address) {
        return UniswapV2Library.pairFor(factory, tokenA, tokenB);
    }
    
}