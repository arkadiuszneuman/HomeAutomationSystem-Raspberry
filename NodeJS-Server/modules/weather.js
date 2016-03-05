var request = require('request');
var logger = require('winston');

exports.getWeather = function (cb) {
    
    if (cb != null) {
        var convertEpochToDate = function (epoch) {
            var d = new Date(epoch * 1000); // The 0 there is the key, which sets the date to the epoch
            var offset = new Date().getTimezoneOffset();
            d.setMinutes(d.getMinutes() - offset);
            return d;
        }
        
        request('http://api.openweathermap.org/data/2.5/weather?q=Warsaw,PL&APPID=51a324cb14c17d4a48d1ed5d681e0777',
          function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var weather = JSON.parse(body);
                
                logger.info('Got weather: ' + body);
                
                cb({
                    error: false,
                    sunrise: convertEpochToDate(weather.sys.sunrise),
                    sunset: convertEpochToDate(weather.sys.sunset)
                });
            } else {
                logger.error('Erron in weather request. Response: ' + response);
                cb({
                    error: true
                });
            }
        });
    }
}
