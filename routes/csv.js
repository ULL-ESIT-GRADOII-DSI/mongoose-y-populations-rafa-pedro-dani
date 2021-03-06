(() => {
    'use strict';
    const express = require('express'),
          calc = require('../assets/modules/csv');

    const router = express.Router();

    //const File = require('../db/models/file.js');
    //const User = require('../db/models/user.js');

    const Models = require('../db/models/models.js');
    const File = Models.File;
    const User = Models.User;

    router.get('/', (req, res) => {
        if (req.query.input === null) {
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
    }, (res) => {console.log(res)} , 'text').fail((err) => {console.log(err)});

    */

    router.post('/', (req, res) => {
        // req.body.filename  Nombre del fichero
        // req.body.data      Datos del fichero
        // req.body.username  Usuario al que asignarle

        if (req.body.filename === null) {
            res.status(400).send('Filename required');
            return;
        }
        if (req.body.data === null) {
            res.status(400).send('Data required');
            return;
        }
        if (req.body.username === null) {
            res.status(400).send('Username required');
            return;
        }

        User.findOne({username: req.body.username}, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send('Mongo error finding user');
                return err;
            }
            if (user === null) {
                console.log('Ese usuario no existe');
                res.status(400).send('Ese usuario no existe');
                return;
            }

            console.log(`El user id, en el post es ${user._id}`);

            let f1 = new File({filename: req.body.filename, data: req.body.data, owner: user._id});
            f1.save((err) => {
                if (err) {
                    if (err.toString() === 'Error: Ya hay un fichero con ese nombre') {
                        res.status(400).send('Ese fichero ya existe');
                    } else {
                        res.status(500).send('Mongo error saving file');
                    }
                    return err;
                }
                user.files.push(f1._id);
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Mongo error saving file');
                        return err;
                    }
                    res.status(200).send('Inserted in database');
                });
            });
        });
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
        if (req.query.username === null) {
            res.status(400).send('Username required');
            return;
        }

        let files = [];
        if (req.params.fichero === '*') {
            User.
                findOne({username: req.query.username}).
                populate('files').
                exec((err, doc) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Mongo error in query');
                        return err;
                    }
                    doc.files.forEach((it) => {
                        files.push({filename: it.filename, data: it.data});
                    });
                    res.send(files);
                });
        } else {
            User.findOne({username: req.query.username}, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Mongo error in query');
                    return err;
                }
                if (user === null) {
                    res.status(400).send('Ese usuario no existe');
                    return;
                }
                File.findOne({owner: user._id, filename: req.params.fichero}, (err, fichero) => {
                    if (err) {
                        console.log({err});
                        res.status(500).send('Mongo error in query');
                        return err;
                    }
                    if (fichero === null) {
                        res.status(400).send('Ese fichero no existe');
                        return;
                    }
                    console.log(fichero);
                    res.send(fichero);
                });
            });
        }
    });

    module.exports = router;
})();
