var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');

var NRF24 = require('nrf'),
  spiDev = "/dev/spidev0.0",
  cePin = 25, irqPin = 24,            //var ce = require("./gpio").connect(cePin)
  pipes = [0xF0F0F0F0E1, 0xF0F0F0F0D2];

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

var testbool = true;
router.get('/device', function (req, res) {
  console.log("Getting devices statuses");

  var nrf = NRF24.connect(spiDev, cePin, irqPin);
  nrf.channel(0x4c).transmitPower('PA_MAX').dataRate('250kbps').crcBytes(2).autoRetransmit({ count: 15, delay: 4000 });
  nrf.begin(function () {
    var rx = nrf.openPipe('rx', pipes[0], { size: 8 }),
      tx = nrf.openPipe('tx', pipes[1], { size: 8 });

    tx.on('ready', function () {
      try {
        console.log("Sending status request");
        tx.write("1");
      } catch (e) {
        console.log(e);
        res.rest.badRequest(e);
      }
    });

    rx.on('data', function (data) {
      try {
        var num = data.readInt8(0);
        var status = String.fromCharCode(num) == '1' ? true : false;
        console.log("Got data: ", status);

        rx.close();
        tx.close();

        res.rest.success([
          { id: "lamp1", name: "Lamp 1", status: status }
        ]);
      } catch (e) {
        console.log(e);
        res.rest.badRequest(e);
      }
    });
  });
});

router.post('/device/:id', function (req, res) {
  console.log("Getting devices statuses");

  var nrf = NRF24.connect(spiDev, cePin, irqPin);
  nrf.channel(0x4c).transmitPower('PA_MAX').dataRate('250kbps').crcBytes(2).autoRetransmit({ count: 15, delay: 4000 });
  nrf.begin(function () {
    var rx = nrf.openPipe('rx', pipes[0], { size: 8 }),
      tx = nrf.openPipe('tx', pipes[1], { size: 8 });

    tx.on('ready', function () {
      try {
        console.log("Sending change status request");
        tx.write("2");
      } catch (e) {
        console.log(e);
        res.rest.error(e);
      }
    });

    rx.on('data', function (data) {
      try {
        var num = data.readInt8(0);
        var status = String.fromCharCode(num) == '1' ? true : false;
        console.log("Got data: ", status);

        rx.close();
        tx.close();

        res.rest.success({ id: "lamp1", name: "Lamp 1", status: status });
      } catch (e) {
        console.log(e);
        res.rest.error(e);
      }
    });
  });

});

app.use('/api', router);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Home Automation Server listening at http://%s:%s', host, port);
});

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});