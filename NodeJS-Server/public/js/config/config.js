var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
  laddaProvider.setOption({
    style: 'expand-right'
  });
});

homeAutomationApp.factory('authInterceptor',['$window',function($window){
    var myInterceptor = {
        request:function(config){
           config.headers['x-access-token'] = $window.localStorage['HACToken'];
           return config;
        }
    };
    
    return myInterceptor;
}]);

homeAutomationApp.config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
}]);