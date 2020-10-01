'use strict'

var express = require('express');
var bookController = require('../controllers/book.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/saveBook', mdAuth.ensureAuthAdmin, bookController.saveBook);
api.put('/updateBook/:id', mdAuth.ensureAuthAdmin, bookController.updateBook);
api.delete('/deleteBook/:id', mdAuth.ensureAuthAdmin, bookController.deleteBook);

api.get('/getBooksByUser', mdAuth.ensureAuth, bookController.getBooksByUser);
api.get('/findAll', mdAuth.ensureAuth, bookController.findAll);
api.put('/lendBook', mdAuth.ensureAuth, bookController.lendBook);
api.post('/getBook', bookController.getBook);


module.exports = api;