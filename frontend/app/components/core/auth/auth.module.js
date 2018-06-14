/**
 * Frontend client application auth module
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth', [
      'frontend.core.constants',
      'frontend.core.i18n',
      'frontend.core.services',
      'angular-storage',
      'ngAnimate',
      'ngMessages',
      'pascalprecht.translate',
      'ui.bootstrap',
    ])
    .run(['authService', (authService) => authService.stateSecurization()]);
})();
