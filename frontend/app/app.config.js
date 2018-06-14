(function() {
  angular
    .module('frontend')
    .config(Config);

  // Configuration of providers

  Config.$inject = ['$urlRouterProvider'];

  function Config($urlRouterProvider) {
    $urlRouterProvider.otherwise('/app');
  }
}());
