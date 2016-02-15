homeAutomationApp.controller('loginCtrl', function($scope, $http, $state) {
    
    $scope.user = {name:'',password:''};
    
    
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


