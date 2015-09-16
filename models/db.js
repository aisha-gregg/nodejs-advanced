'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'mongodb connection error:'));

db.once('open', function() {
    console.info('Connected to mongodb.');
});

mongoose.connect('mongodb://localhost/nodepop');

// Cargamos las definiciones de todos nuestros modelos
require('./Anuncio');

module.exports = db;
