/**
 * Frontend client application logging module:
 * Config
 * - Log decorator to send every client log to server
 * - Exception handler to log uncatched exceptions
 */

/**
 * @ngdoc config
 * @name LogDecorator
 * @memberof frontend.core.logging
 * @description Logger decorator to send client log to server
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.logging')
    .config(LogDecorator);

  /**
   * Dependency injection
   * @type string[]
   */
  LogDecorator.$inject = [
    '$provide',
    'PARAMETERS',
    'API',
  ];

  function LogDecorator($provide, PARAMETERS, API) {
    if (PARAMETERS.SERVER_LOGGING_ACTIVATED) {
      DecoratorServer.$inject = [
        '$delegate',
        '$window',
      ];

      /**
       * Log decorator to send every client log to server
       * @param {Object} $delegate - $log service to decorate
       * @returns {Object} decorated $delegate logging service
       */
      function DecoratorServer($delegate) {
        const levels = ['debug', 'info', 'warn', 'error'];
        levels.forEach(level => {
          const original = $delegate[level];
          $delegate[level] = () => {
            const message = Array.prototype.slice.call(arguments);
            original(...arguments);
            $.ajax({
              type: 'POST',
              url: `${API.URL}${API.BASE}/log/${level}`,
              contentType: 'application/json',
              data: angular.toJson({
                url: $window.location.href,
                message,
              }),
            });
          };
        });
        return $delegate;
      }

      $provide.decorator('$log', DecoratorServer);
    }
  }
})();

/**
 * @ngdoc config
 * @name ExceptionHandlerDecorator
 * @memberof frontend.core.logging
 * @description Exception handler decorator to log uncaught errors
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.logging')
    .config(ExceptionHandlerDecorator);

  /**
   * Dependency injection
   * @type string[]
   */
  ExceptionHandlerDecorator.$inject = ['$provide'];

  function ExceptionHandlerDecorator($provide) {
    ExceptionHandler.$inject = [
      '$delegate',
      '$log',
    ];

    /**
     * Exception handler decorator to send to $log service uncaught exception
     * @param {Object} $delegate - $exceptionHandler service to decorate
     * @param {Object} $log - $log service
     * @returns {function} function to log exception
     */
    function ExceptionHandler($delegate, $log) {
      return (exception, cause) => $log.error(exception, cause);
    }

    $provide.decorator('$exceptionHandler', ExceptionHandler);
  }
})();

/**
 * @ngdoc config
 * @name HttpLoggingConfig
 * @memberof frontend.core.logging
 * @description Http error interceptor configuration
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.logging')
    .config(HttpLoggingConfig);

  /**
   * Dependency injection
   * @type string[]
   */
  HttpLoggingConfig.$inject = ['$httpProvider'];

  /**
   * Adds http error interceptor to $http service
   * @param {Object} $httpProvider - $http service provider
   */
  function HttpLoggingConfig($httpProvider) {
    $httpProvider.interceptors.push('httpErrorInterceptor');
  }
})();
