(function() {
  'use strict';

  angular
    .module('frontend.core.init', [
      'frontend.core.auth',
      'frontend.core.constants',
      'ui.router',
    ])
    .run(['initService', (initService) => initService.stateInitialization()]);
}());
