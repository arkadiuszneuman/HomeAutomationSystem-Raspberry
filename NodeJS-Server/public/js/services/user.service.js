homeAutomationApp.factory('userService', ['$http', 'storageService', function ($http, storageService) {

    function handleError(msg, err) {
        return function () { return { success: false, message: msg, error: err } };
    };

    var currentUser = { name: '' };

    return {
        user: function () {

            if (currentUser.name == '') {
                currentUser.name = storageService.get('name');
            }

            return currentUser;
        },

        setUser: function (_user) {
            currentUser.name = _user.name;
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
        Create: function (user) {
            return $http.post('api/users', user).success(function (result) {
                return result;
            })
                .error(handleError('Createing user'));
        }
    };
}]);
