/**
 * Frontend client application init module;
 * Service to init app services on each state
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.init')
    .factory('initService', InitService);

  InitService.$inject = [
    '$transitions',
    '$q',
    'authService',
  ];

  function InitService($transitions, $q, authService) {
    return {
      stateInitialization: stateInitialization
    };

    function stateInitialization() {
      $transitions.onBefore({ to: '*' }, (trans) => $q.all([authService.initialize()]));
    }
  }
})();
