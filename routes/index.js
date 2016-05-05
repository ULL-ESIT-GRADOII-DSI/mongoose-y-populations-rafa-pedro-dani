(() => {
    'use strict';
    const express = require('express');
    const router = express.Router();
    // Página principal
    router.get('/', (req, res) => {
        res.render('index', {
            title: 'CSV Validator'
        });
    });
    module.exports = router;
})();
