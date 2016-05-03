(() => {
    'use strict';
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    let UserShema = mongoose.Schema({
        username: String,
        files : [{ type: Schema.Types.ObjectId, ref: 'File' }]
    });
    module.exports = mongoose.model("User", UserShema);
})();
