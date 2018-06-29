/**
 * @ngdoc config
 * @name AppRoutingConfig
 * @memberof frontend
 * @param {service} $stateProvider - UI router $state service provider
 * @description App routing configuration. Adds root state (handling services initialization)
 */
(function() {
  angular
    .module('frontend')
    .config(AppRoutingConfig);

  AppRoutingConfig.$inject = [
    '$stateProvider',
  ];

  function AppRoutingConfig($stateProvider) {
    const appState = {
      name: 'app',
      abstract: true,
      views: {
        'navbar@': {
          templateUrl: '/partials/navbar.html',
          controller: 'NavbarController',
          controllerAs: 'navbar'
        }
      },
      resolve: {
        init: ['userService', (userService) => userService.initialize()],
      }
    };

    $stateProvider.state(appState);
  }
}());
