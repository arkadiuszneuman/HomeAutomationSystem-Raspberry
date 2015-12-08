homeAutomationApp.controller('scheduleCtrl', function ($scope, $http, $state) {
	$scope.schedules = [];
	$scope.add = function() {
		var newSchedule = { };
		$scope.schedules.push(newSchedule);
	}
	
	$scope.save = function(schedule) {
		var x = 132;
	}
	
	$scope.close = function () {
		$state.go('home.receivers');
	}
});