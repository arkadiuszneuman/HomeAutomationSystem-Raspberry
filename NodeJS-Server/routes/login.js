var logger = require('winston');
var express = require('express');
var models = require('../models');
var router = express.Router();
var User = require('../models/user');
//Auth part
var jwt = require('jsonwebtoken');
var config = require('../modules/authConfig');

router.post('/authenticate',function(req,res){
    logger.info(req.body.name);
    logger.info(req.body.password);
    User.findOne({
        name:req.body.name
    },function(err,user){
        if (err) logger.info(err);
        
        if (!user) {
            res.json({success:false,message:"Auth failed, user not in DB"});
        }else if(user){
            
            if (user.password != req.body.password) {
                res.json({success:false,message:"Password failed"});
            }else{
                
                logger.info(config.secret);
                var token = jwt.sign(user,config.secret,{
                    expiresIn:1440
                });
                
                
                logger.info('User ' + user.name + ' has logged in');
                
                res.json({
                    success:true,
                    message:'Cool login complete',
                    token:token
                });
            }
        }    
    });
    
});

module.exports = router;