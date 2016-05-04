(() => {
    'use strict';
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const User = require('./user.js');
    //console.log("Soy models/file.js")
    //console.log(Object.keys(User).length)
    let FileShema = mongoose.Schema({
        filename: String,
        data: String,
        owner: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    });
    
    const File = mongoose.model("File", FileShema);
    
    FileShema.pre('save', function(next) {
        console.log("El owener es: " + this.owner)
        File.find({filename: this.filename}, (err, ficheros) => {
            if(err){
                console.log('hubo errores File Find');
                return err;
            }
            if(ficheros.length != 0){
                console.log('ya hay un fichero con ese nombre');
                var err = new Error('Ya hay un fichero con ese nombre');
                next(err);
                return;
            } else {
                File.find({owner: this.owner}, (err, ficheros) => {
                    if(err){
                        console.log('hubo errores al buscar el propietario del fichero');
                        return err;
                    }
                    
                    console.log("hay " + ficheros.length + " ficheros en la base de datos");
                    if(ficheros.length > 3) {
                        File.remove({_id: ficheros[0]._id}).exec();
                        console.log("Voy a buscar la _id de " + this.owner);
                        User.findOne({_id: this.owner}, (err, usuario) => {
                            if(err){
                                console.log('hubo errores user findOne');
                                return err;
                            }
                            usuario.files.forEach((it, i) => {
                                if(it.toString() === ficheros[0]._id.toString()) {
                                    usuario.files.splice(i, 1);
                                }
                            });
                            usuario.save((err) => {
                                if(err) {
                                    console.log('hubo errores al guardar el usuario');
                                    return err; 
                                }
                                next();
                            });
                        })
                    } else {
                        next();
                    }
                });
            }
        })
    });
    
    console.log(Object.keys(File).length);
    
    module.exports = mongoose.model("File", FileShema);
})();
