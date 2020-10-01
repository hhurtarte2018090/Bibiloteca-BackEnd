'use strict'

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');
var User = require('./models/user.model');
var bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Biblioteca_en_Nodejs', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>{
    console.log('Conexion exitosa a la base de datos');
    app.listen(port, ()=>{
        console.log('Servidor de express por el puerto: ', port);
    });
}).catch(err=>{
    console.log('Error al conectarse a la base de datos', err);
});

User.findOne({$or:[{name: 'admin'},{username: 'admin'}]},(err, adminFound)=>{
    if(err)
        console.log('Error general');
    else if(!adminFound){
        var user = new User();
        user.idetifier = 'admin';
        user.name = 'admin';
        user.username = 'admin';
        user.role = 'admin';

        bcrypt.hash('admin', null, null,(err, passwordHash)=>{
            if(err)
                console.log('Error al encriptar contraseña');
            else if(passwordHash){
                user.password = passwordHash;

            user.save((err, adminSaved)=>{
                if(err)
                    console.log('Error al crear usuario admin');
                else if(adminSaved)
                    console.log('Usuario Administrador creado');
                else    
                    console.log('Error durante la creación');
            });
            }else  
                console.log('Error inesperado');
        });
    }else   
        console.log('Ya existe un usuario Administrador');
});