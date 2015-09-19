'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

// Auth con JWT
var jwtAuth = require('../../lib/jwtAuth');
router.use(jwtAuth());

router.get('/', function(req, res) {

    console.log('jwt decoded', req.decoded);

    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve 1000 registros como máximo en cada llamada
    var sort = req.query.sort || '_id';
    var includeTotal = req.query.includeTotal === 'true';

    Anuncio.list(start, limit, sort, includeTotal, function(err, result) {
        if (err) {
            return res.status(500).json({ok: false, error: {code: 500, message: err.message}});
        }
        res.json({ok: true, result: result});
    });
});

module.exports = router;
