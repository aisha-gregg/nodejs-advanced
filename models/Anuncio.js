'use strict';

var mongoose = require('mongoose');

//var tagSchema = mongoose.Schema({
//    nombre: String
//});

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: []
});

/**
 * carga un json de anuncios
 */
anuncioSchema.statics.cargaJson = function(fichero, cb) {
    var fs = require('fs');
    var flow = require('../lib/flowControl');

    // Encodings: https://nodejs.org/api/buffer.html
    fs.readFile(fichero, {encoding:'utf8'}, function(err, data) {
        if (err) {
            return cb(err);
        }

        console.log(fichero + ' leido.');

        if (data) {

            var anuncios = JSON.parse(data).anuncios;
            var numAnuncios = anuncios.length;

            flow.serialArray(anuncios, Anuncio.createRecord, (err)=> {
                if (err) {
                    return cb(err);
                }

                return cb(null, numAnuncios);
            });

        } else {
            return cb(new Error(fichero + ' está vacio!'));
        }
    });
};

anuncioSchema.statics.createRecord = function(nuevo, cb) {
    new Anuncio(nuevo).save(cb);
};

anuncioSchema.statics.list = function(startRow, numRows, sortField, includeTotal, cb) {

    var query = Anuncio.find({});

    query.sort(sortField);

    query.skip(startRow);

    query.limit(numRows);

    //query.select('nombre venta');

    return query.exec(function(err, rows) {
        if (err) { return cb(err);}

        var result = {rows: rows};

        if (!includeTotal) {
            return cb(null, result);
        }

        // incluir propiedad total
        Anuncio.getCount({}, function(err, total){
            if (err) { return cb(err);}
            result.total = total;
            return cb(null, result);
        });
    });
};

anuncioSchema.statics.getCount = function(filter, cb) {
    return Anuncio.count(filter, cb);
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
