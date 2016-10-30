'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const jwt = require('jsonwebtoken');
const config = require('../../local_config');
const hash = require('hash.js');

router.post('/authenticate', function (req, res, next) {

  const email = req.body.email;
  const clave = req.body.clave;

  // buscar el usuario
  Usuario.findOne({ email: email }, function (err, user) {
    if (err) return next(err);

    if (!user) {
      return res.json({
        ok: false, error: {
          code: 401,
          message: res.__('users_user_not_found')
        }
      });
    } else if (user) {

      // hashear la candidata y comparar los hashes
      const claveHash = hash.sha256().update(clave).digest('hex');

      // la contraseña es la misma?
      if (user.clave != claveHash) {
        return res.json({
          ok: false, error: {
            code: 401,
            message: res.__('users_wrong_password')
          }
        });
      } else {

        // hemos encontrado el usuario y la clave es la misma
        // le hacemos un token
        const token = jwt.sign({ user: user }, config.jwt.secret, config.jwt.options);

        // return the information including token as JSON
        return res.json({ ok: true, token: token });
      }
    }
  });

});

router.post('/register', function (req, res, next) {
  Usuario.createRecord(req.body, function (err) {
    if (err) return next(err);

    // usuario creado
    return res.json({ ok: true, message: res.__('users_user_created') });
  });
});

module.exports = router;
