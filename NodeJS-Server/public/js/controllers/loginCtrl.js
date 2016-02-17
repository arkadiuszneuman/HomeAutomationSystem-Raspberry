/* global PNotify */
homeAutomationApp.controller('loginCtrl', function ($scope, $http, $state, $authService) {
    $scope.user = { name: '', password: '' };


    $scope.loginUser = function () {


        $http.post('api/authenticate/', $scope.user)
            .success(function (data) {
                console.log(data);

                if (data.success == true) {

                    $authService.set('HACToken',data.token);

                    new PNotify({
                        title: 'Welcome in Home Automation System',
                        text: 'piczi',
                        type: 'success'
                    });

                    $state.go('home.logs');
                } else {
                    new PNotify({
                        title: 'Login failed',
                        text: data.message,
                        type: 'error'
                    });
                }

            }).error(function (err) {
                console.log(err);
            });
    };
});


