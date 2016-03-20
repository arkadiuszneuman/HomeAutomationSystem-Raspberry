homeAutomationApp.controller('registerCtrl', function ($scope, $http, $state, notify, userService) {

    $scope.user = { firstName: '', lastName: '', email: '', password: '' };

    $scope.CreateUser = function (isValid) {
        if (isValid) {
            userService.Create($scope.user, function (result) {

                if (result.success) {
                    notify.show({
                        title: 'Registration success',
                        text: 'Registration success',
                        type: 'success'
                    });

                    $state.go('home.login');

                } else {
                    notify.show({
                        title: 'Registration failed',
                        text: result.message,
                        type: 'error'
                    });
                }
            });
        }
    };
});


