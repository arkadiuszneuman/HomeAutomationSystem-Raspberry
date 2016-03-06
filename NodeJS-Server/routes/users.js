var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();
var User = require('../models/user');

router
.use(function(req, res, next) {
    console.log(req.method, req.url);
    next(); 
})
.get('/users', function (req, res) {

    User.find({}, function (err, users) {
        if (err) logger.info(err);

        res.json(users);
    });
})
.get('/users/:id',function(req,res){

   User.findById(req.params.id,function(err,user){
        if (err) logger.error(err);

        res.json(user);
   });
})
.post('/users/',function(req,res){
   
    logger.info(JSON.stringify(req.body));
    
    User.find({ email: req.body.email }, function (err, users) {
        if (err) logger.info(err);

        if (users.length > 0) {
            res.json({ success: false, message: 'There is user with same email' });
        } else {
            var user = new User(req.body);
            user.save(function (err) {
                if (err) {
                    logger.error(err);
                    res.json({ success: false, message: err.message });
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
});

module.exports = router;