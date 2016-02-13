var mongoose = require('mongoose');

var userchema = mongoose.Schema({
	name: String,
	password: String,
	admin: Boolean
}, { collection: 'user' });

module.exports = mongoose.model('User', userchema);
