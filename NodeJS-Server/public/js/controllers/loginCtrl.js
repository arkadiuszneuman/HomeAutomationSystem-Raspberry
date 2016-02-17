homeAutomationApp.controller('loginCtrl', function($scope, $http, $state) {
    
    $scope.user = {name:'SD',password:'SD'};
    
    
    $scope.loginUser = function(){
 
        
    $http.post('api/authenticate/',$scope.user)
				.success(function (data) {
                    console.log(data);
                    
                    if(data.success === 'true'){
                        $state.go('home.logs');                        
                    }else{
                        
                    }
                    
				}).error(function (err) {
					console.log(err);
				});
    };
});


