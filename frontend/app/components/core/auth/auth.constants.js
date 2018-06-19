(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .constant('SECURITY', {
      ACTIVATED: true,
      ACCESS_TOKEN: 'JWTToken',
      REFRESH_TOKEN: 'RefreshToken',
      ACCESS_TOKEN_HEADER: 'authorization',
      REFRESH_TOKEN_HEADER: 'refresh',
    })
    .constant('USER_ROLES', {
      ALL: 'ALL',
      ADMIN: 'ADMIN',
      USER: 'USER',
    })
    .constant('AUTH_EVENTS', {
      LOGIN_SUCCESS: 'auth-login-success',
      LOGIN_FAILED: 'auth-login-failed',
      LOGOUT_SUCCESS: 'auth-logout-success',
      TOKEN_EXPIRED: 'auth-token-expired',
      NOT_AUTHENTICATED: 'auth-not-authenticated',
      NOT_AUTHORIZED: 'auth-not-authorized',
    })
    .constant('AUTH_EVENTS_TYPE', {
      STATE_TRANSITION: 'STATE_TRANSITION',
      RESOURCE: 'RESOURCE',
    })
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
