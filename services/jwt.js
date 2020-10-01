'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'EncriptionCorrect';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        books: [user.books],
        iat: moment().unix(),
        exp: moment().add(8, 'hours').unix()
    }
    return jwt.encode(payload, key);
}