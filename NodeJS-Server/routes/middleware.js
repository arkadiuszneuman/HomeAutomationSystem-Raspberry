var logger = require('winston');
var express = require('express');

//Auth part
var jwt = require('jsonwebtoken');
var config = require('../modules/authConfig');

module.exports = {
    isAuth: function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        if (token) {

            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    logger.info(err.message);
                    return res.json({ success: false, message: err.message });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({ success: false, message: 'No token provided' });
        }

    }
    ,
    methodLogger: function (req, res, next) {
        logger.info(req.method, req.url);
        return next();
    }
}