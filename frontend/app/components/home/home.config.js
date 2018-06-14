/**
 * @fileoverview Home module config
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .config(Config);

  Config.$inject = [
    '$translateProvider',
    '$translatePartialLoaderProvider',
    'TRANSLATE',
  ];

  function Config($translateProvider, $translatePartialLoaderProvider, TRANSLATE) {
    $translateProvider.translations('fr', TRANSLATE.FR);
    $translateProvider.translations('en', TRANSLATE.EN);
    $translatePartialLoaderProvider.addPart('home');
  }
})();
