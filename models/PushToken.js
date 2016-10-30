'use strict';

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const pushTokenSchema = mongoose.Schema({
  plataforma: { type: String, enum: ['ios', 'android'], index: true },
  token: { type: String, index: true },
  usuario: { type: String, index: true },
  createdAt: Date // importante para saber cual es el último de un usuario!
});

pushTokenSchema.statics.createRecord = function (nuevo, cb) {

  // validaciones
  const valErrors = [];
  if (!nuevo.token) {
    valErrors.push({ field: 'token', message: __('validation_invalid') });
  }

  if (nuevo.plataforma) {
    nuevo.plataforma = nuevo.plataforma.toLowerCase();
    if (!(nuevo.plataforma === 'ios' || nuevo.plataforma === 'android')) {
      valErrors.push({ field: 'plataforma', message: __('validation_invalid') });
    }
  } else {
    valErrors.push({ field: 'plataforma', message: __('validation_invalid') });
  }

  if (valErrors.length > 0) return cb({ code: 422, errors: valErrors });

  // si no tengo usuario lo creo directamente sin usuario
  if (!nuevo.usuario) return crear();

  Usuario.exists(nuevo.usuario, function (err, existe) {
    if (err) return cb(err);

    // si no existe devuelvo error
    if (!existe) return cb({ code: 404, message: __('users_user_not_found') });

    return crear();
  });

  function crear() {
    nuevo.createdAt = new Date();
    new PushToken(nuevo).save(cb);
  }
};

var PushToken = mongoose.model('PushToken', pushTokenSchema);
