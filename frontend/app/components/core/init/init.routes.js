/**
 * Frontend client application init module:
 * Routes
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .config(Routing)
    .config(Config);

  Routing.$inject = [
    '$stateProvider',
    'USER_ROLES',
  ];

  function Routing($stateProvider, USER_ROLES) {
    const initState = {
      name: 'init',
      url: '/',
      controller: 'InitController',
      controllerAs: 'init'
    };

    $stateProvider.state(initState);
  }

  // Configuration of providers
  Config.$inject = [
    '$locationProvider',
    '$urlRouterProvider',
  ];

  function Config($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');
  }
}());
