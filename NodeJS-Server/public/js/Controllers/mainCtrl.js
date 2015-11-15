var myApp = angular.module('homeautomation', []);

myApp.controller('mainCtrl', function($scope, $http) {
  $http.get('api/device')
    .success(function(data) {
      $scope.devices = data;
    });
});