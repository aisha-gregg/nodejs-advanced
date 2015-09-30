'use strict';

let mongoose = require('mongoose');
let hash = require('hash.js');

let usuarioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    email: { type: String, index: true },
    clave: String
});

usuarioSchema.statics.exists = function(idusuario, cb) {
    Usuario.findById(idusuario, function(err, user) {
        if (err) {
            return cb(err);
        }

        // si no existe devuelvo error
        if (!user) {
            return cb(null, false);
        }

        return cb(null, true);
    });
};

usuarioSchema.statics.createRecord = function(nuevo, cb) {
    // validaciones
    let valErrors = [];
    let v = require('validator');
    if (!(v.isAlpha(nuevo.nombre) && v.isLength(nuevo.nombre, 2))) {
        valErrors.push({field: 'nombre', message:'validation_invalid'});
    }

    if (!v.isEmail(nuevo.email)) {
        valErrors.push({field: 'email', message:'validation_invalid'});
    }

    if (!v.isLength(nuevo.clave, 6)) {
        valErrors.push({field: 'clave', message:{template:'validation_minchars', values: {num:'6'}}});
    }

    if (valErrors.length > 0) {
        return cb({ code: 422, errors: valErrors });
    }

    // comprobar duplicados
    // buscar el usuario
    Usuario.findOne({email: nuevo.email}, function(err, user) {
        if (err) {
            return cb(err);
        }

        // el usuario ya existía
        if (user) {
            return cb({code: 409, message: 'user_email_duplicated'});
        } else {

            // Hago hash de la password
            let hashedClave = hash.sha256().update(nuevo.clave).digest('hex');

            nuevo.clave = hashedClave;

            // creo el usuario
            new Usuario(nuevo).save(cb);
        }
    });
};

var Usuario = mongoose.model('Usuario', usuarioSchema);
