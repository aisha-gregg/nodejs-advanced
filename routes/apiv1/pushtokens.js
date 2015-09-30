'use strict';

let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let PushToken = mongoose.model('PushToken');

let errors = require('../../lib/errors');

router.post('/', function(req, res) {

    let nuevo = {
        token: req.body.pushtoken,
        usuario: req.body.idusuario || undefined,
        plataforma: req.body.plataforma
    };

    PushToken.createRecord(nuevo, (err, creado)=> {
        if (err) {
            return errors(err, req.lang).json(res);
        }

        // return confirmation
        return res.json({ok: true, created: creado});
    });

});

module.exports = router;
