/**
 * Frontend client application auth module;
 * Service to handle authentication (login, logout, JWTToken storage and refresh)
 */
/**
 * @ngdoc factory
 * @name authService
 * @memberof frontend.core.auth
 * @description Authentication service
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .factory('authService', AuthService);

  /**
   * Dependency injection
   * @type string[]
   */
  AuthService.$inject = [
    '$http',
    'store',
    '$q',
    '$rootScope',
    '$transitions',
    '$timeout',
    'helper',
    'base64',
    'SECURITY',
    'AUTH_EVENTS',
    'AUTH_EVENTS_TYPE',
    'API',
    'USER_ROLES',
  ];

  function AuthService($http, store, $q, $rootScope, $transitions, $timeout, helper, base64, SECURITY, AUTH_EVENTS, AUTH_EVENTS_TYPE, API, USER_ROLES) {
    const LOGIN_ENDPOINT = `${API.URL}${API.BASE}/login`;
    const LOGOUT_ENDPOINT = `${API.URL}${API.BASE}/logout`;
    const REFRESH_ENDPOINT = `${API.URL}${API.BASE}/refresh`;
    const VALIDATE_ENDPOINT = `${API.URL}${API.BASE}/validate`;
    let refreshTimerRunning = false;
    let refreshTimer = null;

    return {
      getToken: getToken,
      getRefreshToken: getRefreshToken,
      getUserId: getUserId,
      getUserLogin: getUserLogin,
      getUserRoles: getUserRoles,
      initialize: initialize,
      isAuthorized: isAuthorized,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      refreshToken: refreshToken,
      stateSecurization: stateSecurization,
    };

    /**
     * Cleans store to remove authentication infos
     */
    function cleanStore() {
      store.remove(SECURITY.ACCESS_TOKEN);
      store.remove(SECURITY.REFRESH_TOKEN);
      store.remove(SECURITY.ACCESS_TOKEN_TIMESTAMP);
    }

    /**
     * Disconnects current user, cleans store, removes
     * refresh timer and broadcasts disconnect event
     */
    function disconnect() {
      cleanStore();
      $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, true);
      $timeout.cancel(refreshTimer);
      refreshTimerRunning = false;
    }

    /**
     * Returns refresh token
     * @memberof authService
     * @returns {string} user refresh token
     */
    function getRefreshToken() {
      return store.get(SECURITY.REFRESH_TOKEN);
    }

    /**
     * Returns access token
     * @memberof authService
     * @returns {string} user access token
     */
    function getToken() {
      return store.get(SECURITY.ACCESS_TOKEN);
    }

    /**
     * Calculates expiry time of access token
     * @param {string} token - user access token
     * @returns {int} expiraty time in ms
     */
    function getTokenExpiryTime(token) {
      const payload = getUserInfos(token);
      return payload.exp - payload.iat;
    }

    /**
     * Returns connected user id from access token
     * @memberof authService
     * @returns {string} user id or null if access token could not be parsed
     */
    function getUserId() {
      const token = getToken();
      if (isWellformedToken(token)) return getUserInfos(token).id;
      return null;
    }

    /**
     * Returns user payload from access token
     * @param {string} token - user access token
     * @returns {Object} user payload or null if access token could not be parsed
     */
    function getUserInfos(token) {
      if (isWellformedToken(token)) return JSON.parse(base64.urlDecodeBase64(token.split('.')[1]));
      return null;
    }

    /**
     * Returns connected user login from access token
     * @memberof authService
     * @param {string} token - user access token
     * @returns {Object} user login or null if access token could not be parsed
     */
    function getUserLogin() {
      const token = getToken();
      if (isWellformedToken(token)) return getUserInfos(token).login;
      return null;
    }

    /**
     * Returns connected user roles from access token
     * @memberof authService
     * @returns {Object} user roles or null if access token could not be parsed
     */
    function getUserRoles() {
      const token = getToken();
      if (isWellformedToken(token)) return getUserInfos(token).roles;
      return null;
    }

    /**
     * Initializes auth service (validates authentication
     * and puts auto authentication refresh timer)
     * @memberof authService
     * @returns {Promise} initialization status
     */
    function initialize() {
      if (SECURITY.ACTIVATED) return isLoggedIn();
      return $q.resolve();
    }

    /**
     * Checks if connected user is authorized against a list of roles
     * and puts auto authentication refresh timer)
     * @memberof authService
     * @param {string[]} authorizedRoles - array of roles to test user roles against
     * @returns {boolean} true if user has a role included in authorizedRoles
     */
    function isAuthorized(authorizedRoles) {
      if (!SECURITY.ACTIVATED) return true;
      if (getToken() === null) return false;
      if (authorizedRoles === USER_ROLES.ALL) return true;
      if (!Array.isArray(authorizedRoles)) authorizedRoles = [authorizedRoles];
      const userRoles = getUserRoles();
      return authorizedRoles.some(role => userRoles.indexOf(role) >= 0);
    }

    /**
     * Checks if connected user is still logged in (with a valid access token)
     * @memberof authService
     * @returns {Promise} resolved if authentication is still valid, rejected otherwise
     */
    function isLoggedIn() {
      if (getToken() !== null) {
        if (refreshTimerRunning) return $q.resolve()
        else return $http.get(VALIDATE_ENDPOINT)
          .then(() => putRefreshTimer().then(() => $q.resolve()))
          .catch((err) => {
            cleanStore();
            return $q.reject();
          });
      } else return $q.reject();
    }

    /**
     * Checks if a token is well formed against JWT schema (3 parts)
     * @param {string} token - token to test
     * @returns {boolean} true is token is well formed
     */
    function isWellformedToken(token) {
      if (helper.isBlank(token)) return false;
      if (token.split('.').length !== 3) return false;
      return true;
    }

    /**
     * Logs in on API server a user with his login and password
     * @memberof authService
     * @param {Object} user - user login infos
     * @returns {Promise} resolved if authenticated, rejected otherwise
     */
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

    /**
     * Logs out a user on API server
     * @memberof authService
     * @returns {Promise} resolved if logged out, rejected otherwise
     */
    function logout() {
      return $http.get(LOGOUT_ENDPOINT)
        .then(() => {
          disconnect();
          return $q.resolve();
        })
        .catch(err => $q.reject(err));
    }

    /**
     * Tries to put if necessary an auto access token refresh timer
     * @returns {Promise} resolved if access auto refresh is not
     * necessary or successfully put, rejected otherwise
     */
    function putRefreshTimer() {
      const defer = $q.defer();
      if (SECURITY.ACTIVATED) {
        if (store.get(SECURITY.REFRESH_TOKEN)) {
          if (!refreshTimerRunning) {
            refreshToken()
              .catch(err => disconnect())
              .finally(() => defer.resolve());
          } else defer.resolve();
        } else defer.resolve();
      } else defer.resolve();
      return defer.promise;
    }

    /**
     * Puts an auto access token refresh timer according to token expiry time
     * @returns {Promise} resolved if access auto refresh is not
     * necessary or successfully put, rejected otherwise
     */
    function putTimer(token) {
      if (!refreshTimerRunning) {
        const expiryTimeMs = getTokenExpiryTime(token) * 1000;
        refreshTimer = $timeout(() => {
          refreshTimerRunning = false;
          putRefreshTimer();
        }, Math.floor(expiryTimeMs * 0.75));
        refreshTimerRunning = true;
      }
    }

    /**
     * Refreshs access token on API server
     * @memberof authService
     * @returns {Promise} resolved with access token if it was refreshed, rejected otherwise
     */
    function refreshToken() {
      return $http.get(REFRESH_ENDPOINT)
        .then((response) => {
          store.set(SECURITY.ACCESS_TOKEN, response.data.accessToken);
          putTimer(response.data.accessToken);
          return $q.resolve(response.data.accessToken);
        })
        .catch(err => $q.reject(err));
    }

    /**
     * Checks before transition to an app state, if authentication and special
     * roles are needed and if user can access to the state  
     * @memberof authService
     * @returns {boolean} true if transition is authorized, false otherwise
     */
    function stateSecurization() {
      if (SECURITY.ACTIVATED) {
        $transitions.onStart({ to: '**' }, (trans) => {
          const toState = trans.to();
          if (toState.data && toState.data.authorizedRoles) {
            return isLoggedIn()
              .then(() => {
                if (!isAuthorized(toState.data.authorizedRoles)) {
                  $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHORIZED, {
                    type: AUTH_EVENTS_TYPE.STATE_TRANSITION,
                    data: trans,
                  });
                  return false;
                } else return true;
              })
              .catch((err) => {
                $rootScope.$broadcast(AUTH_EVENTS.NOT_AUTHENTICATED, {
                  type: AUTH_EVENTS_TYPE.STATE_TRANSITION,
                  data: trans,
                });
                return false;
              });
          } else return true;
        });
      }
    }
  }
})();
