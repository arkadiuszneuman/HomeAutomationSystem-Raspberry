
angular.module('homeautomation').factory('userService', ['$http', function ($http) {

    return {
        logIn: function (user) {
            return $http.post('api/authenticate/', user);
        }
    }
}]);