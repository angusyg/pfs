/**
 * Frontend client application init module:
 * Routes
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .config(Config);

  // Configuration of providers
  Config.$inject = ['$locationProvider'];

  function Config($locationProvider) {
    $locationProvider.html5Mode(false);
  }
}());
