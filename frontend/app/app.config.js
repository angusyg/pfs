(function() {
  angular
    .module('frontend')
    .config(Routing)
    .config(Config);

  // Configuration of providers
  Config.$inject = [];

  function Config() {}

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
      resolve: {
        init: ['authService', 'userService', (authService, userService) => {
          return authService.initialize()
            .then(() => { console.log('DDDDDDDDDDDDDDDDDDDDDD');
              userService.initialize() });
        }],
      }
    };

    $stateProvider.state(appState);
  }
}());
