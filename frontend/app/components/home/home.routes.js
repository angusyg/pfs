/**
 * @ngdoc config
 * @name HomeRouting
 * @memberof frontend.home
 * @param {service} $stateProvider  - UI router state service provider
 * @param {service} USER_ROLES      - App user roles constant
 * @description  Home component routing config. Adds home state to app routing.
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .config(HomeRouting);

  HomeRouting.$inject = [
    '$stateProvider',
    'USER_ROLES',
  ];

  function HomeRouting($stateProvider, USER_ROLES) {
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
