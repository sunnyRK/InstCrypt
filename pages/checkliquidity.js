import React, { Component } from 'react';
import { Button, Form, Input, Segment, Grid, Dropdown, Message, Tab, Image, Statistic, Label, Divider } from 'semantic-ui-react';
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
        
        const poolBal = (parseFloat(poolTokenBalance)/1000000000000000000).toFixed(2);
        const rese0 = (parseFloat(reserves[0])/1000000000000000000).toFixed(2);
        const rese1 = (parseFloat(reserves[1])/1000000000000000000).toFixed(2);

        const pool0 = poolTokenBalance +"("+ poolBal +")";
        const res0 = reserves[0] +"("+ rese0 +")";
        const res1 = reserves[1] +"("+ rese1 +")";

        this.setState({ 
            checkPairBalance: pool0, 
            reserve0: res0,
            reserve1: res1,
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

            const poolBal = (parseFloat(poolTokenBalance)/1000000000000000000).toFixed(2);
            const rese0 = (parseFloat(reserves[0])/1000000000000000000).toFixed(2);
            const rese1 = (parseFloat(reserves[1])/1000000000000000000).toFixed(2);

            const pool0 = poolTokenBalance +"("+ poolBal +")";
            const res0 = reserves[0] +"("+ rese0 +")";
            const res1 = reserves[1] +"("+ rese1 +")";
            
            this.setState({
                checkPairBalance: pool0,
                reserve0: res0,
                reserve1: res1,
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
            <div>
            <Grid stackable>
                <Grid.Row columns={2}>
                    <Grid.Column width={4}>
                        <Image size='tiny' src='/static/images/uniswap.png' style={{marginRight:"10px"}} verticalAlign='middle'/>
                        <span>
                            <Statistic size="mini">
                                <Statistic.Label>LIQUIDITY RESERVES</Statistic.Label>
                                <Statistic.Value>Uniswap</Statistic.Value>
                            </Statistic>
                        </span>
                    </Grid.Column>
                    <Grid.Column style={{marginLeft:"200px"}} textAlign="center">
                        <Message>
                            <Message.Header>
                                Check reserves of any pair and respected your pool token to that pair.
                            </Message.Header>
                            <Form onSubmit={this.checkPoolTokenPair} style={{margin:"10px"}}>
                                <Button.Group color='black'>
                                    <Button loading={this.state.checkbalanceLoading} style={{ marginLeft: '0em', color: "#fff" }} color="black">
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
                        </Message>
                    </Grid.Column>
                </Grid.Row>
                <Divider></Divider>
                <Grid.Row columns={3} divided verticalalign='middle' textAlign="center">
                        <Grid.Column>
                            <Segment style={{backgroundColor:"black"}}>
                                <Statistic color="white" size='mini'>
                                    <Statistic.Label style={{color:"#fff"}}><u>{this.state.checkPairAddress}</u> Pool token</Statistic.Label>
                                    <Statistic.Value style={{color:"#fff"}}>{this.state.checkPairBalance} Uni-V2 wei</Statistic.Value>
                                </Statistic>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment style={{backgroundColor:"#fff"}}>
                                <Statistic size='mini'>
                                    <Statistic.Label style={{color:"#000"}}><u>{this.state.symbol0}</u> liquidity</Statistic.Label>
                                    <Statistic.Value style={{color:"#000"}}>{this.state.reserve0} wei</Statistic.Value>
                                </Statistic>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                        <Segment color="white" style={{backgroundColor:"#fff"}}>
                            <Statistic color="pink" size='mini'>
                                <Statistic.Label style={{color:"#000"}}><u>{this.state.symbol1}</u> liquidity</Statistic.Label>
                                <Statistic.Value style={{color:"#000"}}>{this.state.reserve1} wei</Statistic.Value>
                            </Statistic>
                        </Segment>
                        </Grid.Column>
                    </Grid.Row>
                        
            </Grid>
            </div>
        );
    }

};

export default CheckLiquidity; 