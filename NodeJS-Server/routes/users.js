var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();

router.get('/user', function(req, res) {
    logger.info('Getting users list');
    
    models.User.find({},function(err,users){
        if (err) logger.info(err);
        
        res.rest.success(users);
    });
});

module.exports = router;