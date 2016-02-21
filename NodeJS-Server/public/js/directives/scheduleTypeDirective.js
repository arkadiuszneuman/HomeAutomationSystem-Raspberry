homeAutomationApp.directive('scheduleType', function() {
  return {
    restrict: 'E',
    scope: {
      schedule: '='
    },
    templateUrl: 'html/partials/directives/scheduletypes/scheduleTypeDirective.html'
  };
});
