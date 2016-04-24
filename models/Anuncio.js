'use strict';

let mongoose = require('mongoose');
var configAnuncios = require('../local_config').anuncios;

let anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: { type: Boolean, index: true },
    precio: { type: Number, index: true },
    foto: String,
    tags: { type: [String], index: true }
});

/**
 * lista de tags permitidos
 */
anuncioSchema.statics.allowedTags = function() {
    return ['work', 'lifestyle', 'motor', 'mobile'];
};

/**
 * carga un json de anuncios
 */
anuncioSchema.statics.cargaJson = function(fichero, cb) {
    let fs = require('fs');
    let flow = require('../lib/flowControl');

    // Encodings: https://nodejs.org/api/buffer.html
    fs.readFile(fichero, {encoding:'utf8'}, function(err, data) {
        if (err) {
            return cb(err);
        }

        console.log(fichero + ' leido.');

        if (data) {

            let anuncios = JSON.parse(data).anuncios;
            let numAnuncios = anuncios.length;

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

anuncioSchema.statics.list = function(startRow, numRows, sortField, includeTotal, filters, cb) {

    let query = Anuncio.find(filters);

    query.sort(sortField);

    query.skip(startRow);

    query.limit(numRows);

    //query.select('nombre venta');

    return query.exec(function(err, rows) {
        if (err) { return cb(err);}

        // poner prefijo a imagenes
        rows.forEach((row)=> {
            if (row.foto) {
                row.foto = configAnuncios.imagesURLBasePath + row.foto;
            }
        });

        let result = {rows: rows};

        if (!includeTotal) {
            return cb(null, result);
        }

        // incluir propiedad total
        Anuncio.getCount({}, function(err, total) {
            if (err) {return cb(err);}

            result.total = total;
            return cb(null, result);
        });
    });
};

anuncioSchema.statics.getCount = function(filter, cb) {
    return Anuncio.count(filter, cb);
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
