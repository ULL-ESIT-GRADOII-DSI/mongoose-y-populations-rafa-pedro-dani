(() => {
    'use strict';
    const express = require('express'),
          mongoose = require('mongoose'),
          calc = require('../assets/modules/csv');

    const router = express.Router();

    const File = require('../db/models/file.js');
    mongoose.connect('mongodb://localhost/test', (err)=> {
        if(err) {
            console.log("No tienes mongod encendido");
            console.log(err);
            throw err;
        }
        console.log("Conectado a mongo");
    });

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

    function guardarFichero(filename, data, res) {
        let	f1 = new File({filename, data});
        return f1.save((err) => {
            if (err) {
                console.log(`Hubo errores:\n${err}`);
                res.status(500).send('Mongo error saving file');
                return err;
            }
            console.log(`Salvado el fichero ${f1}`);
        });
    }

    router.post('/', (req, res) => {
        File.findOne({filename: req.body.filename}, (err, files) => {
            console.log(`Estamos en el buscar un fichero solo`);
            if (err) {
                console.log(`Hubo un error en fichero singular`);
                res.status(500).send('Mongo error when finding that file');
                return err;
            }
            if (files != null) {
                res.status(400).send('There is alrady a file with that name');
                return;
            }

            File.count({}, (err, count) => {
                if (err) {
                    console.log(`Hubo errores:\n${err}`);
                    res.status(500).send('Mongo error counting document');
                    return err;
                }
                console.log(`Numero de ficheros: ${count}`);

                if (count > 3) {
                    File.findOne({}, (err, elimina) => {
                        if (err) {
                            console.log(`Hubo errores:\n${err}`);
                            res.status(500).send('Mongo error finding document');
                            return err;
                        }

                        console.log(`Se va a eliminar este elemento: ${elimina}`);  //mostraria el elemento mas viejo.
                        elimina.remove({}, (err, removed) => {
                            if (err) {
                                console.log(`Hubo errores:\n${err}`);
                                res.status(500).send('Mongo error removing document');
                                return err;
                            }
                            console.log(`Se acaba de eliminar ${removed}`);
                            let prom = guardarFichero(req.body.filename,req.body.data, res);
                            Promise.all([prom]).then(()=>{
                                console.log("Acabo de terminar de meter en la base de datos el fichero, le envio ok al cliente");
                                res.status(200).send('Inserted in database');
                            })
                        });
                    });
                } else {
                    let prom = guardarFichero(req.body.filename,req.body.data, res);
                    Promise.all([prom]).then(()=>{
                        res.status(200).send('Inserted in database');
                    })
                }
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
        let prom = null;

        if (req.params.fichero === '*') {
            prom = File.find({}, (err, files) => {
                console.log(`Estamos en el asterisco`);
                if (err) {
                    console.log(`Hubo un error en *`);
                    res.status(500).send('Mongo error finding document');
                    return err;
                }
                console.log(`Hay que devolver un array con todos los ficheros`);
                let ficheros = [];
                files.forEach((file, i) => {
                    ficheros.push({filename: file.filename, data: file.data});
                });
                res.json(ficheros);
            });
        } else {
            prom = File.findOne({filename: req.params.fichero}, (err, files) => {
                console.log(`Estamos en el buscar un fichero solo`);
                if (err) {
                    console.log(`Hubo un error en fichero singular`);
                    res.status(500).send('Mongo error finding document');
                    return err;
                }
                console.log(`Tuve que buscar el fichero exacto y me da: ${files}`);
                res.json({filename: files.filename, data: files.data});
            });
            console.log(`Hay que buscar en la base de datos: ${req.params.fichero}`);
        }
    });

    module.exports = router;
})();
