homeAutomationApp.controller('loginCtrl', function($scope, $http, $state) {
    
    $scope.user = {name:'SD',password:'SD'};
    
    
    $scope.loginUser = function(){
 
        
    $http.post('api/authenticate/',$scope.user)
				.success(function (data) {
                    console.log(data);
                    $state.go('home.index');
				}).error(function (err) {
					console.log(err);
				});
    };
});


