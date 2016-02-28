angular.module('homeautomation').factory('userService', ['$http',function ($http) {

    function handleError(msg,err){
         return function(){return {success:false,message:msg,error:err}};  
    };
   
    return {
        GetAll:function(){
          return $http.get('api/users/').success(function(users){
              return users;
          })
          .error(handleError('Get all users'));
        },
        GetById:function(id){
            return $http.get('api/users/' + id).success(function(user){
              return user;
          })
          .error(handleError('Get user by id'));
        }
    };
}]);
