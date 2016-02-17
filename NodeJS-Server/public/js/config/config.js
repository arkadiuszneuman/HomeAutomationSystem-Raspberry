var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
  laddaProvider.setOption({
    style: 'expand-right'
  });
});

homeAutomationApp.factory('$authService', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

homeAutomationApp.factory('authInterceptor',['$authService',function($authService){
    var myInterceptor = {
        request:function(config){
           config.headers['x-access-token'] = $authService.getObject('HACToken');
           return config;
        }
    };
    
    return myInterceptor;
}]);

homeAutomationApp.config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
}]);