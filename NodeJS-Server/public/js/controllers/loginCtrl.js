/* global PNotify */
homeAutomationApp.controller('loginCtrl', function ($scope, $http, $state, notify, authService) {

    $scope.user = { email: '', password: '' };

    $scope.loginUser = function (isValid) {

        if (isValid) {
            authService.Login($scope.user, function (loginResult) {

                if (loginResult.success) {
                    notify.show({
                        title: 'Welcome in Home Automation System',
                        text: 'login success',
                        type: 'success'
                    });

                    $state.go('home.logs');

                } else {
                    notify.show({
                        title: 'Login failed',
                        text: loginResult.message,
                        type: 'error'
                    });
                }
            });
        }
    };
});