import React, { Component } from 'react';
import { Button, Form, Input, Grid, Dropdown, Message, Tab, Segment, Icon } from 'semantic-ui-react';
import web3 from '../config/web3';
import Axios from 'axios';
import {
    getUniswapV2Pair, 
    getUniswapV2Router, 
    getUniswapV2Library, 
    getOraclePriceInstance,
    getERCContractInstance,
    getUniswapV2Factory,
    TokenInfoArray,
    PairInfoArray,
    tagOptions
} from '../config/instances/contractinstances';
import { ToastContainer, toast } from 'react-toastify';
import CheckLiquidity from './checkliquidity';
import Liquidity from "./liquidity";
import Transaction from "./transaction";

class Trade extends Component {
    state = {
        tradeLoading: false,
        addLiquidityLoading: false,
        removeLiquidityLoading: false,
        updateLoading: false,
        amountSwapDesired: '',
        amountOut: '',
        pairTokens: [],
        token0: '',
        token1: '',
        minValue: 0, 
        shouldSwap: false,
        pairAddress: '',
        routeraddress: '0xcDbE04934d89e97a24BCc07c3562DC8CF17d8167',
        slippage: '',
        consultPrice: ''
    }

    async calculateSLippageRate() {
        const accounts = await web3.eth.getAccounts();
        const oracleInstance = await getOraclePriceInstance(web3);
        // it gives tokenAddress value respect to consultAmountIn value
        const tokenAddress0 = TokenInfoArray[0][this.state.token0].token_contract_address;
        const tokenAddress1 = TokenInfoArray[0][this.state.token1].token_contract_address;

        const factoryInstance = await getUniswapV2Factory(web3);
        const pair = await factoryInstance.methods.getPair(tokenAddress0, tokenAddress1).call();
        // const blockTimeStampLast = await oracleInstance.methods.getBlockLastTimeStamp(pair).call();

        // const timeStampDiff = Math.floor(new Date().getTime()/1000) - blockTimeStampLast;
        // console.log(timeStampDiff);
        // if(timeStampDiff > 86400) {
        //     await oracleInstance.methods.update(
        //         pair
        //     ).send({
        //         from: accounts[0]
        //     });
        // }

        const consultPrice = await oracleInstance.methods.consult(pair, tokenAddress1, this.state.amountSwapDesired).call();
        
        const difference = consultPrice - this.state.amountOut;
        const numerator = difference * 100;
        const slippage = numerator/consultPrice; 
        const slippage2 = slippage + " % Slippage rate"
        this.setState({
            slippage: slippage2,
            consultPrice
        }) 
    }

    async getAmountOutValue() {
        const pairInstance = await getUniswapV2Pair(web3, this.state.pairAddress);
        const reserves = await pairInstance.methods.getReserves().call();
        const token0V2Pair = await pairInstance.methods.token0().call();
        const token1V2Pair = await pairInstance.methods.token1().call();

        const libInstance = await getUniswapV2Library(web3);
        // const amountIn = await libInstance.methods.getAmountIn("100","91566","70966").call();
        // it gives reserves[1] value
        let amountOut;
        if(token0V2Pair == TokenInfoArray[0][this.state.token0].token_contract_address) {
            amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired,reserves[0], reserves[1]).call();
        } else {
            amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired,reserves[1], reserves[0]).call(); 
        }
        this.setState({
            amountOut
        })    
        await this.calculateSLippageRate();
    }

    updateOracle = async () => {
        event.preventDefault();
        try {
            this.setState({updateLoading: true});
            if(this.state.token0 != "") {
                const accounts = await web3.eth.getAccounts();
                const oracleInstance = await getOraclePriceInstance(web3);
                // it gives tokenAddress value respect to consultAmountIn value
                const tokenAddress0 = TokenInfoArray[0][this.state.token0].token_contract_address;
                const tokenAddress1 = TokenInfoArray[0][this.state.token1].token_contract_address;
    
                const factoryInstance = await getUniswapV2Factory(web3);
                const pair = await factoryInstance.methods.getPair(tokenAddress0, tokenAddress1).call();
                const blockTimeStampLast = await oracleInstance.methods.getBlockLastTimeStamp(pair).call();
    
                const timeStampDiff = Math.floor(new Date().getTime()/1000) - blockTimeStampLast;
                if(timeStampDiff > 86400) {
                    await oracleInstance.methods.update(
                        pair
                    ).send({
                        from: accounts[0]
                    });
                }
            } else {
                toast.error("Please select token pair!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.setState({updateLoading: false});
        } catch (error) {
            this.setState({updateLoading: false});
            console.log(error);
        }
    };

    swapExactTokensForTokens = async () => {
        event.preventDefault();
        try {
            this.setState({shouldSwap: false, tradeLoading: true});

            // check if token is selelcted?
            if(this.state.token0 != "") {

            //check if trade value is added?
            if(parseInt(this.state.amountSwapDesired) > 0) {
                const accounts = await web3.eth.getAccounts();
                
                if(parseInt(this.state.amountOut) >= parseInt(this.state.consultPrice)) {
                    // trade directly
                    console.log("All set to go");
                    this.setState({shouldSwap: true});
                } else {
                    if(parseInt(this.state.slippage) <= 0.9) {
                    this.setState({shouldSwap: true});
                    } else {
                    console.log("Slippage rate is high");
                    console.log("Slippage rate: ", this.state.slippage);
                    }
                }

                const oracleInstance = await getOraclePriceInstance(web3);
                // it gives tokenAddress value respect to consultAmountIn value
                const tokenAddress0 = TokenInfoArray[0][this.state.token0].token_contract_address;
                const tokenAddress1 = TokenInfoArray[0][this.state.token1].token_contract_address;
    
                const factoryInstance = await getUniswapV2Factory(web3);
                const pair = await factoryInstance.methods.getPair(tokenAddress0, tokenAddress1).call();
                const blockTimeStampLast = await oracleInstance.methods.getBlockLastTimeStamp(pair).call();
    
                const timeStampDiff = Math.floor(new Date().getTime()/1000) - blockTimeStampLast;
                if(timeStampDiff > 86400) {
                    toast.error("Please update oracle price using update button below!!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                } else {
                    
                    if(this.state.shouldSwap) {
                        // Trade will happen here
                        this.setState({shouldSwap: false});
                        const erc20ContractInstance2 = await getERCContractInstance(web3, this.state.token0);
            
                        // check balance
                        const balance = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();
                        console.log(balance)
                        console.log(this.state.amountSwapDesired)
                        if(balance >= this.state.amountSwapDesired) {
                            
                        const allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                        if(parseInt(allowance) < parseInt(this.state.amountSwapDesired)) {
                            await erc20ContractInstance2.methods.approve(
                            this.state.routeraddress, // Uniswap router address
                            this.state.amountSwapDesired
                            ).send({
                                from: accounts[0]
                            });
                        }
            
                            //check allowance
                            if(parseInt(allowance) >= parseInt(this.state.amountSwapDesired)) {
                                const routeContractInstance = await getUniswapV2Router(web3);
                                const transactionHash = await routeContractInstance.methods.swapExactTokensForTokens(
                                    this.state.amountSwapDesired,
                                    this.state.minValue,
                                    [TokenInfoArray[0][this.state.token0].token_contract_address, TokenInfoArray[0][this.state.token1].token_contract_address],
                                    accounts[0],
                                    Math.floor(new Date().getTime()/1000) + 86400
                                ).send({
                                    from: accounts[0]
                                });
                                //add transation in transaction history
                                const models = {
                                    "transactionHash": transactionHash.transactionHash,
                                    "token0" : this.state.token0,
                                    "token1" : this.state.token1,
                                    "pairAddress" : this.state.pairAddress,
                                    "amountIN": this.state.amountSwapDesired,
                                    "amountOut": this.state.amountOut
                                }

                                Axios.post('https://instcrypt-node-api.herokuapp.com/api/createProgram', models)
                                    .then(res => {
                                        if(res.statusText == "OK") {
                                            alert("success");
                                        } else {
                                            console.log(res);
                                            alert("Error");
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        this.setState({shouldSwap: false, tradeLoading: false});
                                        alert("Catch");
                                    })

                                    console.log(transactionHash);
                                    toast.success("Trade Successful and transaction added to transaction history!!", {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                
                                    toast.success("Transaction Hash: " + transactionHash.blockHash , {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                            } else {
                                // Insufficeient allowance
                                    toast.error(this.state.token0 + " allowance is not given perfectly. Please Try again!", {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                }
                            } else {
                                // Insufficeient balance
                                toast.error("Insufficeient " + this.state.token0 + " balance!", {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                            }
                        } else {
                            // Slippage rate is high so trade will not be happen
                            toast.error("Swap will not be perform, Slippage rate is high!", {
                            position: toast.POSITION.TOP_RIGHT
                            });
                        } 
                    }
                } else {
                    toast.error("Please add valid value!!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                toast.error("Please select trade pair and token", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }    
            this.setState({shouldSwap: false, tradeLoading: false});
        } catch (error) {
            this.setState({shouldSwap: false, tradeLoading: false});
            console.log(error);
        }
    };

    handlePairs =  (e, { value }) => {
        const pair = [
          {
            key: PairInfoArray[0][value].token0,
            text: PairInfoArray[0][value].token0,
            value: PairInfoArray[0][value].token0,
            label: { color: 'red', empty: true, circular: true },
          },
          {
            key: PairInfoArray[0][value].token1,
            text: PairInfoArray[0][value].token1,
            value: PairInfoArray[0][value].token1,
            label: { color: 'blue', empty: true, circular: true },
          }
        ];
        
        this.setState({ 
            tradePairTokens: value, 
            pairTokens: pair, 
            token0: PairInfoArray[0][value].token0, 
            token1: PairInfoArray[0][value].token1, 
            pairAddress: PairInfoArray[0][value].pairaddress,
        });
    }; 
      
    handlePairTokens  =  (e, { value }) => {
        let tempToken2;
        if(value != this.state.token0) {
        tempToken2 = this.state.token0;
        } else {
        tempToken2 = this.state.token1;
        }
        this.setState({ token0: value, token1: tempToken2 });
    }; 
    
    handleInputPrice = async (e,{ value }) => {
        if(this.state.token0 != "") {  
            this.setState({
                amountSwapDesired: event.target.value,
                amountOut: "Wait...",
                slippage: "Wait..."
            })    
            const amountOut = await this.getAmountOutValue();    
        } else {
            alert("Please select token among pair.")
        }
    }
    render() {
        return(
            <Tab.Pane attached={false}>
                <Segment style={{backgroundColor:"#f5f5f5"}} color="black">
                <CheckLiquidity/>   
                </Segment>
                    <Grid columns={2} divided stackable textAlign='center'>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Segment color="blue">
                                    <Form onSubmit={this.swapExactTokensForTokens}>
                                        <Form.Field>
                                            <Message color="blue">
                                                <Message.Header>Crypto Trade</Message.Header>
                                                    Trade with any crypto pair
                                            </Message>
                                        </Form.Field>
                                        <Form.Field>
                                            <Dropdown
                                                placeholder="Select pair tokens.."
                                                value={this.state.tradePairTokens} 
                                                options={tagOptions}
                                                onChange={this.handlePairs} 
                                                fluid selection     
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                label={
                                                    <Dropdown
                                                        options={this.state.pairTokens}
                                                        onChange={this.handlePairTokens} 
                                                    />
                                                }
                                                color="teal"
                                                type = "input"
                                                labelPosition="right"
                                                placeholder="Add value in Wei"
                                                value={this.state.amountSwapDesired}
                                                onChange={this.handleInputPrice}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                type = "input"
                                                placeholder="Amount Out"
                                                value={this.state.amountOut}
                                                onChange={event => 
                                                    this.setState({
                                                        amountOut: event.target.value,
                                                })}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                type = "input"
                                                placeholder="Slippage Rate"
                                                value={this.state.slippage}
                                                onChange={event => 
                                                    this.setState({
                                                        slippage: event.target.value,
                                                })}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Button 
                                                color="blue"
                                                bsStyle="primary" 
                                                type="submit"
                                                loading={this.state.tradeLoading}
                                                style={{width:"280px", height:"40px"}}> 
                                                <Icon name="american sign language interpreting"></Icon>
                                                Trade
                                            </Button>
                                        </Form.Field>
                                    </Form>
                                    <Form onSubmit={this.updateOracle} style={{marginTop: "10px"}}>
                                        <Form.Field>
                                            <Button 
                                                color="black"
                                                basic
                                                bsStyle="primary" 
                                                type="submit"
                                                loading={this.state.updateLoading}
                                                style={{width:"280px", height:"40px"}}> 
                                                <Icon name="edit"></Icon>
                                                Update Oracle Price
                                            </Button>
                                        </Form.Field>
                                    </Form>
                                    </Segment>    
                                <Liquidity/>
                                </Grid.Column>
                                <Transaction/>
                        </Grid.Row>
                    </Grid>
                </Tab.Pane>
        );
    }

};

export default Trade; 