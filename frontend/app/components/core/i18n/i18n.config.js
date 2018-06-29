/**
 * @ngdoc config
 * @name I18nConfig
 * @memberof frontend.core.i18n
 * @param {service} $translateProvider               - $translate service provider
 * @param {service} $translatePartialLoaderProvider  - $translatePartialLoaderProvider service provider to partially load translate files
 * @description Configures translate provider. Sets translate loader, preferred language and reload strategy
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.i18n')
    .config(I18nConfig);

  I18nConfig.$inject = [
    '$translateProvider',
    '$translatePartialLoaderProvider',
  ];

  function I18nConfig($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '/i18n/{part}/{lang}.json',
      loadFailureHandler: 'i18nPartialLoaderErrorHandler',
    });
    $translateProvider.preferredLanguage('fr');
    $translateProvider.forceAsyncReload(true);
  }
})();
