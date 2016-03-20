var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var restResponse = require('express-rest-response');
var logger = require('winston');
// var scheduler = require('./modules/scheduler');
var path = require('path');
var dir = require('node-dir');

//Auth part
var jwt = require('jsonwebtoken');
var config = require('./modules/authConfig');

//configure logger for mongo
require('winston-mongodb').MongoDB;
logger.add(logger.transports.MongoDB, {
    db: 'mongodb://localhost/homeautomationsystem'
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/homeautomationsystem', function (err) {
    if (err)
        logger.error(err);
});

app.use(restResponse({
    showStatusCode: false,
    showDefaultMessage: false
}));

if (process.env.NODE_ENV === 'dev') {
    app.use('/', express.static(__dirname + '/public'));
} else {
    app.use('/', express.static(__dirname + '/dist'));
}

app.use('/', express.static(__dirname + '/bower_components'));

app.set('view engine', 'ejs');

//serve main file
app.get('/', function (req, res) {
    var fs = require('fs');
    var file = fs.readFileSync('bower_components.json', 'utf8');
    var bowerComponents = JSON.parse(file.toString().trim());
    
    if (process.env.NODE_ENV === 'dev') {
        dir.files(__dirname + '/public/js/', function (err, jsFiles) {
            if (err) throw err;
            
            jsFiles = jsFiles.filter(function (file) {
                return file.indexOf('.js') > -1;
            });
            jsFiles = jsFiles.filter(function (file) {
                return file.indexOf('template\\') === -1;
            });
            
            for (var i = 0; i < jsFiles.length; ++i) {
                jsFiles[i] = jsFiles[i].replace(path.join(__dirname, 'public'), '').split(path.sep).join('/');
            }
            
            res.render(__dirname + '/public/html/index.ejs', { jsFiles: jsFiles, bowerJSFiles: bowerComponents.js, bowerCSSFiles: bowerComponents.css });
        });
    } else {
        res.render(__dirname + '/public/html/index.ejs', { jsFiles: __dirname + '/dist/has.js', bowerJSFiles: bowerComponents.js, bowerCSSFiles: bowerComponents.css });
    }
});


//api
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    logger.info('Home Automation Server listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);
var deviceRoutes = require('./routes/device')(io);
var scheduleRoutes = require('./routes/schedule');
var logRoutes = require('./routes/log');
var dashboardRoutes = require('./routes/dashboard');
var userRoutes = require('./routes/users');
var loginRoutes = require('./routes/login');

app.use('/api', deviceRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', logRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', userRoutes);
app.use('/api', loginRoutes);

io.on('connection', function (socket) {
    logger.info('a user connected');
    socket.on('disconnect', function () {
        logger.info('user disconnected');
    });
});


process.on('uncaughtException', function (err) {
    logger.error(err);
    logger.info("Node NOT Exiting...");
});

scheduler.start();
