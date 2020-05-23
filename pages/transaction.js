import React, { Component } from 'react';
import { Grid, Message, Card, Segment, Input, Form, Button, Icon } from 'semantic-ui-react';
import Axios from 'axios';

class Transaction extends Component {
    state = {
      items: [],
      waitMessage: "Please wait..."
    }

    async componentDidMount(){  
        Axios.get('https://instcrypt-node-api.herokuapp.com/api/getAllProgram')
        .then(res => {
            if(res.statusText == "OK") {
  
              var items = [];
              if(res.data.length > 0) {
                  for(var j=0;j<res.data.length;j++) {
                      const TransactionDetails = res.data[j];
                    //   console.log(TransactionDetails);
                      var hashLink = "https://ropsten.etherscan.io/tx/"+TransactionDetails.transactionHash;
                      items[j] =  {
                          header: (<a href={hashLink}>Transaction Hash: {TransactionDetails.transactionHash}</a>),
                          meta: TransactionDetails.token0 +"/"+TransactionDetails.token1 +" Pair Address: " + TransactionDetails.pairAddress,
                          description: 'AmountIn(' + TransactionDetails.amountIN +") : AmountOut(" + TransactionDetails.amountOut+")",                
                          fluid: true,
                          style: { overflowWrap: 'break-word' }
                      };
                  }
              }
              this.setState({
                  items
              }, () => {
                  if(this.state.items.length == 0){
                      this.setState({
                          waitMessage: "You have not made any transaction yet."
                      });
                  }
              });
            } else {
                console.log(res);
                alert("Error");
            }
        })
        .catch(err => {
            console.log(err);
            alert("Catch");
        })
    }

    renderTransactionHistory() {
        if(this.state.items.length == 0){
            return (
                <Message floating style={{margin: '200px auto',  display: "block", width: "auto", textalign:'center'}}>
                    {this.state.waitMessage}
                </Message>
            );
        } else {
            return <Card.Group fluid items={this.state.items}/>;
        }
      }

    render() {
        return(
            <Grid.Column width={10}>
                <Segment color="teal">
                    <Message color="teal">
                        <Message.Header>Transaction History within InstCrypt</Message.Header>
                    </Message> 
                    {this.renderTransactionHistory()}
                </Segment>
            </Grid.Column>
        );
    }

};

export default Transaction; 