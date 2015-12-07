
homeAutomationApp.controller('mainCtrl', function ($scope, $http, $state) {
  var socket = io();

  socket.on('changed status', function (changedDevice) {
    for (var i = 0; i < $scope.devices.length; i++) {
      if ($scope.devices[i]._id === changedDevice._id) {
        $scope.devices[i].status = changedDevice.status;
        $scope.$apply();
      }
    }
  });

  $http.get('api/device')
    .success(function (data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].isRefreshing = true;
      }

      $scope.devices = data;
    })
    .then(function () {
      for (var i = 0; i < $scope.devices.length; ++i) {
        var device = $scope.devices[i];
        $http.get('api/device/' + device._id)
          .success(function (data) {
            device.status = data.status;
          }).finally(function() {
            device.isRefreshing = false;            
          });
      }
    });

  $scope.changeStatus = function (device) {
    device.changingStatus = true;
    var stat = !device.status
    $http.post('api/device/' + device._id + '/' + stat)
      .success(function (data) {
        device.status = data.status;
      })
      .finally(function () {
        device.changingStatus = false;
      });
  }
  
  $scope.add = function() {
    $state.go('home.receivers.add');
  }
});