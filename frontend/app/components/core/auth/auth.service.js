/**
 * Frontend client application auth module;
 * Service to handle authentication (login, logout, JWTToken storage and refresh)
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authService', AuthService);

  AuthService.$inject = [
    '$http',
    'store',
    '$q',
    '$rootScope',
    '$transitions',
    '$timeout',
    'helper',
    'SECURITY',
    'AUTH_EVENTS',
    'AUTH_EVENTS_TYPE',
    'API',
    'USER_ROLES',
  ];

  function AuthService($http, store, $q, $rootScope, $transitions, $timeout, helper, SECURITY, AUTH_EVENTS, AUTH_EVENTS_TYPE, API, USER_ROLES) {
    const LOGIN_ENDPOINT = `${API.URL}${API.BASE}/login`;
    const LOGOUT_ENDPOINT = `${API.URL}${API.BASE}/logout`;
    const REFRESH_ENDPOINT = `${API.URL}${API.BASE}/refresh`;
    let refreshTimerRunning = false;

    return {
      getToken: getToken,
      getRefreshToken: getRefreshToken,
      initialize: initialize,
      isAuthorized: isAuthorized,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      refreshToken: refreshToken,
      stateSecurization: stateSecurization
    };

    function cleanStore() {
      store.remove(SECURITY.ACCESS_TOKEN);
      store.remove(SECURITY.REFRESH_TOKEN);
      store.remove(SECURITY.ACCESS_TOKEN_TIMESTAMP);
    }

    function getToken() {
      return store.get(SECURITY.ACCESS_TOKEN);
    }

    function getRefreshToken() {
      return store.get(SECURITY.REFRESH_TOKEN);
    }

    function initialize() {
      return putRefreshTimer();
    }

    function isAuthorized(authorizedRoles) {
      if (!SECURITY.ACTIVATED) return true;
      if (!isLoggedIn()) return false;
      if (authorizedRoles === USER_ROLES.ALL) return true;
      if (!Array.isArray(authorizedRoles)) authorizedRoles = [authorizedRoles];
      const userRoles = helper.getUserRolesFromToken(getToken());
      return authorizedRoles.some(role => userRoles.indexOf(role) >= 0);
    }

    function isLoggedIn() {
      return store.get(SECURITY.ACCESS_TOKEN) !== null;
    }

    function login(user) {
      return $http.post(LOGIN_ENDPOINT, user)
        .then((response) => {
          store.set(SECURITY.ACCESS_TOKEN, response.data.accessToken);
          store.set(SECURITY.REFRESH_TOKEN, response.data.refreshToken);
          putTimer(response.data.accessToken);
          return $q.resolve();
        })
        .catch(err => $q.reject(err));
    }

    function putRefreshTimer() {
      const defer = $q.defer();
      if (SECURITY.ACTIVATED) {
        const token = store.get(SECURITY.ACCESS_TOKEN);
        const refresh = store.get(SECURITY.REFRESH_TOKEN);
        if (token && refresh) {
          if (!refreshTimerRunning) {
            refreshToken()
              .catch(err => {
                cleanStore();
                $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, true);
                refreshTimerRunning = false;
              })
              .finally(() => defer.resolve());
          } else defer.resolve();
        } else {
          refreshTimerRunning = false;
          defer.resolve();
        }
      } else {
        cleanStore();
        refreshTimerRunning = false;
        defer.resolve();
      }
      return defer.promise;
    }

    function putTimer(token) {
      if (!refreshTimerRunning) {
        const expirationDurationMs = helper.getTokenExpirationDuration(token) * 1000;
        $timeout(() => {
          refreshTimerRunning = false;
          putRefreshTimer();
        }, Math.floor(expirationDurationMs * 0.9));
        refreshTimerRunning = true;
      }
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
      return $http.get(REFRESH_ENDPOINT)
        .then((response) => {
          store.set(SECURITY.ACCESS_TOKEN, response.data.accessToken);
          putTimer(response.data.accessToken);
          return $q.resolve(response.data.accessToken);
        })
        .catch(err => $q.reject(err));
    }

    function stateSecurization() {
      if (SECURITY.ACTIVATED) {
        $transitions.onStart({ to: '**' }, (trans) => {
          const toState = trans.to();
          if (toState.data && toState.data.authorizedRoles) {
            if (!isLoggedIn()) {
              $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, {
                type: AUTH_EVENTS_TYPE.STATE_TRANSITION,
                data: trans,
              });
              return false;
            } else if (!isAuthorized(toState.data.authorizedRoles)) {
              $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHORIZED, {
                type: AUTH_EVENTS_TYPE.STATE_TRANSITION,
                data: trans,
              });
              return false;
            }
            return true;
          }
        });
      }
    }
  }
})();
