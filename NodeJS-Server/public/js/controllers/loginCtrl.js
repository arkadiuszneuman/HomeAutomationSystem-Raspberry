/* global PNotify */
homeAutomationApp.controller('loginCtrl', function ($scope, $http, $state, notify,authService) {
    $scope.user = { name: '', password: '' };



    $scope.loginUser = function () {
        authService.Login($scope.user,function (loginResult) {

            if (loginResult.success) {
                notify.show({
                    title: 'Welcome in Home Automation System',
                    text: 'piczi',
                    type: 'success'
                });

            } else {
                notify.show({
                    title: 'Login failed',
                    text: loginResult.message,
                    type: 'error'
                });
            }

        });
    };
// 
// 
//     $scope.loginUser = function () {
//             userService.logIn($scope.user)
//             .success(function (data) {
//                 console.log(data);
// 
//                 if (data.success == true) {
// 
//                     authService.set('HACToken',data.token);
//                     authService.IsLoggedIn = true
//                     
//                     userService.setUser($scope.user);
//                     
//                     $notify.show({
//                         title: 'Welcome in Home Automation System',
//                         text: 'piczi',
//                         type: 'success'
//                     });
//                    
//                     $state.go('home.logs');
//                 } else {
//                     
//                     $notify.show({
//                         title: 'Login failed',
//                         text: data.message,
//                         type: 'error'
//                     });
//                 }
// 
//             }).error(function (err) {
//                 console.log(err);
//             });
//     };
});