'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
	userId: { type: String },
	accessToken: { type: String },
	createdAt: { type: Date, 'default': Date.now }
});

SessionSchema.pre('save', function (next) {
	if (!this.accessToken) {
		var currentDate = (new Date()).valueOf().toString(),
			random = Math.random().toString();
		this.accessToken = crypto.createHash('sha1').update(currentDate + random).digest('hex');
	}
	next();
});

module.exports = mongoose.model('Session', SessionSchema);
