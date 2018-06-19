/**
 * @fileoverview Home module routing
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .config(Routing);

  Routing.$inject = [
    '$stateProvider',
    'USER_ROLES',
  ];

  function Routing($stateProvider, USER_ROLES) {
    const homeState = {
      name: 'app.home',
      url: '/',
      views: {
        'content@': {
          templateUrl: '/partials/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        }
      },
      data: {
        authorizedRoles: USER_ROLES.ALL,
      },
    };

    $stateProvider.state(homeState);
  }
}());
