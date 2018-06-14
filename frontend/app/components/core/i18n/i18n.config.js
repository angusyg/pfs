/**
 * Frontend client application internationalization module;
 * Translation provider configuration
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.i18n')
    .config(Config);

  Config.$inject = [
    '$translateProvider',
    '$translatePartialLoaderProvider',
  ];

  function Config($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '/i18n/{part}/{lang}.json',
      loadFailureHandler: 'i18nPartialLoaderErrorHandler',
    });
    $translateProvider.preferredLanguage('fr');
    $translateProvider.forceAsyncReload(true);
  }
})();
