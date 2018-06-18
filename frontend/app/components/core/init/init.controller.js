/**
 * @fileoverview Init module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .controller('InitController', InitController);

  InitController.$inject = [
    '$state',
    'APP'
  ];

  function InitController($state, APP) {
    const vm = this;

    function init() {
      $state.go(APP.HOME_STATE);
    }

    init();
  }
}());
