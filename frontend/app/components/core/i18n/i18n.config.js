/**
 * @ngdoc config
 * @name I18nConfig
 * @memberof frontend.core.i18n
 * @description Configures translate provider
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.i18n')
    .config(I18nConfig);

  /**
   * Dependency injection
   * @type string[]
   */
  I18nConfig.$inject = [
    '$translateProvider',
    '$translatePartialLoaderProvider',
  ];

  /**
   * Sets translate loader, preferred language and reload strategy
   * @param {Object} $translateProvider               - $translate service provider
   * @param {Object} $translatePartialLoaderProvider  - $translatePartialLoaderProvider service provider to partially load translate files
   */
  function I18nConfig($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '/i18n/{part}/{lang}.json',
      loadFailureHandler: 'i18nPartialLoaderErrorHandler',
    });
    $translateProvider.preferredLanguage('fr');
    $translateProvider.forceAsyncReload(true);
  }
})();
