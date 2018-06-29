/**
 * @ngdoc config
 * @name InitRoutingConfig
 * @memberof frontend.core.init
 * @param {service} $locationProvider  - $location service provider to handle browser location
 * @param {service} $urlRouterProvider - $urlRouter service provider to handle routing
 * @description Configures router and location providers. Sets html mode and default landing route
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .config(InitRoutingConfig);

  InitRoutingConfig.$inject = [
    '$locationProvider',
    '$urlRouterProvider',
  ];

  function InitRoutingConfig($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');
  }
}());
