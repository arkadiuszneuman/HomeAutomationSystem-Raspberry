homeAutomationApp.factory('userService', ['$http', 'storageService', function ($http, storageService) {

    function handleError(msg, err) {
        return function () { return { success: false, message: msg, error: err } };
    };

    var currentUser = { login: '' };

    return {
        user: function () {

            if (currentUser.login == '') {
                currentUser.login = storageService.get('login');
            }

            return currentUser;
        },

        setUser: function (_user) {
            currentUser.login = _user.login;
        },
        GetAll: function (callback) {
            return $http.get('api/users/').success(function (users) {
                callback(users);
            })
                .error(handleError('Get all users'));
        },
        GetById: function (id) {
            return $http.get('api/users/' + id).success(function (user) {
                return user;
            })
                .error(handleError('Get user by id'));
        },
        Create: function (user,callback) {
            return $http.post('api/users', user).success(function (result) {
                callback(result);
            })
                .error(handleError('Createing user'));
        }
    };
}]);
