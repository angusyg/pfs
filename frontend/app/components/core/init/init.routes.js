/**
 * @ngdoc config
 * @name InitRoutingConfig
 * @memberof frontend.core.init
 * @description Configures router and location providers
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

  /**
   * Sets html mode and default landing route
   * @param {Object} $locationProvider  - $location service provider to handle browser location
   * @param {Object} $urlRouterProvider - $urlRouter service provider to handle routing
   */
  function InitRoutingConfig($locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');
  }
}());
