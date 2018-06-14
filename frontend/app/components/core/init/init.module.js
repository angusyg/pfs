(function() {
  'use strict';

  angular
    .module('frontend.core.init', [
      'frontend.core.auth',
      'ui.router',
    ])
    .run(['initService', (initService) => initService.stateInitialization()]);
}());
