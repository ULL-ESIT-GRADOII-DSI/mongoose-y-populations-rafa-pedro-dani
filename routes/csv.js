var express = require('express');
var router = express.Router();
var calc = require('../src/csv');

router.get('/', function(req, res) {
    res.json(calc.calculate(req.query.input));
});

module.exports = router;
