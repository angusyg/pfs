/**
 * @ngdoc config
 * @name AuthConfig
 * @memberof frontend.core.auth
 * @param {service} $httpProvider                    - $http service provider
 * @param {service} $translateProvider               - $translate service provider
 * @param {service} $translatePartialLoaderProvider  - $translatePartialLoader service provider (partially load translate files)
 * @param {service} SECURITY                         - Security constants
 * @param {service} TRANSLATE                        - Translate constants
 * @description Authentication module configuration. Adds auth interceptor to $http service and configures $translate service
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .config(AuthConfig);

  AuthConfig.$inject = [
    '$httpProvider',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    'SECURITY',
    'TRANSLATE',
  ];

  function AuthConfig($httpProvider, $translateProvider, $translatePartialLoaderProvider, SECURITY, TRANSLATE) {
    if (SECURITY.ACTIVATED) $httpProvider.interceptors.push('authInterceptor');
    $translateProvider.translations('fr', TRANSLATE.FR);
    $translateProvider.translations('en', TRANSLATE.EN);
    $translatePartialLoaderProvider.addPart('core');
  }
})();
