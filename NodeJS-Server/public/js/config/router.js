homeAutomationApp.run(function ($rootScope, $location, $state) {
  $rootScope.$on('$viewContentLoaded', function () {
    initjQuery();
  });
});

homeAutomationApp.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when("", "/receivers");
  $urlRouterProvider.when("/", "/receivers");
  $urlRouterProvider.otherwise("/receivers");

  $stateProvider
    .state('home', {
      url: "",
      templateUrl: "html/index.html",
      abstract: true,
      views: {
        'menu': {
          templateUrl: 'html/partials/menu.html',
        },
        'content': {
          templateUrl: 'html/partials/content.html',
        },
      }
    })

    .state('home.receivers', {
      url: "/receivers",
      views: {
        'main@': {
          templateUrl: 'html/partials/pages/receivers.html',
          controller: 'mainCtrl'
        },
      }
    })
  ;
});