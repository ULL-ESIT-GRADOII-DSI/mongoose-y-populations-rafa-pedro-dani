(() => {
    'use strict';
    const mongoose = require('mongoose');
    
    var FileShema = mongoose.Schema({
        filename: String,
        data: String
    });

    module.exports = mongoose.model("File",	FileShema);
})();
