pragma solidity =0.6.6;

import './IUniswapV2Factory.sol';
import './IUniswapV2Pair.sol';
import './FixedPoint.sol';

import './UniswapV2OracleLibrary.sol';
import './UniswapV2Library.sol';

contract ExampleOracleSimple {
    
    using FixedPoint for *;
    uint public constant PERIOD = 1 minutes;
    IUniswapV2Pair public iUniswapV2Pair;
    IUniswapV2Factory iUniswapV2Factory;
    address public token0;
    address public token1;
    uint    public price0CumulativeLast;
    uint    public price1CumulativeLast;
    uint32  public blockTimestampLast;
    FixedPoint.uq112x112 public price0Average;
    FixedPoint.uq112x112 public price1Average;

    constructor(address factory, address tokenA, address tokenB) public {
        iUniswapV2Factory = IUniswapV2Factory(factory);
        address _pair = iUniswapV2Factory.getPair(tokenA, tokenB);
        iUniswapV2Pair = IUniswapV2Pair(_pair);
        token0 = iUniswapV2Pair.token0();
        token1 = iUniswapV2Pair.token1();
        price0CumulativeLast = iUniswapV2Pair.price0CumulativeLast(); 
        price1CumulativeLast = iUniswapV2Pair.price1CumulativeLast();
        uint112 reserve0;
        uint112 reserve1;
        (reserve0, reserve1, blockTimestampLast) = iUniswapV2Pair.getReserves();
        require(reserve0 != 0 && reserve1 != 0, 'ExampleOracleSimple: NO_RESERVES'); // ensure that there's liquidity in the pair
    }

    function update(uint _PERIOD) external {
        (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) =
            UniswapV2OracleLibrary.currentCumulativePrices(address(iUniswapV2Pair));
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired

        // ensure that at least one full period has passed since the last update
        require(timeElapsed >= _PERIOD, 'ExampleOracleSimple: PERIOD_NOT_ELAPSED');

        // overflow is desired, casting never truncates
        // cumulative price is in (uq112x112 price * seconds) units so we simply wrap it after division by time elapsed
        price0Average = FixedPoint.uq112x112(uint224((price0Cumulative - price0CumulativeLast) / timeElapsed));
        price1Average = FixedPoint.uq112x112(uint224((price1Cumulative - price1CumulativeLast) / timeElapsed));
    
        price0CumulativeLast = price0Cumulative;
        price1CumulativeLast = price1Cumulative;
        blockTimestampLast = blockTimestamp;
    }
    
    function differ(uint _PERIOD, uint32 blockTimestampLast) public view returns(uint32, uint) {
        (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) =
            UniswapV2OracleLibrary.currentCumulativePrices(address(iUniswapV2Pair));
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        return (timeElapsed, _PERIOD);
    }

    // note this will always return 0 before update has been called successfully for the first time.
    function consult(address token, uint amountIn) external view returns (uint amountOut) {
        if (token == token0) {
            amountOut = price0Average.mul(amountIn).decode144();
        } else {
            require(token == token1, 'ExampleOracleSimple: INVALID_TOKEN');
            amountOut = price1Average.mul(amountIn).decode144();
        }
    }
    
}