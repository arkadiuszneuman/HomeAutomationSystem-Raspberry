var nrfConfig = require('./nrf-config');
var logger = require('winston');

var NRFSwitch = function () {
	this.rxPipe = 0xF0F0F0F0E1;
	this.txPipe = 0xF0F0F0F0D2;

	this.errorCallback = null;
}

NRFSwitch.prototype.error = function (cb) {
	this.errorCallback = cb;
}

NRFSwitch.prototype.send = function (message, waitForResponse, cb) {
	var self = this;
	var nrf = nrfConfig.getConfiguredNrf();
	var gotData = false;

	nrf.begin(function () {
		var rx = nrf.openPipe('rx', self.rxPipe, { size: 1 }),
			tx = nrf.openPipe('tx', self.txPipe);

		var chunk = '';

		var errFunction = function (err) {
			gotData = true;
			logger.error(err);
			if (self.errorCallback !== null) {
				self.errorCallback();
			}
		};

		tx.on('error', errFunction);
		rx.on('error', errFunction);

		tx.on('ready', function () {
			gotData = false;
			logger.info('Sending to ' + self.txPipe + ' message: ' + message);
			
			var msgToSend = message.split("").reverse().join("");
			logger.log("writing " + msgToSend);
			tx.write(msgToSend);

			if (!waitForResponse) {
				rx.close();
				tx.close();

				if (cb)
					cb();
			} else {
				setTimeout(function () {
					if (!gotData) {
						logger.info("Retrying");
						tx.write(msgToSend);
					}
				}, 1000);
			}
		});

		rx.on('data', function (data) {
			gotData = true;
			chunk += data;
			logger.info("Got chunk from " + self.rxPipe + ": " + chunk);
			var num = data.readInt8(0);
			logger.info('Num: ' + num);
			var status = String.fromCharCode(num) == '1' ? true : false;
			logger.info("Status: ", status);

			rx.close();
			tx.close();

			if (cb)
				cb(status);
		});

	});
}

module.exports = NRFSwitch;