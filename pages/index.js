import React, { Component } from 'react';
import {Message, Tab, Container, List } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import Trade from "./trade"; 

class InstCryp extends Component {


  render() {
    const panes = [
      {
        menuItem: 'Crypto Trade',
        render: () => 
          <Trade/>,
      }
    ]

    return (
      <Layout>
        <ToastContainer/>
          <Container>
            <Tab menu={{secondary: true }} panes={panes}/>
            <Message>
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