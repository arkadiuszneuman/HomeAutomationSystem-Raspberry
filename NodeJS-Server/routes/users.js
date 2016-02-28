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
     var user = new User();
        user.name = req.body.name;
        user.password = req.body.password;
        user.admin = req.body.admin;

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
});

module.exports = router;