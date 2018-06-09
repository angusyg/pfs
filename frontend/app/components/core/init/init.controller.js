/**
 * Frontend client application init module
 * Controller to redirect on app landing page (login or home)
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .controller('InitController', InitController);

  InitController.$inject = ['$state', 'APP'];

  function InitController($state, APP) {
    const vm = this;

    initialize();

    function initialize() {
      $state.go(APP.HOME_STATE_NAME);
    }
  }
})();
