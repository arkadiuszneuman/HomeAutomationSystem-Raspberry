var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
    laddaProvider.setOption({
        style: 'expand-right'
    });
});

homeAutomationApp.factory('notify', [function () {
    return {
        show: function (options) {
            new PNotify({
                title: options.title,
                text: options.text,
                type: options.type
            });
        }
    }
}]);


homeAutomationApp.factory('storageService', ['$window', function ($window) {

    var authData = { IsLoggedIn: false };

    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        authData
    }
}]);

homeAutomationApp.factory('userService', [function ($http) {

    function handleError(msg, err) {
        return function () { return { success: false, message: msg, error: err } };
    };

    return {
        GetAll: function () {
            return $http.get('api/users/').success(function (users) {
                return users;
            })
                .error(handleError('Get all users'));
        },
        GetById: function (id) {
            return $http.get('api/users/' + id).success(function (user) {
                return user;
            })
                .error(handleError('Get user by id'));
        },
        Create: function (user) {
            return $http.post('api/users', user).success(function (result) {
                return result;
            })
                .error(handleError('Createing user'));
        }
    };
}]);


homeAutomationApp.factory('authService', ['$http','storageService',function ($http, storageService) {

    return {
        Login: function (user,callback) {
            return $http.post('api/authenticate', user)
                .success(function (result) {

                    if (result.success) {
                        storageService.set('name', user.name);
                        storageService.set('password', user.password);
                        storageService.set('HACToken', result.token);

                        callback({ success: true });
                    }else{
                        callback(result);
                    }
                })
                .error(function (err) {

                    callback({ success: false, message: err });
                });
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

homeAutomationApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);
