homeAutomationApp.controller('usersManagermentCtrl', function($scope, $http, $state,userService) {

function LoadUsers(){
        userService.GetAll(function(users){
        $scope.users = users;
    });
};

LoadUsers();
    
    $scope.removeUser = function(user){
        userService.Delete(user._id,function(result){
            if (result.success) {
                LoadUsers();
            }
        });
    }
});