var myApp = angular.module('homeautomation', ['angular-ladda']);

angular.module('homeautomation')
  .config(function (laddaProvider) {
    laddaProvider.setOption({
      style: 'zoom-in'
    });
  })

myApp.controller('mainCtrl', function ($scope, $http) {
  $http.get('api/device')
    .success(function (data) {
      for (var i = 0; i < data.length; ++i) {
        data[i].isRefreshing = false;
      }

      $scope.devices = data;
    });

  $scope.changeStatus = function (device) {
    device.isRefreshing = true;
    $http.post('api/device/' + device.id)
      .success(function (data) {
        device.status = data.status;
      })
    .finally(function () {
        device.isRefreshing = false;      
    });
  }
});