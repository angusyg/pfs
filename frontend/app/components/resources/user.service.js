/**
 * @ngdoc service
 * @name userService
 * @memberof frontend.resources
 * @param {service} $q          - AngularJS promise service
 * @param {service} authService - Core authentication service
 * @param {service} $resource   - AngularJS REST resource service
 * @param {service} APP         - App constant
 * @param {service} API         - App api constant
 * @description Service to handle user resource, handling local and backend API REST accesses.
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
    // Defines backend REST resource
    const userResource = $resource(`${API.URL}${API.BASE}/users/:id`, { id: () => authService.getUserId() }, {
      update: {
        method: 'PUT',
      },
    });
    // Local user settings
    let settings = {
      theme: APP.DEFAULT_THEME,
    };

    return {
      getTheme: getTheme,
      initialize: initialize,
      setTheme: setTheme,
    };

    /**
     * User theme setting getter
     * @memberof userService
     * @returns user theme setting
     */
    function getTheme() {
      return settings.theme;
    }

    /**
     * Initializes service
     * @memberof userService
     */
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

    /**
     * User theme setting setter. Updates theme setting on backend resource.
     * @memberof userService
     * @param {string} theme - user theme to set
     */
    function setTheme(theme) {
      userResource.update({ settings: { theme } })
        .$promise
        .then(() => settings.theme = theme)
        .catch(err => console.log('ERROR', err));
    }
  }
})();
