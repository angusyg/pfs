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
    let refreshRequestLoading = false;

    return {
      request: request,
      responseError: responseError,
    };

    function request(config) {
      let authService = $injector.get('authService');
      if (authService.isLoggedIn()) {
        let SECURITY = $injector.get('SECURITY');
        config.headers[SECURITY.ACCESS_TOKEN_HEADER] = `bearer ${authService.getToken()}`;
        config.headers[SECURITY.REFRESH_TOKEN_HEADER] = authService.getRefreshToken();
      }
      return config;
    }

    function responseError(err) {
      let HTTP_STATUS_CODE = $injector.get('HTTP_STATUS_CODE');
      if (err.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        let $rootScope = $injector.get('$rootScope');
        let AUTH_EVENTS = $injector.get('AUTH_EVENTS');
        $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, err.config);
        return $q.reject(err);
      } else if (err.status === HTTP_STATUS_CODE.TOKEN_EXPIRED) {
        let authService = $injector.get('authService');
        return authService.refreshToken()
          .catch(err => $q.reject(err))
          .then(() => {
            let SECURITY = $injector.get('SECURITY');
            err.config.headers[SECURITY.ACCESS_TOKEN_HEADER] = `bearer ${authService.getToken()}`;
            return $injector.get('$http')(err.config)
              .catch(err => $q.reject(err))
              .then(response => $q.resolve(response));
          });
      } else return $q.reject(err);
    }
  }
})();
