'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');
var api = express.Router();

api.post('/login', userController.login);

api.post('/saveUser', mdAuth.ensureAuthAdmin, userController.saveUser);
api.get('/getUser/:id', mdAuth.ensureAuthAdmin,userController.getUser);
api.get('/listUsers', mdAuth.ensureAuthAdmin, userController.listUsers);
api.put('/updateUser/:id',mdAuth.ensureAuthAdmin, userController.updateUser);
api.delete('/deleteUser/:id', mdAuth.ensureAuthAdmin, userController.deleteUser);

module.exports = api;
