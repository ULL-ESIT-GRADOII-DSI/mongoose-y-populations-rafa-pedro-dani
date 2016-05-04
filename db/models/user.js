(() => {
    'use strict';
    const mongoose = require('mongoose');
    const File = require('./file.js');
    

    const Schema = mongoose.Schema;
    let UserShema = mongoose.Schema({
        username: String,
        files: [{ type: Schema.Types.ObjectId, ref: 'File' }]
    });
    
    // Si se elimina un usuario, eliminar sus ficheros en cascada
    UserShema.pre('remove', function(next) {
        this.files.forEach((it) => {
            console.log(File);
            File.remove({_id: it}).exec();
        });
        next();
    });

    module.exports = mongoose.model("User", UserShema);
})();
