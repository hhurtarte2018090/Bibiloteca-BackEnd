'use strict'

var Book = require('../models/book.model');
var User = require('../models/user.model');

function saveBook(req, res){
    var book = new Book();
    var params = req.body;
if( params.type &&
    params.author &&
    params.title &&
    params.edition &&
    params.copies &&
    params.availables){
        book.type = params.type;
        book.author = params.author;
        book.title = params.title;
        book.edition = params.edition;
        book.copies = params.copies;
        book.availables = params.availables;
        book.description = params.description;
        var codeWords = params.codeWords.split(", ");
        book.codeWords = codeWords;

        var topics = params.topics.split(", ");
        book.topics = topics;

        if(params.currentFrequency || params.prints){
            book.currentFrequency = params.currentFrequency;
            book.prints = params.prints;
            book.save((err, bookSaved)=>{
                if(err)
                    res.status(500).send({message: 'Error general al guardar la revista'});
                else if(bookSaved)
                    res.status(201).send({book: bookSaved});
                else
                    res.status(404).send({message: 'Revista no guardada'});
            });
        }else{
            book.save((err, bookSaved)=>{
                if(err)
                    res.status(500).send({message: 'Error general al guardar el libro'});
                else if(bookSaved)
                    res.status(201).send({book: bookSaved});
                else
                    res.status(404).send({message: 'Libro no guardado'});
            });
        }
        }else
            res.status(400).send({message: 'Debe llenar todos los campos'});
}

function findAll(req, res){
    Book.find((err, allBooks)=>{
        if(err)
            res.status(500).send({message: 'Error general al buscar'});
        else if(allBooks)
            res.status(200).send({books: allBooks});
        else
            res.status(404).send({message: 'No se pudo encontrar los libros o revistas'});
    });
}

function getBook(req, res){
    var bookId = req.params.id;

    Book.findById(bookId,(err, bookFound)=>{
        if(err)
            res.status(500).send({message: 'Error general al buscar'});
        else if(bookFound)
            res.status(200).send({Book: bookFound});
        else
            res.status(404).send({message: 'No se pudo encontrar los libros o revistas'});
    });
}

function updateBook(req, res){
    var bookId = req.params.id;
    var update = req.body;

    Book.findByIdAndUpdate(bookId, update, {new: true}, (err, bookUpdated)=>{
        if(err)
            res.status(500).send({message: 'Error general al actualizar'});
        else if(userUpdated)
            res.status(200).send({Book: bookUpdated});
        else
            res.status(404).send({message: 'No se pudo actualizar el libro'});
    });    
}

function deleteBook(req, res){
    var bookId = req.params.id;
    var update = req.body;
    Book.findByIdAndDelete(bookId,(err, bookDeleted)=>{
        if(err)
            res.status(500).send({message: 'Error general, intente mas tarde'});
        else if(bookDeleted)
            res.status(200).send({message: 'Libro eliminado con exito'});
        else
            res.status(418).send({message: 'Error iniesperado durante la eliminacion'});  
    });
}

function lendBook(req, res){
    var params = req.body;
    var numA = params.availables - 1;
    Book.findByIdAndUpdate(params._id,{$set:{availables: numA}},{new: true},(err, bookUpdated)=>{
        if(err)
            res.status(500).send({message: 'Error general al actualizar libro'});
        else if(bookUpdated){
            User.findByIdAndUpdate(req.user.sub,{$push:{books: params._id}},{new: true},(err, bookLened)=>{
                if(err)
                    res.status(500).send({message: 'Error general al prestar libro'});
                else if(bookLened){
                    res.send({message: 'Libro prestado',books: bookLened});
                }else 
                    res.send({message: 'No se pudo prestar el libro'});
            });
        }else 
            res.send({message: 'actuliza el libro'});
    });
}

function getBooksByUser(req, res){
    User.findById(req.user.sub,(err, userGot)=>{
        if(err)
            res.status(500).send({message: 'Error general, intente mas tarde'});
        else if(userGot){
            res.status(200).send({books: userGot.books});
        }else
            res.status(418).send({message: 'Error durante la busqueda'});  
    }).populate('books')
}


module.exports = {
    saveBook,
    findAll,
    getBook,
    updateBook,
    deleteBook,
    lendBook,
    getBooksByUser
}