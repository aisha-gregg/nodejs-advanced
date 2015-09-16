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

    // Encodings: https://nodejs.org/api/buffer.html
    fs.readFile(fichero, {encoding:'utf8'}, function(err, data) {
        if (err) {
            return cb(err);
        }

        console.log(fichero + ' leido.');

        if (data) {

            var anuncios = JSON.parse(data).anuncios;
            var numAnuncios = anuncios.length;

            // función ayudante,
            // que va a hacer llamadas a func,
            // con cada elemento del array que recibe (arr)
            // cuando acabe llamará a callbackFin
            var serie = function(arr, func, callbackFin) {
                if (arr.length > 0) {
                    // saco el primer elemento del array y
                    // llamo a escribeTras2Segundos con el elemento
                    func(arr.shift(), function(err) {
                        if (err) {
                            return callbackFin(err);
                        }

                        // cuando termine func, vuelvo a
                        // llamarme a mismo (serie) para procesar el siguiente
                        serie(arr, func, callbackFin);
                    });
                } else {
                    // si arr.length llega a 0 es que he acabado,
                    // llamo a la función que pasaron
                    // para ello, callbackFin
                    callbackFin();
                }
            };

            serie(anuncios, Anuncio.createRecord, (err)=> {
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

    var anuncio = new Anuncio();

    anuncio.nombre = nuevo.nombre;
    anuncio.venta = nuevo.venta;
    anuncio.precio = nuevo.precio;
    anuncio.foto = nuevo.foto;
    anuncio.tags = nuevo.tags;

    anuncio.save(function(err, anuncioCreado) {
        if (err) {
            return cb(err);
        }

        console.info('Anuncio.createRecord', anuncioCreado.nombre, anuncioCreado._id);
        cb(null, anuncioCreado);
    });

};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
