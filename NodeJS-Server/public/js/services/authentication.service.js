
homeAutomationApp.factory('authService', ['$http', 'storageService', 'userService', function ($http, storageService, userService) {

    return {
        Login: function (user, callback) {
            return $http.post('api/authenticate', user)
                .success(function (result) {

                    if (result.success) {
                        storageService.set('id', user._id);
                        storageService.set('login', user.login);
                        storageService.set('password', user.password);
                        storageService.set('HACToken', result.token);

                        userService.setUser(user);

                        callback({ success: true });
                    } else {
                        callback(result);
                    }
                })
                .error(function (err) {

                    callback({ success: false, message: err });
                });
        },
        Logout: function (callback) {
            storageService.set('id', '');
            storageService.set('login', '');
            storageService.set('password', '');
            storageService.set('HACToken', '');

            userService.setUser({});

            callback({ success: true });
        }
    }
}]);

homeAutomationApp.factory('authInterceptor', ['storageService', function (storageService) {
    var myInterceptor = {
        request: function (config) {
            config.headers['x-access-token'] = storageService.get('HACToken');
            return config;
        }
    };

    return myInterceptor;
}]);