# InstCrypt

InstCrypt used Uniswap-V2 and Uniswap-V2 oracles to set up a trustless automated crypto trading platform without requiring the user to pass minimum return value for safety.

Uniswap works on ERC20-ERC20 pair. So, If you want to trade you need to pass minimum return value for safety, deadline and Path of the token. InstCrypt removes these all hurdles.

InstCrypt calculates the reserve price of pair and calculates the Oracle price which is written on top of Uniswap-V2 oracles. And Calculates Slippage rate using these both price. 
If the Slippage rate satisfied the threshold then platform executes automate trade for trader otherwise it shows the error to perform trade.

For e.g. Send 1 DAI to pair from the platform and it will execute a single transaction DAI -> KNC swap for you if the slippage rate <=0.5% between liquidity reserve and DAI/KNC 1-hour TWAP from an oracle built on Uniswap V2.

Even using InstCrypt, Liquidity providers can manage pools like they can deposit or sell liquidity to earn interests.
It also saves trade transaction history and provides all transaction details in a single place in platform.

## How was it made?

I have used Uniswap-V2 protocol to build automated trading platform. InstCrypt is supporting a trading crypto pair using Uniswap smart contract. So, Using platform liquidity providers can add and remove liquidity and traders can perform trade using Uniswap V2 smart contract. 

InstCrypt is calling uniswap smart contract using web3.js library and for calculating slippage rate I have written oracle smart contract on top of uniswap-v2 oracles.

I used Next.js and Semantic UI react to design the frontend. And for saving the trade transaction history, I write node.js API and saves history in mongodb database.

## How to run

1. Clone repo `https://github.com/sunnyRK/InstCrypt.git`
2. `npm install`
3. `node server.js`
4. Currently deployed on Ropsten Network

## Future Task

1. Get Liquidity from other protocols(AAVE, Compound)
2. Chainlink integration

## Tech stack

Ethereum   
Solidity   
Web3.js   
Uniswap-V2  
Uniswap-V2-Oracles  
nodejs api  
MongoDB  
Next.Js  
Semantic UI React




