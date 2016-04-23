(() => {

    'use strict';
    const express = require('express'),
        calc = require('../src/js/csv');
    const router = express.Router();

    router.get('/', (req, res) => {
        res.json(calc(req.query.input));
    });

    router.get('/:fichero', (req, res) => {
        if (req.params.fichero === '*') {
            console.log(`Hay que devolver un array con todos los ficheros`);
            res.json([1, 2, 3]);
        } else {
            console.log(`Hay que buscar en la base de datos: ${req.params.fichero}`);
            res.json({filename: 'input.txt', data: "\"producto\",           \"precio\"\r\n\"camisa\",             \"" +
                "4,3\"\r\n\"libro de O\\\"Reilly\", \"7,2\"\r\n"});
        }
    });

    module.exports = router;
})();
