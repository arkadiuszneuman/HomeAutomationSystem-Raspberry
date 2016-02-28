
angular.module('homeautomation').factory('authService', ['$http', function ($http) {

    return {
        logIn: function (user) {
            return $http.post('api/authenticate/', user);
        }
    }
}]);