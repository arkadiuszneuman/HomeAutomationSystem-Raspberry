var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router', 'angular-cron-jobs']);

homeAutomationApp.config(function (laddaProvider) {
  laddaProvider.setOption({
    style: 'expand-right'
  });
});