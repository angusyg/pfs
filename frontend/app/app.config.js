(function() {
  angular
    .module('frontend')
    .config(Routing);

  Routing.$inject = [
    '$stateProvider',
  ];

  function Routing($stateProvider) {
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
      /** App initialization => services init before to go to child states */
      resolve: {
        init: ['authService', (authService) => authService.initialize()],
      }
    };

    $stateProvider.state(appState);
  }
}());
