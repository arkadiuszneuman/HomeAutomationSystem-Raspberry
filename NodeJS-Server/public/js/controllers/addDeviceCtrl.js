
homeAutomationApp.controller('addDeviceCtrl', function ($scope, $http, $state) {
	$scope.device = {};

	$scope.save = function () {
		$http.put('api/device', $scope.device)
			.success(function () {
				$scope.close();
			}).error(function (err) {
				console.log(err);
			});
	}

	$scope.close = function () {
		$state.go('home.receivers');
	}
});