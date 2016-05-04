(() => {
    'use strict';
    const express = require('express'),
          mongoose = require('mongoose'),
          calc = require('../assets/modules/csv');

    const router = express.Router();

    const File = require('../db/models/file.js');
    const User = require('../db/models/user.js');

    router.get('/', (req, res) => {
        if(req.query.input == null){
            res.status(500).send('Filename required');
            return;
        }
        res.json(calc(req.query.input));
    });

    /*
    Ejemplo de post en la consola del navegador del cliente:

    $.post('/csv', {
	    filename: 'input.txt',
	    data: 'Esto es un texto',
        username: 'pepe'
    }, () => {} , 'text');

    */

    router.post('/', (req, res) => {
        // req.body.filename  Nombre del fichero
        // req.body.data      Datos del fichero
        // req.body.username  Usuario al que asignarle

        // TODO: revisar que username no tenga más de 4 ficheros
        // TODO: revisar que req.body.filename no coincida con los ficheros de username
        if(req.body.filename == null){
            res.status(500).send('Filename required');
            return;
        }
        if(req.body.data == null){
            res.status(500).send('Data required');
            return;
        }
        if(req.body.username == null){
            res.status(500).send('Username required');
            return;
        }

        let f1 = new File({filename: req.body.filename, data: req.body.data});
        f1.save((err) => {
            if (err) {
                console.log(`Hubo errores:\n${err}`);
                res.status(500).send('Mongo error saving file');
                return err;
            }
            User.findOne({username: req.body.username}, (err, user) => {
                if (err) {
                    console.log(`Hubo errores:\n${err}`);
                    res.status(500).send('Mongo error finding user');
                    return err;
                }
                console.log('tengo al usuario');
                console.log(user);
                
                console.log(f1);
                user.files.push(f1._id);
                user.save((err) => {
                    if (err) {
                        console.log(`Hubo errores:\n${err}`);
                        res.status(500).send('Mongo error saving file');
                        return err;
                    }
                    res.status(200).send('Inserted in database');
                });
            });
            console.log(`Salvado el fichero ${f1}`);
        });
        
        
        
        
        
        /*File.count({}, (err, count) => {
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
            });*/
    });

    /* Ejemplo de get en la consola del navegador del cliente:
    Descargar un fichero:

    $.get('/csv/input.txt', {username: 'pepe'}, (data) => {
        console.log(data)
    });

    Descargarlos todos:
    $.get('/csv/*', {username: 'pepe'}, (data) => {
        console.log(data);
    });*/

    router.get('/:fichero', (req, res) => {
        console.log(req.query)
        console.log(req.query.username)
        if(req.query.username==null){
            res.status(500).send('Username required');
            return;
        }
        
        let files = [];
        if (req.params.fichero === '*') {
            User.
                findOne({username: req.query.username}).
                populate('files').
                exec((err, doc) => {
                    if (err) {
                        console.log(`Hubo errores:\n${err}`);
                        res.status(500).send('Mongo error in query');
                        return err;
                    }
                    doc.files.forEach((it) => {
                        files.push({filename: it.filename, data: it.data});
                    });
                    res.send(files);
                });
        } else {
            //TODO: enviar un unico fichero cuando el cliente lo pida
            res.status(500).send('TODO');
        }
    });

    module.exports = router;
})();
