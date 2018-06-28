(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    /**
     * @ngdoc constant
     * @name SECURITY
     * @memberof frontend.core.auth
     * @description Security configuration
     */
    .constant('SECURITY', {
      /**
       * Security activation parameter
       * @memberof SECURITY
       * @type boolean
       */
      ACTIVATED: true,
      /**
       * Authentication access token storage key
       * @memberof SECURITY
       * @type string
       */
      ACCESS_TOKEN: 'JWTToken',
      /**
       * Authentication refresh token storage key
       * @memberof SECURITY
       * @type string
       */
      REFRESH_TOKEN: 'RefreshToken',
      /**
       * Authentication access token header name
       * @memberof SECURITY
       * @type string
       */
      ACCESS_TOKEN_HEADER: 'authorization',
      /**
       * Authentication refresh token header name
       * @memberof SECURITY
       * @type string
       */
      REFRESH_TOKEN_HEADER: 'refresh',
    })
    /**
     * @ngdoc constant
     * @name USER_ROLES
     * @memberof frontend.core.auth
     * @description Possible user roles from API server
     */
    .constant('USER_ROLES', {
      /**
       * Validates any roles
       * @memberof USER_ROLES
       * @type string
       */
      ALL: 'ALL',
      /**
       * Admin role
       * @memberof USER_ROLES
       * @type string
       */
      ADMIN: 'ADMIN',
      /**
       * Simple user role
       * @memberof USER_ROLES
       * @type string
       */
      USER: 'USER',
    })
    /**
     * @ngdoc constant
     * @name AUTH_EVENTS
     * @memberof frontend.core.auth
     * @description Authentication events
     */
    .constant('AUTH_EVENTS', {
      /**
       * Login succes event
       * @memberof AUTH_EVENTS
       * @type string
       */
      LOGIN_SUCCESS: 'auth-login-success',
      /**
       * Login failed event
       * @memberof AUTH_EVENTS
       * @type string
       */
      LOGIN_FAILED: 'auth-login-failed',
      /**
       * Logout success event
       * @memberof AUTH_EVENTS
       * @type string
       */
      LOGOUT_SUCCESS: 'auth-logout-success',
      /**
       * Token expired event
       * @memberof AUTH_EVENTS
       * @type string
       */
      TOKEN_EXPIRED: 'auth-token-expired',
      /**
       * Not authenticated event
       * @memberof USER_ROLES
       * @type string
       */
      NOT_AUTHENTICATED: 'auth-not-authenticated',
      /**
       * Not authorized event
       * @memberof USER_ROLES
       * @type string
       */
      NOT_AUTHORIZED: 'auth-not-authorized',
    })
    /**
     * @ngdoc constant
     * @name AUTH_EVENTS_TYPE
     * @memberof frontend.core.auth
     * @description Type of authentication events
     */
    .constant('AUTH_EVENTS_TYPE', {
      /**
       * Event sent during state transitions
       * @memberof AUTH_EVENTS_TYPE
       * @type string
       */
      STATE_TRANSITION: 'STATE_TRANSITION',
      /**
       * Event sent during resource access
       * @memberof AUTH_EVENTS_TYPE
       * @type string
       */
      RESOURCE: 'RESOURCE',
    })
    /**
     * @ngdoc constant
     * @name TRANSLATE
     * @memberof frontend.core.auth
     * @description Translate keys
     */
    .constant('TRANSLATE', {
      FR: {
        APP_LOGO: 'images/hello-world.png',
        APP_NAME: 'Hello World application',
        AUTH_BAD_LOGIN: "Login inconnu",
        AUTH_BAD_PASSWORD: "Mot de passe incorrect",
        AUTH_ERROR: "Erreur lors de la connexion",
        AUTH_BTN_CONNEXION: 'Connexion',
        AUTH_PLACEHOLDER_LOGIN: 'Login',
        AUTH_PLACEHOLDER_PASSWORD: 'Mot de passe',
        AUTH_BAD_ROLE: 'Droits insuffisants',
        AUTH_PERM_LOGO: 'images/cancel.png',
      },
      EN: {
        APP_LOGO: 'images/hello-world.png',
        APP_NAME: 'Hello World app',
        AUTH_BAD_LOGIN: "Bad login",
        AUTH_BAD_PASSWORD: "Bad password",
        AUTH_ERROR: "An error occured while connection",
        AUTH_BTN_CONNEXION: 'Connection',
        AUTH_PLACEHOLDER_LOGIN: 'Login',
        AUTH_PLACEHOLDER_PASSWORD: 'Password',
        AUTH_BAD_ROLE: 'Bad role',
        AUTH_PERM_LOGO: 'images/cancel.png',
      }
    });
})();
