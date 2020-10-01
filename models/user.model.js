'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    identifier: String,
    name: String,
    lastname: String,
    username: String,
    email: String,
    role: String,
    password: String,
    books:[{ type: Schema.Types.ObjectId, ref: 'book'}]
});

module.exports = mongoose.model('user', userSchema);