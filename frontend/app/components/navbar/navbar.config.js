/**
 * @ngdoc config
 * @name NavbarController
 * @memberof frontend.navbar
 * @param {service} $translatePartialLoaderProvider - $translatePartialLoader service provider
 * @description Navbar component config. Adds navbar part to translate loader.
 */
(function() {
  'use strict';

  angular
    .module('frontend.navbar')
    .config(NavbarConfig);

  NavbarConfig.$inject = ['$translatePartialLoaderProvider'];

  function NavbarConfig($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('navbar');
  }
})();
