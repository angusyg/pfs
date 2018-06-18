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
      HOME_STATE: 'app',
    })
    .constant('HTTP_STATUS_CODE', {
      OK: 200,
      ACCEPTED: 202,
      NO_CONTENT: 204,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      TOKEN_EXPIRED: 419,
      SERVER_ERROR: 500,
    })
    .constant('PARAMETERS', {
      TOOLTIP_DURATION: 3000,
      SERVER_LOGGING_ACTIVATED: false,
    });
})();
