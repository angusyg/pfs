/**
 * @ngdoc module
 * @name frontend.core.auth
 * @memberof frontend.core
 * @description Core authentication module
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth', [])
    .run(['authService', (authService) => authService.stateSecurization()]);
})();
