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
    new Anuncio().save(cb);
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
