/**
 * Frontend client application services:
 * Helper service with multiples useful functions
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.services')
    .factory('helper', HelperService);

  HelperService.$inject = [];

  function HelperService() {
    return {
      isBlank: isBlank,
      isNotBlank: isNotBlank,
    };

    function isBlank(obj) {
      return typeof obj === 'undefined' ||
        obj === null ||
        obj === {} ||
        ((typeof obj === 'string' || obj instanceof String) && obj.length === 0) ||
        (Number.isFinite(obj) && obj === 0) ||
        ((typeof obj === 'boolean' || obj instanceof Boolean) && obj === false) ||
        (Array.isArray(obj) && obj.length === 0) ||
        (obj instanceof Error && typeof obj.message !== 'undefined')
    }

    function isNotBlank(obj) {
      return !isBlank(obj);
    }
  }
})();
