import React, { Component } from 'react';
import { Button, Form, Input, Segment, Grid, Dropdown, Message, Tab, Container, Statistic, Label } from 'semantic-ui-react';
import web3 from '../config/web3';
import {
  getERCContractInstance,
  getUniswapV2Pair,
  PairInfoArray,
  getUniswapV2Factory,
  getERCContractInstanceWithoutSymbol,
  tagOptions

} from '../config/instances/contractinstances';
import { ToastContainer, toast } from 'react-toastify';

class CheckLiquidity extends Component {
    state = {
        checkPairAddress: 'DAI-KNC',
        checkPairBalance: '0',
        checkbalanceLoading: false,
        symbol0: '',
        symbol1: '',
        reserve0: '0',
        reserve1: '0'
    }

    async componentDidMount(){
        const accounts = await web3.eth.getAccounts();
        
        const UniV2PairAddress = this.state.checkPairAddress;
        const pairInstance = await getUniswapV2Pair(web3, PairInfoArray[0][this.state.checkPairAddress].pairaddress);

        const erc20ContractInstance1 = await getERCContractInstance(web3, UniV2PairAddress);

        const reserves = await pairInstance.methods.getReserves().call();

        const token0 = await pairInstance.methods.token0().call();
        const token1 = await pairInstance.methods.token1().call();

        const token0Instance = await getERCContractInstanceWithoutSymbol(web3, token0);
        const token1Instance = await getERCContractInstanceWithoutSymbol(web3, token1);
        
        const symbol0 = await token0Instance.methods.symbol().call();
        const symbol1 = await token1Instance.methods.symbol().call();

        const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
        this.setState({ 
            checkPairBalance: poolTokenBalance, 
            reserve0: reserves[0],
            reserve1: reserves[1],
            symbol0,
            symbol1
        });
    }  

    checkPoolTokenPair = async () => {
        event.preventDefault();
        try {
            this.setState({checkbalanceLoading: true});
            const accounts = await web3.eth.getAccounts();
            const UniV2PairAddress = this.state.checkPairAddress;
            const pairInstance = await getUniswapV2Pair(web3, PairInfoArray[0][this.state.checkPairAddress].pairaddress);
            const reserves = await pairInstance.methods.getReserves().call();

            const token0 = await pairInstance.methods.token0().call();
            const token1 = await pairInstance.methods.token1().call();

            const token0Instance = await getERCContractInstanceWithoutSymbol(web3, token0);
            const token1Instance = await getERCContractInstanceWithoutSymbol(web3, token1);
            
            const symbol0 = await token0Instance.methods.symbol().call();
            const symbol1 = await token1Instance.methods.symbol().call();
           
            const erc20ContractInstance1 = await getERCContractInstance(web3, UniV2PairAddress);
            const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
            this.setState({
                checkPairBalance: poolTokenBalance,
                reserve0: reserves[0],
                reserve1: reserves[1],
                symbol0,
                symbol1
            });
            this.setState({checkbalanceLoading: false});
        } catch (error) {
            this.setState({checkbalanceLoading: false});
            alert(error);
        }
      };
    

    handlecheckPairs  =  (e, { value }) => {
        this.setState({ 
            checkPairAddress: value 
        });
    };

    render() {
        return(
            <Grid divided stackable>
                <Grid.Row columns={2} verticalalign='middle' textAlign="center">
                        <Grid.Column>
                            <Message info>
                                <Message.Header>Check your pool token liquidity and overall statistic of pair.</Message.Header>
                            </Message>
                            <Form onSubmit={this.checkPoolTokenPair}>
                                <Button.Group color='black'>
                                    <Button basic color='black' loading={this.state.checkbalanceLoading}>
                                        Choose pair
                                    </Button>
                                    <Dropdown
                                        className='button icon'
                                        floating
                                        color="white"
                                        trigger={<React.Fragment />}
                                        options={tagOptions}
                                        value={this.state.checkPairAddress} 
                                        onChange={this.handlecheckPairs}
                                    />
                                </Button.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column>
                        <Segment color="pink">
                            <Statistic color="pink" size='mini'>
                                <Statistic.Label color="pink"><u>{this.state.checkPairAddress}</u> Pool token</Statistic.Label>
                                <Statistic.Value>{this.state.checkPairBalance} Uni-V2 wei</Statistic.Value>
                            </Statistic>
                        </Segment>
                        <Segment color="pink">
                            <Statistic color="pink" size='mini'>
                                <Statistic.Label><u>{this.state.symbol0}</u> liquidity</Statistic.Label>
                                <Statistic.Value>{this.state.reserve0} wei</Statistic.Value>
                            </Statistic>
                            <Statistic color="pink" size='mini'>
                                <Statistic.Label><u>{this.state.symbol1}</u> liquidity</Statistic.Label>
                                <Statistic.Value>{this.state.reserve1} wei</Statistic.Value>
                            </Statistic>
                        </Segment>
                        </Grid.Column>
                    </Grid.Row>
                        
            </Grid>
        );
    }

};

export default CheckLiquidity; 