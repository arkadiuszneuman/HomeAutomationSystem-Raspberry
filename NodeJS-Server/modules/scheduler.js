var NRFSwitch = require('../modules/nrf-switch');
var logger = require('winston');
var express = require('express');
var models = require('../models');
var weather = require('../modules/weather');

var CronJob = require('cron').CronJob;

var jobs = [];
var jobsStartedToday = false;

exports.start = function () {
    logger.info('Staring scheduler');
    models.Device.find({ active: true }, function (err, devices) {
        if (err)
            logger.info(err);
        else {
            weather.getWeather(function (weather) {
                devices.forEach(function (device) {
                    
                    var nrfSwitch = new NRFSwitch(device.rxPipe, device.txPipe);
                    
                    device.schedule.forEach(function (schedule) {
                        if (schedule.active) {
                            logger.info('Starting job ' + schedule.name);
                            
                            switch (schedule.mainType) {
                                case 'timeofday':
                                    var job = new CronJob(schedule.cron, function () {
                                        logger.info('Sending status ' + schedule.status + ' by scheduler');
                                        
                                        nrfSwitch.error(function (err) {
                                            logger.error('Scheduler [' + schedule.name + ']  err: ' + err);
                                        });
                                        
                                        var statusToSend = schedule.status === true ? '1' : '0';
                                        nrfSwitch.send('2' + statusToSend, true, function (response) {
                                            logger.info('Scheduler [' + schedule.name + '] sent status');
                                        });
                                    }, null, true);
                                    
                                    jobs.push(job);
                                    break;
                                case 'sun':
                                    if (!weather.error) {
                                        var jobDate;
                                        
                                        switch (schedule.subType) {
                                            case 'sunrise':
                                                jobDate = weather.sunrise;
                                                break;
                                            case 'sunset':
                                                jobDate = weather.sunset;
                                                break;
                                        }
                                        
                                        if (jobDate != null) {
                                            var finalDate = new Date(jobDate.getTime() + schedule.difference * 60000);
                                            
                                            var sunriseJob = new CronJob(finalDate, function () {
                                                logger.info('Sending status ' + schedule.status + ' by scheduler');
                                                
                                                nrfSwitch.error(function (err) {
                                                    logger.error('Scheduler [' + schedule.name + ']  err: ' + err);
                                                });
                                                
                                                var statusToSend = schedule.status === true ? '1' : '0';
                                                nrfSwitch.send('2' + statusToSend, true, function (response) {
                                                    logger.info('Scheduler [' + schedule.name + '] sent status');
                                                });
                                            }, null, true);
                                            
                                            jobs.push(sunriseJob);
                                            break;
                                        }
                                    }
                            }
                        }
                    }, this);
                }, this);
            }, this);
            
            var job = new CronJob('*/10 * * * *', function () {
                logger.info('Keeping nodejs up');
                
                if (new Date().getHours() === 1) {
                    if (!jobsStartedToday) {
                        jobsStartedToday = true;
                        logger.info('Restarting jobs');
                        exports.restart();
                    }
                } else {
                    jobsStartedToday = false;
                }
            }, null, true);
            
            jobs.push(job);
        }
    });
}

exports.stop = function () {
    logger.info('Stopping scheduler');
    jobs.forEach(function (job) {
        job.stop();
    }, this);
}

exports.restart = function () {
    exports.stop();
    exports.start();
}