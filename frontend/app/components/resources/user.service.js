/**
 * @fileoverview User REST resource service
 */
(function() {
  'use strict';

  angular
    .module('frontend.resources')
    .factory('userService', UserService);

  UserService.$inject = [
    '$q',
    'authService',
    '$resource',
    'APP',
    'API',
  ];

  function UserService($q, authService, $resource, APP, API) {
    const userResource = $resource(`${API.URL}${API.BASE}/users/:id`, { id: () => authService.getUserId() }, {
      update: {
        method: 'PUT',
      },
    });
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
        .then(() => userResource.get()
          .$promise
          .then((user) => {
            settings = user.settings;
            return $q.resolve();
          })
          .catch(err => $q.reject())
        );
    }

    function setTheme(theme) {
      userResource.update({ settings: { theme } })
        .$promise
        .then(() => settings.theme = theme)
        .catch(err => console.log('ERROR', err));
    }
  }
})();
