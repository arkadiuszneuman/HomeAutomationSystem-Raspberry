exports.spiDev = "/dev/spidev0.0";
exports.cePin = 25;
exports.irqPin = 24;

mockData = 48;

exports.getConnectedNrf = function() {
	var NRF24 = require('nrf');
	return NRF24.connect(exports.spiDev, exports.cePin, exports.irqPin);
}

exports.getConfiguredNrf = function() {
	if (process.env.NODE_ENV === 'dev') {
		return {
			begin: function(callback) {
				callback();
			},
			openPipe: function() {
				return {
					on: function(eventType, callback) {
						switch (eventType) {
							case 'ready':
								setTimeout(callback, 200);
								break;
							case 'data':
								setTimeout(function() {
									callback({
										readInt8: function() {
											return mockData;
										}
									});
								}, 1000);
								break;
						}
					},
					write: function(msg) {
						if (msg[0] === '1') {
							mockData = 49;
						} else {
							mockData = 48;
						}
						console.log('[NRF-MOCK] Writing data: ' + msg);
					},
					close: function() {
					}
				}
			}
		}
	} else {
		var nrf = exports.getConnectedNrf();
		nrf.channel(0x4c).transmitPower('PA_MAX').dataRate('250kbps').crcBytes(2).autoRetransmit({ count: 15, delay: 4000 });
		return nrf;
	}
}
