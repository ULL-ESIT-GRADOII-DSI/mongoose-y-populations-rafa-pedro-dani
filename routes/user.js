(() => {
    'use strict';
    const express = require('express');
    const router = express.Router();

    const User = require('../db/models/models.js').User;

    // Funcion para guardar usuario
    function guardarUsuario(username, res) {
        let	u1 = new User({username, files: []});
        return u1.save((err) => {
            if (err) {
                console.log(`Hubo errores:\n${err}`);
                res.status(500).send('Mongo error saving user');
                return err;
            }
            console.log(`Salvado el usuario ${u1}`);
        });
    }

    /* Ejemplo de get en la consola del navegador del cliente:
    Descargar un fichero:

    Descargarlos todos:
    $.get('/user/*', {}, (data) => {
        console.log("Todos los usuarios:")
        console.log(data)
    });

    Sacar los ficheros de un usuario:
    $.get('/user/pepe', {}, (data) => {
        console.log("Ficheros de pepe:")
        console.log(data)
    });

    */

    router.get('/:user', (req, res) => {
        if (req.params.user === '*') {
            let usersArr = [];
            User.find({}, (err, users) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Mongo error when finding all users');
                    return err;
                }
                //console.log(users);
                users.forEach((user) => {
                    usersArr.push(user.username);
                });
                res.send(usersArr);
                return;
            });
        } else {
            User.findOne({username: req.params.user}, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Mongo error when finding that file');
                    return err;
                }
                if (user !== null) {
                    console.log('Este usuario ya existe en la base de datos');
                    let files = [];
                    User.
                        findOne({username: req.params.user}).
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
                    return;
                } else {
                    let prom = guardarUsuario(req.params.user, res);
                    Promise.all([prom]).then(()=> {
                        // Un nuevo usuario siempre tiene su array de ficheros vacio,
                        // no hace falta buscar el usuario y mandar sus files, porque
                        // de antemano sabemos que va a ser []
                        res.status(200).send([]);
                    });
                }
            });
        }
    });

    // Sólo para hacer pruebas, en una aplicación real no tendríamos esto.
    router.delete('/:user', (req, res) => {
        console.log(req.params.user);
        User.findOne({username: req.params.user}, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send('Mongo error deleting');
                return err;
            }
            user.remove((err) => {
                console.log(err);
                res.status(200).send('Deleted from database');
            });
        });
    });

    module.exports = router;
})();
