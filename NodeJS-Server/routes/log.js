var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();

router.get('/log', function(req, res) {
    logger.info('Getting logs list');
    models.Log.find(null, null, { skip: 0, limit: 50 }, function(err, logs) {
        if (err) logger.info(err);
        res.rest.success(logs);
    });
});

module.exports = router;