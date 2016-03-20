homeAutomationApp.controller('usersManagermentCtrl', function($scope, $http, $state,userService,notify) {

function LoadUsers(){
        userService.GetAll(function(users){
        $scope.users = users;
    });
};

function createNewUser(){
    return {firstName:"",lastName:"",admin:"",email:"",password:""};
}

LoadUsers();
    
    $scope.removeUser = function(user){
        userService.Delete(user._id,function(result){
            if (result.success) {
                LoadUsers();
            }
        });
    };
    
    $scope.currentUser = {};
    $scope.editedUser = createNewUser();
    
    $scope.editUser = function(user){
        $scope.editedUser = user;
    }
    
    $scope.addUser = function(){
        $scope.editedUser = createNewUser();
    };
    
    $scope.cancelModal = function(){
        $scope.editedUser = createNewUser();
    };
    
    $scope.saveUser = function(valid, user) {
        if (valid) {
            userService.Create(user, function(result) {

                if (result.success) {
                    $scope.dismissModal();
                    LoadUsers();
                } else {
                      notify.show({
                        title: 'Creation failed',
                        text: result.message,
                        type: 'error'
                    });
                }
            });
        }
    };
});