(() => {
    'use strict';
    const express = require('express'),
          mongoose = require('mongoose'),
          calc = require('../src/js/csv');

    const router = express.Router();

    const File = require('../db/models/file.js');

    function newfile(filename, data) {
        let	f1 = new File({filename, data});

        let	p1 = f1.save((err) => {
            if (err) {
                console.log(`Hubieron errores:\n${err}`);
                return err;
            }
            console.log(`Salvado el fichero ${f1}`);
        });

        return p1;
    }

    router.get('/', (req, res) => {
        res.json(calc(req.query.input));
    });

    /*
    Ejemplo de post en la consola del navegador del cliente:

    $.post('/csv', {
	    filename: 'input.txt',
	    data: 'Esto es un texto'
    }, () => {} , 'json');

    */

    router.post('/', (req, res) => {
        mongoose.connect('mongodb://localhost/test');

        File.count({}, function(err, count) {
            console.log(`Numbero de ficheros: ${count}`);

            if (count > 4) {
                // TODO: Si ya hay más de 4 elementos, eliminar el más antiguo
                // Para conseguir el más antiguo hay que hacer db.files.findOne();
                // Como tienen un timestamp, sin parámetros devuelve el elemento más antiguos
                console.log('Sacar el más viejo');
            }
            console.log('Ahora, insertar');

            var prom = newfile(req.body.filename, req.body.data);

            Promise.all([prom]).then(() => {
                res.status(200).send('Inserted in database');
                mongoose.connection.close();
            });
        });
    });

    /*
    Ejemplo de get en la consola del navegador del cliente:
    Descargar un fichero:
    $.get('/csv/input.txt', {}, (data) => {
        console.log(data)
    });

    Descargarlos todos:
    $.get('/csv/*', {}, (data) => {
        console.log(data)
    });

    */

    router.get('/:fichero', (req, res) => {
        if (req.params.fichero === '*') {
            //TODO: Hacer un find y devolver todos los ficheros en un array
            console.log(`Hay que devolver un array con todos los ficheros`);
            res.json([1, 2, 3]);
        } else {
            //TODO: Hacer un find del nombre del fichero, y devolverlo
            console.log(`Hay que buscar en la base de datos: ${req.params.fichero}`);
            res.json({filename: 'input.txt', data: 'producto",           "precio"\n' +
                                                   '"camisa",             "' +
                                                   '4,3"\n"libro de O\\"Reilly", "7,2"\n'});
        }
    });

    module.exports = router;
})();
