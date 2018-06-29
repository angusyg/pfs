/**
 * @ngdoc controller
 * @name AppController
 * @memberof frontend
 * @param {service} $scope        - AngularJS main scope
 * @param {service} userService   - App user service
 * @description App main controller
 */
(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('AppController', AppController);

  AppController.$inject = [
    '$scope',
    'userService',
  ];

  function AppController($scope, userService) {
    const vm = this;

    // variables
    vm.theme = '';

    // functions

    // Watch user service theme value to change global theme when needed
    $scope.$watch(userService.getTheme, (newValue, oldValue) => {
      if (newValue !== oldValue) vm.theme = newValue;
    });

    /**
     * Initializes controller
     * @name init
     */
    function init() {
      vm.theme = userService.getTheme();
    }

    init();
  }
}());
