'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = Schema({
    type: String,
    author: String,
    title: String,
    edition: String,
    codeWords:[],
    description: String,
    topics: [],
    currentFrequency: String,
    prints:Number,
    copies: Number,
    availables: Number
});

module.exports = mongoose.model('book', bookSchema);