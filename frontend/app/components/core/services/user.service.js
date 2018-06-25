/**
 * @fileoverview User service
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.services')
    .factory('userService', UserService);

  UserService.$inject = [
    '$q',
    'authService',
    'APP',
  ];

  function UserService($q, authService, APP) {
    let settings = {
      theme: APP.DEFAULT_THEME,
    };

    return {
      getTheme: getTheme,
      initialize: initialize,
      setTheme: setTheme,
    };

    function getTheme() {
      return settings.theme;
    }

    function initialize() {
      return authService.initialize()
        .then((stgs) => {
          settings = stgs;
          return $q.resolve();
        });
    }

    function setTheme(theme) {
      //TODO Send new theme settings to server
      settings.theme = theme;
    }
  }
})();
