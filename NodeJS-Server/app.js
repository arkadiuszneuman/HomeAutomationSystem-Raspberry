var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');

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
router.get('/device', function(req, res) {
  res.rest.success([
      { id: "lamp1", name: "Lamp 1", status: testbool }
    ]);
});

router.post('/device/:id', function(req, res) {
  setTimeout(function() {
    testbool = !testbool;
    res.rest.success({ id: "lamp1", name: "Lamp 1", status: testbool });
  }, 1000);
});

router.get('/device/:id', function(req, res) {
  var returnObj = {};
  returnObj[req.params.id] = testbool;
  res.rest.success(returnObj);
});

app.use('/api', router);

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Home Automation Server listening at http://%s:%s', host, port);
});