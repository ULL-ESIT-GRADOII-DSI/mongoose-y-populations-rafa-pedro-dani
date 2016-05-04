(() => {
    'use strict';
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    let FileShema = mongoose.Schema({
        filename: String,
        data: String,
        owner: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    });
    module.exports = mongoose.model("File", FileShema);
})();
