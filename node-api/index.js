const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost/programs',{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

app.use('/api',routes)

app.use(function(err, req, res, next){
    console.log(err);
    res.status(422).send({error:err.message});
});
app.listen(process.env.ports || 4000, function(){
    console.log("Listing on port 4000..");
});