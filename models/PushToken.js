'use strict';

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({
    plataforma: {type: String, enum: ['ios', 'android']},
    token: String,
    usuario: String
});

pushTokenSchema.statics.createRecord = function(nuevo, cb) {
    new PushToken(nuevo).save(cb);
};

var PushToken = mongoose.model('PushToken', pushTokenSchema);
