var nrfConfig = require('./nrf-config');

var NRFSwitch = function () {
	this.rxPipe = 0xF0F0F0F0E1;
	this.txPipe = 0xF0F0F0F0D2;

	this.errorsArray = new Array();
}

NRFSwitch.prototype.error = function (cb) {
	this.errorsArray.push(cb);
}

NRFSwitch.prototype.send = function (message, waitForResponse, cb) {
	var nrf = nrfConfig.getConfiguredNrf();

	nrf.begin(function () {
		var rx = nrf.openPipe('rx', this.rxPipe, { size: 1 }),
			tx = nrf.openPipe('tx', this.txPipe);

		var chunk = '';

		var errFunction = function (err) {
			console.log(err);
			this.errorsArray.forEach(function (cb) {
				cb(err);
			}, this);
		}.bind(this);

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
		}.bind(this));

		rx.on('data', function (data) {
			chunk += data;
			console.log("Got chunk from " + this.rxPipe + ": " + chunk);

			var num = data.readInt8(0);
			console.log('Num: ' + num);
			var status = String.fromCharCode(num) == '1' ? true : false;
			console.log("Status: ", status);

			rx.close();
			tx.close();

			cb(status);
		}.bind(this));

	}.bind(this));
}

module.exports = NRFSwitch;