'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var jwt = require('jsonwebtoken');
var config = require('../../local_config');

router.post('/authenticate', function(req, res) {

    let email = req.body.email;
    let clave = req.body.clave;

    // buscar el usuario
    Usuario.findOne({email: email}, function(err, user) {
        if (err) {
            return res.status(500).json({ok: false, error: {code: 500, message: err.message} });
        }

        if (!user) {
            return res.json({ ok: false, error: {code: 401, message: 'Authentication failed. User not found.' }});
        } else if (user) {

            // hashear la candidata y comparar los hashes
            clave = hash.sha256().update(clave).digest('hex');

            // la contraseña es la misma?
            if (user.clave != clave) {
                return errors({code: 401, message: 'users_wrong_password' }, req.lang).json(res);
            } else {

                // hemos encontrado el usuario y la clave es la misma
                // le hacemos un token
                var token = jwt.sign({user: user}, config.jwt.secret, {
                    expiresInMinutes: config.jwt.expiresInMinutes
                });

                // return the information including token as JSON
                return res.json({
                    ok: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }
        }
    });

});

module.exports = router;