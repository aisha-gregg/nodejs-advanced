'use strict';

const mongoose = require('mongoose');
const configAnuncios = require('../local_config').anuncios;
const fs = require('fs');
const flow = require('../lib/flowControl');

const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, index: true },
  foto: String,
  tags: { type: [String], index: true }
});

/**
 * lista de tags permitidos
 */
anuncioSchema.statics.allowedTags = function () {
  return ['work', 'lifestyle', 'motor', 'mobile'];
};

/**
 * carga un json de anuncios
 */
anuncioSchema.statics.cargaJson = function (fichero, cb) {
  // Encodings: https://nodejs.org/api/buffer.html
  fs.readFile(fichero, { encoding: 'utf8' }, function (err, data) {
    if (err) return cb(err);

    console.log(fichero + ' leido.');

    if (data) {

      const anuncios = JSON.parse(data).anuncios;
      const numAnuncios = anuncios.length;

      flow.serialArray(anuncios, Anuncio.createRecord, (err)=> {
        if (err) return cb(err);
        return cb(null, numAnuncios);
      });

    } else {
      return cb(new Error(fichero + ' está vacio!'));
    }
  });
};

anuncioSchema.statics.createRecord = function (nuevo, cb) {
  new Anuncio(nuevo).save(cb);
};

anuncioSchema.statics.list = function (startRow, numRows, sortField, includeTotal, filters, cb) {

  const query = Anuncio.find(filters);

  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);

  //query.select('nombre venta');

  return query.exec(function (err, rows) {
    if (err) return cb(err);

    // poner prefijo a imagenes
    rows.forEach((row) => {
      if (row.foto) {
        row.foto = configAnuncios.imagesURLBasePath + row.foto;
      }
    });

    const result = { rows: rows };

    if (!includeTotal) return cb(null, result);

    // incluir propiedad total
    Anuncio.count({}, (err, total) => {
      if (err) return cb(err);
      result.total = total;
      return cb(null, result);
    });
  });
};

var Anuncio = mongoose.model('Anuncio', anuncioSchema);
