(() => {
    'use strict';
    const express = require('express'),
          mongoose = require('mongoose'),
          calc = require('../assets/modules/csv');

    const router = express.Router();

    const File = require('../db/models/file.js');
    //const User = require('../db/models/user.js');
    // Nos conectamos en app.js
    /*mongoose.connect('mongodb://localhost/test', (err)=> {
        if(err) {
            console.log("No tienes mongod encendido");
            console.log(err);
            throw err;
        }
        console.log("Conectado a mongo");
    });*/

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
        console.log(data);
    });

    */
    //funcion para guardar usuario
    //TODO: quitar esto y moverlo a user.js
    /*function guardarUsuario(username, data, res) {
        let	u1 = new User({username, data});
        return u1.save((err) => {
            if (err) {
                console.log(`Hubo errores:\n${err}`);
                res.status(500).send('Mongo error saving user');
                return err;
            }
            console.log(`Salvado el usuario ${u1}`);
        });
    }
    //POST DE LA CREACION DEL USUARIO

     router.post('/', (req, res) => {
         User.findOne({username: req.body.username}, (err, users) => {
         console.log(`Estamos en el buscar el usuario para comprobar si existe`);
            if (err) {
                console.log(`Hubo un error en fichero singular`);
                res.status(500).send('Mongo error when finding that file');
                return err;
                if (users != null) {
                    res.status(400).send('There is alrady a user with that name');
                    return;
                }
            }else {
                    let prom = guardarUsuario(req.body.username,req.body.data, res);
                    Promise.all([prom]).then(()=>{
                        res.status(200).send('Inserted in database');
                    })
                } 
         });     
     });
*/     
     /* El population segun el ejemplo sería algo parecido a esto...
     
                     Story
                .findOne({ title: 'Once upon a timex.' })
                .populate('_creator')
                .exec(function (err, story) {
                  if (err) return handleError(err);
                  console.log('The creator is %s', story._creator.name);
                  // prints "The creator is Aaron"
                });*/



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
