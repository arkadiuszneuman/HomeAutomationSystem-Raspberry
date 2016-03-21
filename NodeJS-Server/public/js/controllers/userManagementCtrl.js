homeAutomationApp.controller('usersManagermentCtrl', function($scope, $http, $state,userService,notify) {

function LoadUsers(){
        userService.GetAll(function(users){
        $scope.users = users;
    });
};

function createNewUser(){
    return {firstName:"",lastName:"",admin:false,email:"",password:""};
}

LoadUsers();
    
    $scope.removeUser = function(user) {
        userService.Remove(user._id, function(result) {
            if (result.success) {
                LoadUsers();
            } else {
                notify.show({
                    title: 'delete failed',
                    text: result.message,
                    type: 'error'
                });
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

            if (user._id != undefined && user._id != "") {
                userService.Update(user, function(result) {

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
            } else {
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
        }
    };
});