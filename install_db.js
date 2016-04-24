'use strict';

var mongoose = require('mongoose');
var readLine = require('readline');
var async = require('async');

var db = require('./lib/connectMongoose');

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');
require('./models/Usuario');
require('./models/PushToken');

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

    async.series([
        initAnuncios,
        initUsuarios
        ], (err) => {
            if (err) {
                console.error('Hubo un error: ', err);
                return process.exit(1);
            }

            return process.exit(0);
        }
    );

}

function initAnuncios(cb) {
    var Anuncio = mongoose.model('Anuncio');

    Anuncio.remove({}, ()=> {

        console.log('Anuncios borrados.');

        // Cargar anuncios.json
        var fichero = './anuncios.json';
        console.log('Cargando ' + fichero + '...');

        Anuncio.cargaJson(fichero, (err, numLoaded)=> {
            if (err) {
                return cb(err);
            }

            console.log(`Se han cargado ${numLoaded} anuncios.`);
            return cb(null, numLoaded);
        });

    });

}

function initUsuarios(cb) {
    var Usuario = mongoose.model('Usuario');

    Usuario.remove({}, ()=> {

        var usuarios = [
            {nombre: 'admin', email: 'jamg44@gmail.com', clave: '123456'}
        ];

        async.eachSeries(usuarios, Usuario.createRecord, (err)=> {
            if (err) {
                return cb(err);
            }

            console.log(`Se han cargado ${usuarios.length} usuarios.`);
            return cb(null, usuarios.length);
        });

    });
}
