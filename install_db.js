'use strict';

var db = require('./models/db');
var mongoose = require('mongoose');
var readLine = require('readline');
var Anuncio = mongoose.model('Anuncio');

db.once('open', function() {

    var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Are you sure you want to empty DB? (no) ', function(answer) {
        rl.close();
        if (answer.toLowerCase() === 'yes') {
            runInstallScript();
        } else {
            console.log('DB install aborted!');
            return process.exit(0);
        }
    });

});

function runInstallScript() {

    Anuncio.remove({}, ()=> {

        console.log('Anuncios borrados.')

        // Cargar anuncios.json
        var fichero = './anuncios.json';
        console.log('Cargando ' + fichero + '...');

        Anuncio.cargaJson(fichero, (err, numLoaded)=> {
            if (err) {
                console.error('Hubo un error: ', err);
                return process.exit(1);
            }

            console.log(`Ok, se han cargado ${numLoaded} anuncios.`);
            return process.exit(0);
        });

    });

}
