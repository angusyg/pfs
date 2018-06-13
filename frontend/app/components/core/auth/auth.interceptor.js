/**
 * Frontend client application auth module;
 * Interceptor to inject if needed JWTToken on secured calls
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$q', '$injector'];

  function AuthInterceptor($q, $injector) {
    return {
      request: request,
      response: response,
      responseError: responseError,
    };

    function request(config) {
      let authService = $injector.get('authService');
      if (authService.isLoggedIn()) {
        let SECURITY = $injector.get('SECURITY');
        config.headers[SECURITY.ACCESS_TOKEN_HEADER] = `bearer ${authService.getToken()}`;
        config.headers[SECURITY.REFRESH_TOKEN_HEADER] = authService.getRefreshToken();
      }
      config.requestTimestamp = new Date().getTime();
      return config;
    }

    function response(response) {
      response.config.requestTime = new Date().getTime() - response.config.requestTimestamp;
      return response;
    }

    function responseError(err) {
      if (err.status === $injector.get('HTTP_STATUS_CODE').UNAUTHORIZED) $injector.get('$rootScope').$broadcast($injector.get('AUTH_EVENTS').NOT_AUTHENTICATED, err.config);
      return $q.reject(err);
    }
  }
})();
