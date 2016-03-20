var logger = require('winston');
var express = require('express');
var models = require('../models');
var authProvider = require('./middleware.js');
var router = express.Router();
    
router
.use(authProvider.isAuth)
.get('/log' ,function(req, res) {
    models.Log.find(null, null, { sort: '-_id', skip: 0, limit: 50 }, function(err, logs) {
        if (err) logger.info(err);

        var returningLogs = [];
        for (var i = 0; i < logs.length; i++) {
        	returningLogs.push({
        		timestamp: new Date(logs[i].timestamp),
        		message: logs[i].message,
        		level: logs[i].level
        	});
        	
        };

        res.rest.success(returningLogs);
    });
});

module.exports = router;