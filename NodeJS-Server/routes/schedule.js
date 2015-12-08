var logger = require('winston');
var express = require('express');
var models = require('../models');

var router = express.Router();

 
//   router.post('/device/:id/:status', function (req, res) {
//     logger.info('Setting device id: ' + req.params.id + ' status: ' + req.params.status);
//     var statusToSend = req.params.status == 'true' ? '1' : '0';
// 
//     models.Device.findById(req.params.id, function (err, device) {
//       if (err)
//         logger.info(err);
// 
//       try {
//         var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);
// 
//         nrfSwitch.error(function (err) {
//           logger.error(err);
//           if (!res.headersSent)
//             res.rest.badRequest(err);
//         });
// 
//         nrfSwitch.send('2' + statusToSend, true, function (response) {
//           if (!res.headersSent) {
//             io.emit('changed status', { _id: req.params.id, status: response })
//             res.rest.success({ _id: req.params.id, status: response });
//           }
//         });
//       } catch (err) {
//         logger.error(err);
//         if (!res.headersSent)
//           res.rest.badRequest(err);
//       }
// 
//     });
//   });

router.put('/device/:id/schedule', function (req, res) {
  var scheduleToAdd = req.body;
  scheduleToAdd.active = true;
  logger.info(scheduleToAdd);

  models.Device.findById(req.params.id, function (err, device) {
    if (err)
      logger.info(err);

    device.schedule.push(scheduleToAdd);
    device.save(function (err) {
      if (err)
        logger.info(err);
      else
        logger.info('Saved: ' + device);
        
      logger.info('Returning: ' + device.schedule[device.schedule.length - 1]._id);
      res.rest.success({ _id: device.schedule[device.schedule.length - 1]._id });
    });
  });
});

router.delete('/device/:id/schedule/:scheduleId', function (req, res) {
  logger.info("Delete device: " + req.params.id + ", scheduleID: " + req.params.scheduleId);

  models.Device.findById(req.params.id, function (err, device) {
    if (err)
      logger.info(err);

    var isFound = false;
    for (var i = 0; i < device.schedule.length; ++i) {
      logger.info(device.schedule[i]._id);
      if (device.schedule[i]._id == req.params.scheduleId) {
        device.schedule[i].active = false;
        isFound = true;
        device.save(function (err) {
          if (err)
            logger.info(err);
          else
            logger.info('Saved: ' + device);

          res.rest.success();
        });

        break;
      }
    }

    if (!isFound)
      res.rest.notFound();
  });
});

module.exports = router;
