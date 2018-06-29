/**
 * @ngdoc config
 * @name HomeConfig
 * @memberof frontend.home
 * @param {service} $translatePartialLoaderProvider - $translatePartialLoader service provider
 * @description  Home component config. Adds home part to translate loader.
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .config(HomeConfig);

  HomeConfig.$inject = ['$translatePartialLoaderProvider'];

  function HomeConfig($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('home');
  }
})();
