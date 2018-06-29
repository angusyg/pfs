/**
 * @ngdoc factory
 * @name authInterceptor
 * @memberof frontend.core.auth
 * @param {service} $q        - AngularJS promise service
 * @param {service} $injector - AngularJS injection service
 * @description Http interceptor to inject if needed JWT token on API server calls and handle authentication API errors
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = [
    '$q',
    '$injector',
  ];

  function AuthInterceptor($q, $injector) {
    return {
      request: request,
      responseError: responseError,
    };

    /**
     * Adds authentication headers on http calls to API server
     * @memberof authInterceptor
     * @param {Object} config - http call config
     * @returns {Object} http call config with authentication headers if needed
     */
    function request(config) {
      const API = $injector.get('API');
      if (config.url.indexOf(`${API.URL}${API.BASE}`) > -1) {
        const authService = $injector.get('authService');
        const SECURITY = $injector.get('SECURITY');
        config.headers[SECURITY.ACCESS_TOKEN_HEADER] = `bearer ${authService.getToken()}`;
        config.headers[SECURITY.REFRESH_TOKEN_HEADER] = authService.getRefreshToken();
      }
      return config;
    }

    /**
     * Broadcasts API http authentication errors
     * @memberof authInterceptor
     * @param {Object} err - http error
     * @returns {Promise.rejected} err as rejected promise
     */
    function responseError(err) {
      if (err.status === $injector.get('HTTP_STATUS_CODE').UNAUTHORIZED) $injector.get('$rootScope').$broadcast($injector.get('AUTH_EVENTS').NOT_AUTHENTICATED, err.config);
      return $q.reject(err);
    }
  }
})();
