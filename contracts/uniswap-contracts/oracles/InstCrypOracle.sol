pragma solidity =0.6.6;

import './IUniswapV2Factory.sol';
import './IUniswapV2Pair.sol';
import './FixedPoint.sol';

import './UniswapV2OracleLibrary.sol';
import './UniswapV2Library.sol';

contract InstCrypOracle {
    
    using FixedPoint for *;
    uint public constant PERIOD = 24 hours;
    
    IUniswapV2Pair public iUniswapV2Pair;
    IUniswapV2Factory iUniswapV2Factory;
    uint32  public blockTimestampLast;

    struct oraclePairInfo {
        address token0;
        address token1;
        uint price0CumulativeLast;
        uint price1CumulativeLast;
        uint32 blockTimestampLast;
        FixedPoint.uq112x112 price0Average;
        FixedPoint.uq112x112 price1Average;
    }
    mapping (address => oraclePairInfo) oraclePairMapping;    
    address[] _pairs;

    constructor(address factory) public {
        iUniswapV2Factory = IUniswapV2Factory(factory);
    }

    function setPairInfo(address tokenA, address tokenB) public  {
        address _pair = iUniswapV2Factory.getPair(tokenA, tokenB);
        iUniswapV2Pair = IUniswapV2Pair(_pair);
        oraclePairMapping[_pair].token0 = iUniswapV2Pair.token0();
        oraclePairMapping[_pair].token1 = iUniswapV2Pair.token1();
        oraclePairMapping[_pair].price0CumulativeLast = iUniswapV2Pair.price0CumulativeLast(); 
        oraclePairMapping[_pair].price1CumulativeLast = iUniswapV2Pair.price1CumulativeLast();
        uint112 reserve0;
        uint112 reserve1;
        (reserve0, reserve1, blockTimestampLast) = iUniswapV2Pair.getReserves();
        oraclePairMapping[_pair].blockTimestampLast = blockTimestampLast;
        _pairs.push(_pair);
        // require(reserve0 != 0 && reserve1 != 0, 'ExampleOracleSimple: NO_RESERVES');
    }

    function update(address _pair) external {
        iUniswapV2Pair = IUniswapV2Pair(_pair);
        (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) =
            UniswapV2OracleLibrary.currentCumulativePrices(address(iUniswapV2Pair));
        uint32 timeElapsed = blockTimestamp - oraclePairMapping[_pair].blockTimestampLast; // overflow is desired

        // ensure that at least one full period has passed since the last update
        require(timeElapsed >= PERIOD, 'ExampleOracleSimple: PERIOD_NOT_ELAPSED');

        // overflow is desired, casting never truncates
        // cumulative price is in (uq112x112 price * seconds) units so we simply wrap it after division by time elapsed
        oraclePairMapping[_pair].price0Average = FixedPoint.uq112x112(uint224((price0Cumulative - oraclePairMapping[_pair].price0CumulativeLast) / timeElapsed));
        oraclePairMapping[_pair].price1Average = FixedPoint.uq112x112(uint224((price1Cumulative - oraclePairMapping[_pair].price1CumulativeLast) / timeElapsed));
    
        oraclePairMapping[_pair].price0CumulativeLast = price0Cumulative;
        oraclePairMapping[_pair].price1CumulativeLast = price1Cumulative;
        oraclePairMapping[_pair].blockTimestampLast = blockTimestamp;
    }

    // note this will always return 0 before update has been called successfully for the first time.
    function consult(address _pair, address token, uint amountIn) external view returns (uint amountOut) {
        if (token == oraclePairMapping[_pair].token0) {
            amountOut = oraclePairMapping[_pair].price0Average.mul(amountIn).decode144();
        } else {
            require(token == oraclePairMapping[_pair].token1, 'ExampleOracleSimple: INVALID_TOKEN');
            amountOut = oraclePairMapping[_pair].price1Average.mul(amountIn).decode144();
        }
    }
    
    function getBlockLastTimeStamp(address _pair) public view returns(uint32) {
        return oraclePairMapping[_pair].blockTimestampLast;
    }
}