var express = require('express');
var router = express.Router();
var calc = require('../src/csv');

console.log(calc);

router.get('/', (req, res) => {
    res.json(calc(req.query.input));
});

module.exports = router;
