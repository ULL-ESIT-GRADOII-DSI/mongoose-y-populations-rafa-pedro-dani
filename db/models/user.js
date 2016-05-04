(() => {
    'use strict';
    const mongoose = require('mongoose');
//    const File = require('./file.js');

    const Schema = mongoose.Schema;
    let UserShema = mongoose.Schema({
        username: String,
        files: [{ type: Schema.Types.ObjectId, ref: 'File' }]
    });
    /*
    cuando se vaya a guardar un fichero
        buscar al usuario
        contar sus ficheros
        si es mayor que 3
            eliminar el mas antiguo
        
        seguir con la ejcución de mongoose
    
    */
    
    // Si se elimina un usuario, eliminar sus ficheros en cascada
    UserShema.pre('remove', function(next) {
        this.files.forEach((it) => {
            File.remove({_id: it}).exec();
        });
        next();
    });

    module.exports = mongoose.model("User", UserShema);
})();
