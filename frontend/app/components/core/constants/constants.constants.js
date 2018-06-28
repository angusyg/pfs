(function() {
  'use strict';

  angular
    .module('frontend.core.constants')
    /**
     * @ngdoc constant
     * @name API
     * @memberof frontend.core.constants
     * @description API server URL and path
     */
    .constant('API', {
      /**
       * API server URL
       * @memberof API
       * @type string
       */
      URL: 'http://localhost:3000', //TODO Change host to real value
      /**
       * API base path
       * @memberof API
       * @type string
       */
      BASE: '/api',
    })
    /**
     * @ngdoc constant
     * @name APP
     * @memberof frontend.core.constants
     * @description App default configuration
     */
    .constant('APP', {
      /**
       * Default css app theme
       * @memberof APP
       * @type string
       */
      DEFAULT_THEME: 'theme-default',
    })
    /**
     * @ngdoc constant
     * @name HTTP_STATUS_CODE
     * @memberof frontend.core.constants
     * @description API Http status code map
     */
    .constant('HTTP_STATUS_CODE', {
      /**
       * Http Ok status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      OK: 200,
      /**
       * Http accepted request status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      ACCEPTED: 202,
      /**
       * Http no content in response status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      NO_CONTENT: 204,
      /**
       * Http unatuhorized error status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      UNAUTHORIZED: 401,
      /**
       * Http forbidden error status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      FORBIDDEN: 403,
      /**
       * Http JWT token expired error status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      TOKEN_EXPIRED: 419,
      /**
       * Http internal server error status code
       * @memberof HTTP_STATUS_CODE
       * @type int
       */
      SERVER_ERROR: 500,
    })
    /**
     * @ngdoc constant
     * @name PARAMETERS
     * @memberof frontend.core.constants
     * @description Global app parameters
     */
    .constant('PARAMETERS', {
      /**
       * Duration in ms of ui tooltip
       * @memberof PARAMETERS
       * @type int
       */
      TOOLTIP_DURATION: 3000,
      /**
       * Server logging activation (true = activated)
       * @memberof PARAMETERS
       * @type boolean
       */
      SERVER_LOGGING_ACTIVATED: false,
    });
})();
