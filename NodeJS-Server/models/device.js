var mongoose = require('mongoose');
var deviceSchema = mongoose.Schema({
	name: String,
	rxPipe: String,
	txPipe: String,
	
	schedule: [{
		name: String,
		desc: String,
		cron: String,
		status: Boolean,
		active: Boolean
	}],
	history: [{
		date: Date,
		status: Boolean
	}],
	
	active: Boolean
});

module.exports = mongoose.model('Device', deviceSchema);
