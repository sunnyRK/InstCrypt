const express = require('express');
const router = express.Router();
const CreateProgram = require('../models/ProgramModel');

router.post('/createProgram', function(req, res, next) {
    CreateProgram.create(req.body).then(function(program) {
        res.send(program)
    }).catch(next);
});

router.get('/getAllProgram', async (req, res) => {
    try {
        var result = await CreateProgram.find().exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;