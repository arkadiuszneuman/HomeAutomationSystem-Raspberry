var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');

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

var errorFunc = function (data) {
  console.log(data);
}

router.get('/device', function (req, res) {
  console.log("Getting devices statuses");

  nrfSwitch.error(function (err) {
    res.rest.badRequest(err);
  });
  
  nrfSwitch.send('1', true, function(response) {
    res.rest.success([
          { id: "lamp1", name: "Lamp 1", status: response }
        ]);
  });
});

router.post('/device/:id', function (req, res) {
  console.log("Setting device status");

  nrfSwitch.error(function (err) {
    res.rest.badRequest(err);
  });
  
  nrfSwitch.send('2', true, function(response) {
    res.rest.success({ id: "lamp1", name: "Lamp 1", status: response });
  });
});

app.use('/api', router);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Home Automation Server listening at http://%s:%s', host, port);
});

// process.on('uncaughtException', function (err) {
//   console.error(err);
//   console.log("Node NOT Exiting...");
// });
