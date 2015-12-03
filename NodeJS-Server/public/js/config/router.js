homeAutomationApp.run(function($rootScope, $location, $state) {
    $rootScope.$on('$viewContentLoaded', function() {
        initjQuery();
    });
});

homeAutomationApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "html/index.html",
      views: {
        'menu': {
          templateUrl: 'html/partials/menu.html',
        },
      }
    })

;
});