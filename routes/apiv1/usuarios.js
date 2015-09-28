'use strict';

let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let Usuario = mongoose.model('Usuario');

let jwt = require('jsonwebtoken');
let config = require('../../local_config');
let errors = require('../../lib/errors');
let lang = require('../../lib/lang');
let hash = require('hash.js');

router.post('/authenticate', function(req, res) {

    let email = req.body.email;
    let clave = req.body.clave;

    // buscar el usuario
    Usuario.findOne({email: email}, function(err, user) {
        if (err) {
            return errors(err, req.lang).json(res);
        }

        if (!user) {
            return errors({code: 401, message: 'users_user_not_found' }, req.lang).json(res);

            //return res.json({ ok: false, error: {code: 401, message: 'users_user_not_fount' }});
        } else if (user) {

            // hashear la candidata y comparar los hashes
            clave = hash.sha256().update(clave).digest('hex');

            // la contraseña es la misma?
            if (user.clave != clave) {
                return errors({code: 401, message: 'users_wrong_password' }, req.lang).json(res);
            } else {

                // hemos encontrado el usuario y la clave es la misma
                // le hacemos un token
                let token = jwt.sign({user: user}, config.jwt.secret, {
                    expiresInMinutes: config.jwt.expiresInMinutes
                });

                // return the information including token as JSON
                return res.json({
                    ok: true,
                    token: token
                });

            }
        }
    });

});

router.post('/register', function(req, res) {

    let nuevo = {
        nombre: req.body.nombre,
        email: req.body.email,
        clave: req.body.clave
    };

    Usuario.createRecord(nuevo, function(err) {
        if (err) {
            return errors(err, req.lang).json(res);
        }

        // usuario creado
        return res.json({
            ok: true,
            message: lang.translate('users_user_created')
        });

    });

});

module.exports = router;
