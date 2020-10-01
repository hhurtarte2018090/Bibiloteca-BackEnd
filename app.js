'use strict'

var express = require('express');
var bodyParse = require('body-parser');
var app = express();
var userRoute = require('./routes/user.route');
var bookRoute = require('./routes/book.route');

app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use("/user", userRoute);
app.use("/book", bookRoute);

module.exports = app;