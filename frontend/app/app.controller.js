/**
 * @fileoverview App module controller
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

    /** variables */
    vm.theme = '';

    /** functions */

    $scope.$watch(userService.getTheme, (newValue, oldValue) => {
      if (newValue !== oldValue) vm.theme = newValue;
    });

    function init() {
      vm.theme = userService.getTheme();
    }

    init();
  }
}());
