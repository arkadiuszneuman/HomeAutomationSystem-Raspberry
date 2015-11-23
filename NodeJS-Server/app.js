var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');
var logger = require('winston');

var NRFSwitch = require('./modules/nrf-switch');

app.use(restResponse({
  showStatusCode: false,
  showDefaultMessage: false
}));

app.use('/', express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/bower_components'));

//serve main file
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/html/index.html');
});

//api
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
var nrfSwitch = new NRFSwitch();

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  logger.log('Home Automation Server listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);

var errorFunc = function (data) {
  logger.log(data);
}

router.get('/device', function (req, res) {
  logger.log("Getting devices statuses");

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
  logger.log("Setting device status: " + req.params.status);

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

app.use('/api', router);

io.on('connection', function (socket) {
  logger.log('a user connected');
  socket.on('disconnect', function () {
    logger.log('user disconnected');
  });
});

process.on('uncaughtException', function (err) {
  logger.error(err);
  logger.log("Node NOT Exiting...");
});
