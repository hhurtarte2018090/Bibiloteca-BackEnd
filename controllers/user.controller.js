'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if( params.identifier&&
        params.name &&
        params.lastname &&
        params.username &&
        params.email &&
        params.role &&
        params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email},{identifier: params.identifier}]}, (err, userFound)=>{
                if(err)
                    res.status(500).send({message: 'Error general, intente mas tarde'});
                else if(userFound){
                    if(userFound.username == params.username)
                        res.status(400).send({message: 'Username "'+userFound.username+'" en uso'});
                    else if(userFound.identifier == params.identifier)
                        res.status(400).send({message: 'Identificador "'+userFound.identifier+'" en uso'});
                    else if(userFound.email == params.email)
                        res.status(400).send({message: 'Email "'+userFound.email+'" en uso'});
                }else{
                    user.identifier = params.identifier;
                    user.name = params.name;
                    user.lastname = params.lastname;
                    user.username = params.username;
                    user.email = params.email;
                    user.role = params.role;
                    
                    bcrypt.hash(params.password, null, null,(err, passwordHash)=>{
                        if(err)
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err)
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                else if(userSaved)
                                    res.status(201).send({user: userSaved});
                                else
                                    res.status(404).send({message: 'Usuario no guardado'});
                            });
                        }else
                            res.status(418).send({message: 'Error inesperado'});
                    });
                }
            });
        }else
            res.status(400).send({message: 'Debe llenar todos los campos'});
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username}, {email: params.email}]}, (err, check)=>{
                if(err)
                    res.status(500).send({message: 'Error general al buscar usuario'});
                else if(check){
                    bcrypt.compare(params.password, check.password, (err, ok)=>{
                        if(err)
                            res.status(500).send({message: 'Error al comparar'});
                        else if(ok){
                            if(params.gettoken == 'true')
                                res.send({token: jwt.createToken(check), user: check});
                            else
                                res.status(418).send({message: 'Error en el servidor al generar autenticación'});
                        }else
                            res.status(400).send({message: 'Contraseña incorrecta'});
                    });
                }else
                    res.status(404).send({message: 'El usuario no existe, ponerse en contacto con el administrador para solicitar su registro'});
            });
        }else
           res.status(400).send({message: 'Ingresa tu contraseña'}); 
    }else
        res.status(400).send({message: 'Ingresa tu correo o tu nombre de usuario'});
}

function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId,(err, userGot)=>{
        if(err)
            res.status(500).send({message: 'Error general, intente mas tarde'});
        else if(userGot){
            res.status(200).send({user: userGot});
            res.status(200).send({books: userGot});
        }else
            res.status(418).send({message: 'Error durante la busqueda'});  
    })
}

function listUsers(req, res){
 
    User.find((err, userList)=>{
        if(err)
            res.status(500).send({message: 'Error general, intente mas tarde'});
        else if(userList)
            res.status(200).send({users: userList});
        else
            res.status(418).send({message: 'Error durante la busqueda'});  
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
        if(err)
            res.status(500).send({message: 'Error general al actualizar'});
        else if(userUpdated)
            res.status(200).send({message: 'Usuario actulizado'});
        else
            res.status(404).send({message: 'No se pudo actualizar el usuario'});
    });
}

function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndDelete(userId,(err, userDeleted)=>{
        if(err)
            res.status(500).send({message: 'Error general, intente mas tarde'});
        else if(userDeleted)
            res.status(200).send({message: 'Usuario eliminado con exito'});
        else
            res.status(418).send({message: 'Error iniesperado durante la eliminacion'});  
    });
}

module.exports = {
    saveUser,
    login,
    getUser,
    listUsers,
    updateUser,
    deleteUser
}