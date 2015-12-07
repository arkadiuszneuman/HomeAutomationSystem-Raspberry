
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

  var currentDeviceStatus = 0;
  var getNextDeviceStatus = function () {
    if (currentDeviceStatus < $scope.devices.length) {
      var device = $scope.devices[currentDeviceStatus];
      $http.get('api/device/' + device._id)
        .success(function (data) {
          device.status = data.status;
          console.log('Got status: ' + device._id)
        }).error(function (err) {
          console.log('Got error: ' + device._id)
        }).finally(function () {
          device.isRefreshing = false;
          console.log('Finally: ' + device._id)
          ++currentDeviceStatus;
          getNextDeviceStatus();
        });
    }

  }

  $http.get('api/device')
    .success(function (data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].isRefreshing = true;
      }

      $scope.devices = data;
    })
    .then(function () {
      getNextDeviceStatus();
      // for (var i = 0; i < $scope.devices.length; ++i) {
      //     getDeviceStatus
      // }
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

  $scope.add = function () {
    $state.go('home.receivers.add');
  }
});