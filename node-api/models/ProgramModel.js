const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create test Schema and model 

const ProgramSchema = new Schema({
    programName:{
        type: String,
        required: [true, 'Program Name field is required']
    },
    programPurpose:{
        type: String,
        required: [true, 'Program Purpose field is required']
    },
    programCategory:{
        type: String,
        required: [true, 'Program Category field is required']
    },
    finetsType:{
        type: Number,
        required: [true, 'Program Category field is required']
    },
    numberOfParticipants:{
        type: Number,
        required: [true, 'Number of Participants field is required']
    },
    installmentEachRound: {
        type: Number,
        required: [true, 'Installment Each Round field is required']
    },
    programOwner: {
        type: String,
        required: [true, 'Program Owner field is required']
    },
    startDate:{
        type: String,
        required: [true, 'Start Date field is required']
    },
    dateOfCreation: {
        type: String,
        required: [true, 'Date of Creation field is required']
    },
    program: {
        type:String,
        required: [true, 'Program field is required']
    },
    ProgramStatus: {
        type: Number,
        required: [true, 'Program Status field is required']
    },
    sector: {
        type: Number,
        required: [true, 'Sector field is required']
    },
    STQScore: {
        type: Number,
        required: [true, 'STQ score field is required']
    }
});


const ProgramSchema2 = new Schema({
    programName:{
        type: String,
        required: [true, 'Program Name field is required']
    },
});

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

// {
// 	"programName": "Test_1",
// 	"programPurpose": "Test Purpose",
// 	"programCategory": "Travel",
// 	"finetsType": "1",
// 	"numberOfParticipants": "5",
// 	"installmentEachRound": "100",
// 	"programOwner": "0x00000000",
// 	"stratDate": "15511111",
// 	"dateOfCreation": "1522222",
// 	"program": "progs1",
// 	"ProgramStatus": "1",
// 	"sector": "2",
// 	"STQScore": "123"
// }