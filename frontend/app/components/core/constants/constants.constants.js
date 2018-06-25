/**
 * Frontend client application constants module:
 * Constants definition
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.constants')
    .constant('API', {
      URL: 'http://localhost:3000', //TODO Change host to real value
      BASE: '/api',
    })
    .constant('APP', {
      DEFAULT_THEME: 'theme-default',
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
