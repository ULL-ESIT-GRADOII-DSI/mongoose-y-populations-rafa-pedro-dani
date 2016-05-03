(() => {
    'use strict';
    const express = require('express'),
          mongoose = require('mongoose');

    const router = express.Router();

    const User = require('../db/models/user.js');
    /* No hace falta conectarnos, lo hacemos desde app.js
    mongoose.connect('mongodb://localhost/test', (err)=> {
        if(err) {
            console.log("No tienes mongod encendido");
            console.log(err);
            throw err;
        }
        console.log("Conectado a mongo");
    });*/
    
    //funcion para guardar usuario
    function guardarUsuario(username, data, res) {
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
     
     /* El population segun el ejemplo sería algo parecido a esto...
     
                     Story
                .findOne({ title: 'Once upon a timex.' })
                .populate('_creator')
                .exec(function (err, story) {
                  if (err) return handleError(err);
                  console.log('The creator is %s', story._creator.name);
                  // prints "The creator is Aaron"
                });*/



    module.exports = router;
})();
