var NRF24 = require('nrf');

exports.spiDev = "/dev/spidev0.0";
exports.cePin = 25;
exports.irqPin = 24;

exports.getConnectedNrf = function() {
	return NRF24.connect(exports.spiDev, exports.cePin, exports.irqPin);
}

exports.getConfiguredNrf = function() {
	var nrf = exports.getConnectedNrf();
	nrf.channel(0x4c).transmitPower('PA_MAX').dataRate('250kbps').crcBytes(2).autoRetransmit({ count: 15, delay: 4000 });
	return nrf;
}