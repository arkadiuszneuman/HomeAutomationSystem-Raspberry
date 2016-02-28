var weather = require('../modules/weather');
var express = require('express');
var logger = require('winston');

var router = express.Router();

router.get('/weather', function (req, res) {
    logger.info('Getting weather');
    weather.getWeather(function(weather) {
        if (!weather.error) {
            res.rest.success(weather);
        } else {
            res.rest.serverError(weather);
        }
    });
});

module.exports = router;