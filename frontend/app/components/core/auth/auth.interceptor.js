/**
 * Frontend client application auth module;
 * Interceptor to inject if needed JWTToken on secured calls
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

    function responseError(err) {
      if (err.status === $injector.get('HTTP_STATUS_CODE').UNAUTHORIZED) $injector.get('$rootScope').$broadcast($injector.get('AUTH_EVENTS').NOT_AUTHENTICATED, err.config);
      return $q.reject(err);
    }
  }
})();
