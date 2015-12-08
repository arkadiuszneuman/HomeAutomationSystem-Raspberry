var homeAutomationApp = angular.module('homeautomation', ['angular-ladda', 'ui.router']);

homeAutomationApp.config(function (laddaProvider) {
  laddaProvider.setOption({
    style: 'expand-right'
  });
});