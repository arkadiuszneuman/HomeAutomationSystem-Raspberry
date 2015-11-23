var myApp = angular.module('homeautomation', ['angular-ladda']);

angular.module('homeautomation')
  .config(function (laddaProvider) {
    laddaProvider.setOption({
      style: 'zoom-in'
    });
  })

myApp.controller('mainCtrl', function ($scope, $http) {
  var socket = io();

  socket.on('changed status', function (changedDevice) {
    for (var i = 0; i < $scope.devices.length; i++) {
      if ($scope.devices[i].id === changedDevice.id) {
        $scope.devices[i].status = changedDevice.status;
        $scope.$apply();
      }
    }
  });

  $http.get('api/device')
    .success(function (data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].isRefreshing = false;
      }

      $scope.devices = data;
    });

  $scope.changeStatus = function (device) {
    device.isRefreshing = true;
    var stat = !device.status
    $http.post('api/device/' + device.id + '/' + stat)
      .success(function (data) {
        device.status = data.status;
      })
      .finally(function () {
        device.isRefreshing = false;
      });
  }
});