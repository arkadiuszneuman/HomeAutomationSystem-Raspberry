
homeAutomationApp.factory('authService', ['$http','$window', function ($http,$window) {

    function setToLocalStorage(key,value){
         $window.localStorage[key] = value;
    };
    
    return {
        on:function(s){
            
        },
        Login: function (user) {
            return $http.post('api/authenticate/', user)
                .success(function(result){
                    
                setToLocalStorage('name',result.name);
                setToLocalStorage('password',result.password);
                setToLocalStorage('HACToken',result.token);
                
                return {success:true};
            })
            .error(function(err){
               
               return {success:false,message:err}; 
            });
        }
    }
}]);

homeAutomationApp.factory('authInterceptor',['authService',function(authService){
    var myInterceptor = {
        request:function(config){
           config.headers['x-access-token'] = authService.get('HACToken');
           return config;
        }
    };
    
    return myInterceptor;
}]);

homeAutomationApp.config(['$httpProvider',function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor');
}]);

// homeAutomationApp.factory('authService', ['$window', function($window) {
//     
//    var authData ={IsLoggedIn:false};
//     
//   return {
//     set: function(key, value) {
//       $window.localStorage[key] = value;
//     },
//     get: function(key, defaultValue) {
//       return $window.localStorage[key] || defaultValue;
//     },
//     setObject: function(key, value) {
//       $window.localStorage[key] = JSON.stringify(value);
//     },
//     getObject: function(key) {
//       return JSON.parse($window.localStorage[key] || '{}');
//     },
//     authData
//   }
// }]);