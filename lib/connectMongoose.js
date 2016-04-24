'use strict';

let mongoose = require('mongoose');
let db = mongoose.connection;

db.on('error', function(err) {
    console.error('mongodb connection error:', err);
    process.exit(1);
});

db.once('open', function() {
    console.info('Connected to mongodb.');
});

mongoose.connect('mongodb://localhost/nodepop');

module.exports = db;
