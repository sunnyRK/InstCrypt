import React, { Component } from 'react';
import {Message, Tab, Container, List, Label, Grid, Segment } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import Trade from "./trade"; 
import Transaction from "./transaction";

class InstCryp extends Component {

  
  async componentDidMount(){  
    window.ethereum.enable()
    window.web3 = web3
}  

  render() {
    const panes = [
      {
        menuItem: 'Manage Pools and Automate Trade',
        render: () => 
          <Trade/>,
      },
      {
        menuItem: 'Transaction History',
        render: () => 
          <Tab.Pane attached={false}>
            <Transaction/>
          </Tab.Pane>,
      },
    ]

    return (
      <Layout>
        <ToastContainer/>
          <Container>
            {/* <Segment style={{backgroundColor:"#f8f8f8"}} textAlign="center" >
              <Grid>
                <Grid.Row columns={3}>
                  <Grid.Column>
                    <Label as="a" tag color="blue">
                      Automate Trade
                    </Label>
                  </Grid.Column>
                  <Grid.Column>
                    <Label as="a" tag color="green">
                      Liquidity Providers
                    </Label>
                  </Grid.Column>
                  <Grid.Column>
                    <Label as="a" tag color="red">
                      Liquidity Reserves
                    </Label>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment> */}
            <Tab menu={{secondary: true }} panes={panes}/>
            <Message color="black">
                <Message.Header>Instructions</Message.Header>
                <List as="ol">
                    <List.Item as="li" value='*'>
                      InstCrypt is automated trustless trading platform. InstCrypt used Uniswap V2 Oracles and Uniswap V2 trading to 
                      set up trust-less/automated 
                      trading with no interface without requiring user to pass minimum return value for safety.
                    </List.Item>
                    <List.Item as="li" value='*'>
                      Now traders can perform the trade between crypto pairs and platform checks if the trade is satisfied the threshold of slippage rate then platform automatically execute trade.
                    </List.Item>
                    <List.Item as="li" value='*'>
                      Even Liquidity providers can add or remove liquidity and can track their liquidity through platform.
                    </List.Item>
                    <List.Item as="li" value='*'>This DAPP is currently for Ropsten network</List.Item>
                </List>
            </Message>
          </Container>
      </Layout>
    );
  }
}

export default InstCryp; 