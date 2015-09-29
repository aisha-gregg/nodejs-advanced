'use strict';

let mongoose = require('mongoose');

let pushTokenSchema = mongoose.Schema({
    plataforma: {type: String, enum: ['ios', 'android'], index: true},
    token: { type: String, index: true },
    usuario: {type: String, index: true }
});

pushTokenSchema.statics.createRecord = function(nuevo, cb) {
    new PushToken(nuevo).save(cb);
};

var PushToken = mongoose.model('PushToken', pushTokenSchema);
