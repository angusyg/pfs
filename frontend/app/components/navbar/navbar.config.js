/**
 * @fileoverview Navbar module config
 */
(function() {
  'use strict';

  angular
    .module('frontend.navbar')
    .config(Config);

  Config.$inject = [
    '$translatePartialLoaderProvider',
  ];

  function Config($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('navbar');
  }
})();
