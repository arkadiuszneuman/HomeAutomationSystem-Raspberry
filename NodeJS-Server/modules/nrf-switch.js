var nrfConfig = require('./nrf-config');
var logger = require('winston');

var NRFSwitch = function (rxPipe, txPipe) {
	this.rxPipe = Number(rxPipe);
	this.txPipe = Number(txPipe);

	this.errorCallback = null;
}

NRFSwitch.prototype.error = function (cb) {
	this.errorCallback = cb;
}

NRFSwitch.prototype.send = function (message, waitForResponse, cb) {
	var self = this;
	var nrf = nrfConfig.getConfiguredNrf();
	var gotData = false;
	self.errorSent = false;
	self.callbackSent = false;

	nrf.begin(function () {
		var rx = nrf.openPipe('rx', self.rxPipe, { size: 1 }),
			tx = nrf.openPipe('tx', self.txPipe);

		var chunk = '';

		var errFunction = function (err) {
			gotData = true;
			logger.error('Got error: ' + err);
			if (self.errorCallback !== null && !self.callbackSent) {
				self.errorSent = true;
				self.errorCallback();
			}
			
			rx.close();
			tx.close();
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

				if (cb && !self.errorSent) {
					self.callbackSent = true;
					cb();
				}
			} else {
				setTimeout(function () {
					if (!gotData) {
						errFunction('No response');
						// logger.info("Retrying");
						// tx.write(msgToSend);
					}
				}, 3000);
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

			if (cb && !self.errorSent) {
				self.callbackSent = true;
				cb(status);
			}
		});

	});
}

module.exports = NRFSwitch;