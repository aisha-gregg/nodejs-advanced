'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

/* jshint ignore:start */
var db = require('./lib/connectMongoose');
/* jshint ignore:end */

// Cargamos las definiciones de todos nuestros modelos
require('./models/Anuncio');
require('./models/Usuario');
require('./models/PushToken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// registrar lenguajes
var lang = require('./lib/lang');
lang.registerLang('en'); // el primero es el idioma por defecto
lang.registerLang('es');

// poner lenguaje en request leyendo cabecera x-lang
app.use((req, res, next)=> {
    req.lang = req.get('x-lang');
    next();
});

app.use('/', routes);
app.use('/users', users);

// API v1
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));
app.use('/apiv1/usuarios', require('./routes/apiv1/usuarios'));
app.use('/apiv1/pushtokens', require('./routes/apiv1/pushtokens'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    /*jshint unused: false*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (req.path.match(/\/apiv\d+/)) {
            // llamada de API, devuelvo JSON
            return res.json({
                ok: false,
                error: {code: err.status || 500, message: err.message, err: err}
            });
        }

        res.render('error', {
            message: err.message,
            error: err
        });
    });
    /*jshint unused: true*/
}

// production error handler
// no stacktraces leaked to user
/*jshint unused: false*/
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (req.path.match(/\/apiv\d+/)) {
        // llamada de API, devuelvo JSON
        return res.json({
            ok: false,
            error: {code: err.status || 500, message: err.message, err: err}
        });
    }

    res.render('error', {
        message: err.message,
        error: {}
    });
});
/*jshint unused: true*/

module.exports = app;
