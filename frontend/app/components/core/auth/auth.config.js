/**
 * @ngdoc config
 * @name AuthConfig
 * @memberof frontend.core.auth
 * @description Authentication module configuration
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .config(AuthConfig);

  /**
   * Dependency injection
   * @type string[]
   */
  AuthConfig.$inject = [
    '$httpProvider',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    'SECURITY',
    'TRANSLATE',
  ];

  /**
   * Adds auth interceptor to $http service and configures $translate service
   * @param {Object} $httpProvider                    - $http service provider
   * @param {Object} $translateProvider               - $translate service provider
   * @param {Object} $translatePartialLoaderProvider  - $translatePartialLoaderProvider service provider to partially load translate files
   * @param {Object} SECURITY                         - Security constants
   * @param {Object} TRANSLATE                        - Translate constants
   */
  function AuthConfig($httpProvider, $translateProvider, $translatePartialLoaderProvider, SECURITY, TRANSLATE) {
    if (SECURITY.ACTIVATED) $httpProvider.interceptors.push('authInterceptor');
    $translateProvider.translations('fr', TRANSLATE.FR);
    $translateProvider.translations('en', TRANSLATE.EN);
    $translatePartialLoaderProvider.addPart('core');
  }
})();
