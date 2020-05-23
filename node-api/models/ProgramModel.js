const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    transactionHash:{
        type: String,
        required: [true, 'transactionHash field is required']
    },
    token0:{
        type: String,
        required: [true, 'token0 field is required']
    },
    token1:{
        type: String,
        required: [true, 'token1 field is required']
    },
    pairAddress:{
        type: String,
        required: [true, 'pairAddress field is required']
    },
    amountIN:{
        type: String,
        required: [true, 'amountIN field is required']
    },
    amountOut:{
        type: String,
        required: [true, 'amountOut field is required']
    },
});

const Program = mongoose.model("TransactionsDatabase",TransactionSchema);
module.exports = Program;
