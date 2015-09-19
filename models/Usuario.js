'use strict';

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

usuarioSchema.statics.createRecord = function(nuevo, cb) {

    var usuario = new Usuario();

    usuario.nombre = nuevo.nombre;
    usuario.email = nuevo.email;
    usuario.clave = nuevo.clave;

    usuario.save(function(err, usuarioCreado) {
        if (err) {
            return cb(err);
        }

        console.info('Usuario.createRecord', usuarioCreado.nombre, usuarioCreado._id);
        cb(null, usuarioCreado);
    });

};

var Usuario = mongoose.model('Usuario', usuarioSchema);
