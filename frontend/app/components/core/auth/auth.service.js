/**
 * Frontend client application auth module;
 * Service to handle authentication (login, logout, JWTToken storage and refresh)
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authService', AuthService)
    .run(['authService', (authService) => authService.stateSecurization()]);

  AuthService.$inject = ['$http', 'store', '$q', '$rootScope', '$transitions', '$timeout', 'helper', 'SECURITY', 'AUTH_EVENTS', 'API'];

  function AuthService($http, store, $q, $rootScope, $transitions, $timeout, helper, SECURITY, AUTH_EVENTS, API) {
    const LOGIN_ENDPOINT = `${API.URL}${API.BASE}/login`;
    const LOGOUT_ENDPOINT = `${API.URL}${API.BASE}/logout`;
    const REFRESH_ENDPOINT = `${API.URL}${API.BASE}/refresh`;
    let refreshRequestLoading = false;
    let refreshTimerRunning = false;

    return {
      getToken: getToken,
      getRefreshToken: getRefreshToken,
      isAuthorized: isAuthorized,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      refreshToken: refreshToken,
      stateSecurization: stateSecurization
    };

    function getToken() {
      return store.get(SECURITY.ACCESS_TOKEN);
    }

    function getRefreshToken() {
      return store.get(SECURITY.REFRESH_TOKEN);
    }

    function isAuthorized(authorizedRoles) {
      if (!SECURITY.ACTIVATED) return true;
      if (!isLoggedIn()) return false;
      if (!Array.isArray(authorizedRoles)) authorizedRoles = [authorizedRoles];
      let userRoles = helper.getUserRolesFromToken(getToken());
      return authorizedRoles.some(role => userRoles.indexOf(role) >= 0);
    }

    function isLoggedIn() {
      return store.get(SECURITY.ACCESS_TOKEN) !== null;
    }

    function login(user) {
      return $http.post(LOGIN_ENDPOINT, user)
        .then((response) => {
          store.set(SECURITY.ACCESS_TOKEN, response.data.accessToken);
          store.set(SECURITY.ACCESS_TOKEN_TIMESTAMP, new Date.now());
          store.set(SECURITY.REFRESH_TOKEN, response.data.refreshToken);
          putRefreshTimer();
          return $q.resolve();
        })
        .catch(err => $q.reject(err));
    }

    function logout() {
      return $http.get(LOGOUT_ENDPOINT)
        .then(() => {
          cleanStore();
          return $q.resolve();
        })
        .catch(err => $q.reject(err));
    }

    function refreshToken() {
      if (!refreshRequestLoading) {
        refreshRequestLoading = true;
        return $http.get(REFRESH_ENDPOINT)
          .then((response) => {
            store.set(SECURITY.ACCESS_TOKEN, response.data.accessToken);
            return $q.resolve(response.data.accessToken);
          })
          .catch(err => $q.reject(err))
          .finally(() => refreshRequestLoading = false);
      } else $q.reject(new Error('Concurrent refresh token request'));
    }

    function stateSecurization() {
      if (SECURITY.ACTIVATED) {
        $transitions.onStart({
          to: '*'
        }, (trans) => {
          const toState = trans.$to();
          if (toState.data && toState.data.authorizedRoles) {
            if (!isLoggedIn()) {
              $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, trans);
              return false;
            } else if (!isAuthorized(toState.data.authorizedRoles)) {
              $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHORIZED, trans);
              return false;
            }
          }
        });
      }
    }

    function cleanStore() {
      store.remove(SECURITY.ACCESS_TOKEN);
      store.remove(SECURITY.REFRESH_TOKEN);
      store.remove(SECURITY.ACCESS_TOKEN_TIMESTAMP);
    }

    function putRefreshTimer() {
      let token = store.get(SECURITY.ACCESS_TOKEN);
      let refresh = store.get(SECURITY.REFRESH_TOKEN);
      if (token && refresh) {
        if (!refreshTimerRunning) {
          refreshToken()
            .then((token) => {
              let expirationDurationMs = helper.getTokenExpirationDuration(token) * 1000;
              let timer = Math.floor(expirationDurationMs * 0.9);
              $timeout(() => putRefreshTimer(), timer);
              refreshTimerRunning = true;
            })
            .catch(err => {
              cleanStore();
              $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, true);
            });
        } else {

        }
      }
    }

    putRefreshTimer();
  }
})();
