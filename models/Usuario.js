'use strict';

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

usuarioSchema.statics.createRecord = function(nuevo, cb) {
    new Usuario(nuevo).save(cb);
};

var Usuario = mongoose.model('Usuario', usuarioSchema);
