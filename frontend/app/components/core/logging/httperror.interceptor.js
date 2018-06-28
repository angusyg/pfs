/**
 * @ngdoc factory
 * @name httpErrorInterceptor
 * @memberof frontend.core.logging
 * @param {service} $q
 * @param {service} $log
 * @description Http error interceptor to send to server logger, errors received from api server calls
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.logging')
    .factory('httpErrorInterceptor', HttpErrorInterceptor);

  /**
   * Dependency injection
   * @type string[]
   */
  HttpErrorInterceptor.$inject = [
    '$q',
    '$log',
  ];

  function HttpErrorInterceptor($q, $log) {
    return {
      responseError: responseError,
    };

    /**
     * Logs http response errors
     * @memberof httpErrorInterceptor
     * @param {Error} err - http error to log
     * @returns {Promise.reject} err as rejected promise
     */
    function responseError(err) {
      if (err.status >= 400 && err.status < 600) $log.error(`Received ${err.status} on request ${err.data.reqId}: ${JSON.stringify(err.config)}`);
      return $q.reject(err);
    }
  }
}());
