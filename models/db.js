'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', function(err) {
    console.error('mongodb connection error:', err);
    process.exit(1);
});

db.once('open', function() {
    console.info('Connected to mongodb.');
});

mongoose.connect('mongodb://localhost/nodepop');

// Cargamos las definiciones de todos nuestros modelos
require('./Anuncio');
require('./Usuario');
require('./PushToken');

module.exports = db;
