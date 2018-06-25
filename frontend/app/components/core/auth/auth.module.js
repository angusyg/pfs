/**
 * Frontend client application auth module
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth', [])
    .run(['authService', (authService) => authService.stateSecurization()]);
})();
