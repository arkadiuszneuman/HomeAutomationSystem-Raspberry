var nrfConfig = require('./nrf-config');

function NRFSwitch() {
	this.rxPipe = 0xF0F0F0F0E1;
	this.txPipe = 0xF0F0F0F0D2;
	
	this.callbacksArray = {};
	this.callbacksArray['error'] = {};
}

NRFSwitch.prototype.on = function(type, cb) {
	this.callbacksArray[type].push(cb);
} 

NRFSwitch.prototype.send = function (message, waitForResponse, cb) {
	var nrf = nrfConfig.getConfiguredNrf();
	nrf.begin(function () {
		var rx = nrf.openPipe('rx', this.rxPipe, { size: 1 }),
			tx = nrf.openPipe('tx', this.txPipe);
			
		var chunk;
		
		var errFunction = function(err) {
			console.log(err);
			this.callbacksArray['error'].forEach(function(db) {
				cb(err);
			}, this);
		}
		
		tx.on('error', errFunction);
		rx.on('error', errFunction);

		tx.on('ready', function () {
			console.log('Sending to ' + this.txPipe + ' message: ' + message);
			tx.write(message);

			if (!waitForResponse) {
				rx.close();
				tx.close();
				cb();
			}
		});

		rx.on('data', function (data) {
			chunk += data;
			console.log("Got chunk from " + this.rxPipe);
		});
		
		rx.on('end', function() {
			console.log("Got end: " + chunk);
			var num = chunk.readInt8(0);
			console.log('Num: ' + num);
			var status = String.fromCharCode(num) == '1' ? true : false;
			console.log("Status: ", status);
			
			cb(status);
		})
	});
}

module.exports = NRFSwitch;