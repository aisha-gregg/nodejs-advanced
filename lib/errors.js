'use strict';

let _extend = require('util')._extend;

let lang = require('./lang');

function translateMessage(mess, langid) {
    if (typeof mess === 'object') {
        return lang.translate(mess.template, langid, mess.values);
    } else {
        return lang.translate(mess, langid);
    }
}

let errors = function(err, langid) {

    let status = 500;
    let json = {ok: false, error:{}};

    // si es del tipo Error convertirlo
    if (err instanceof Error) {
        json.error.code = 500;
        json.error.message = err.message;
    } else {

        // extraer status si lo tiene
        if (err.status) {
            status = err.status;
            delete err.status;
        }

        // añadir resto de propiedaes
        _extend(json.error, err);

        // traducir message
        if (json.error.message) {
            json.error.message = translateMessage(json.error.message, langid);
        }

        // traducir errores
        if (json.error.errors) {
            json.error.errors.forEach((error)=> {
                if (error.message) {

                    //    error.message = translateMessage(error.message);

                    // si no tiene field se lo pongo
                    if (typeof error.message === 'object') {
                        error.message.values.field = error.field || lang.translate('the_field', langid);
                        error.message = translateMessage({
                            template: error.message.template,
                            values: error.message.values
                        }, langid);
                    } else {
                        error.message = translateMessage({
                            template: error.message,
                            values: {
                                field: error.field || lang.translate('the_field')
                            }
                        }, langid);
                    }
                }
            });
        }

    }

    return {
        json: (res)=> {
            if (res) {
                return res.status(status).json(json);
            }

            return json;
        }
    };

};

module.exports = errors;
