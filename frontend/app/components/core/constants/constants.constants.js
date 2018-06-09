/**
 * Frontend client application constants module:
 * Constants definition
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.constants')
    .constant('API', {
      URL: 'http://localhost:3000',
      BASE: '/api',
    })
    .constant('APP', {
      HOME_STATE_NAME: 'app',
    })
    .constant('PARAMETERS', {
      TOOLTIP_DURATION: 3000,
      SERVER_LOGGING_ACTIVATED: false,
    });
})();
