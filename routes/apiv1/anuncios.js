'use strict';

let express = require('express');
let router = express.Router();

let mongoose = require('mongoose');
let Anuncio = mongoose.model('Anuncio');

// Auth con JWT
let jwtAuth = require('../../lib/jwtAuth');
router.use(jwtAuth());

router.get('/', function(req, res) {

    //console.log('jwt decoded', req.decoded);

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve 1000 registros como máximo en cada llamada
    let sort = req.query.sort || '_id';
    let includeTotal = req.query.includeTotal === 'true';
    let filters = {};
    if (typeof req.query.tag !== 'undefined') {
        filters.tags = req.query.tag;
    }

    if (typeof req.query.venta !== 'undefined') {
        filters.venta = req.query.venta;
    }

    if (typeof req.query.precio !== 'undefined' && req.query.precio !== '-') {
        if (req.query.precio.indexOf('-') !== -1) {
            filters.precio = {};
            let rango = req.query.precio.split('-');
            if (rango[0] !== '') {
                filters.precio.$gte = rango[0];
            }

            if (rango[1] !== '') {
                filters.precio.$lte = rango[1];
            }
        } else {
            filters.precio = req.query.precio;
        }
    }

    if (typeof req.query.nombre !== 'undefined') {
        filters.nombre = new RegExp('^' + req.query.nombre, 'i');
    }

    Anuncio.list(start, limit, sort, includeTotal, filters, function(err, result) {
        if (err) {
            return res.status(500).json({ok: false, error: {code: 500, message: err.message}});
        }

        res.json({ok: true, result: result});
    });
});

// Return the list of available tags
router.get('/tags', function(req, res) {
    res.json({ok: true, allowedTags: Anuncio.allowedTags()});
});

module.exports = router;
