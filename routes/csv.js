var express = require('express');
var router = express.Router();
var calc = require('../src/csv');

router.post('/', function(req, res) {
    res.render('csv', {
        title: 'CSV Validator',
        csv: calc.calculate(req.body.csvData)
    });
});

module.exports = router;
