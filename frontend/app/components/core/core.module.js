(function() {
  'use strict';

  angular
    .module('frontend.core', [
      'angular-storage',
      'ngAnimate',
      'ngMessages',
      'ngResource',
      'pascalprecht.translate',
      'ui.bootstrap',
      'ui.router',
      'frontend.core.auth',
      'frontend.core.constants',
      'frontend.core.i18n',
      'frontend.core.init',
      'frontend.core.logging',
      'frontend.core.services',
    ]);
})();
