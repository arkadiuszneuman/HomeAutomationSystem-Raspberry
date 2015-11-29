var NRFSwitch = require('../modules/nrf-switch');
var logger = require('winston');
var express = require('express');

var router = express.Router();
var nrfSwitch = new NRFSwitch();

module.exports = function (io) {
  router.get('/device', function (req, res) {
    logger.info("Getting devices statuses");

    nrfSwitch.error(function (err) {
      res.rest.badRequest(err);
    });

    nrfSwitch.send('10', true, function (response) {
      res.rest.success([
        { id: "lamp1", name: "Lamp 1", status: response }
      ]);
    });
  });

  router.post('/device/:id/:status', function (req, res) {
    logger.info("Setting device status: " + req.params.status);

    var statusToSend = req.params.status == 'true' ? '1' : '0';

    nrfSwitch.error(function (err) {
      if (!res.headersSent)
        res.rest.badRequest(err);
    });

    nrfSwitch.send('2' + statusToSend, true, function (response) {
      if (!res.headersSent) {
        io.emit('changed status', { id: "lamp1", status: response })
        res.rest.success({ id: "lamp1", name: "Lamp 1", status: response });
      }
    });
  });
  
  return router;
}