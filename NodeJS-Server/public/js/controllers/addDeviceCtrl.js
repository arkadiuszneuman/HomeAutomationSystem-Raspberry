
homeAutomationApp.controller('addDeviceCtrl', function ($scope, $http, $state) {
	$scope.device = {};

	$scope.save = function () {
		$http.put('api/device', $scope.device)
			.success(function () {
				$state.go('home.receivers');
			}).error(function (err) {
				console.log(err);
			});
	}
});