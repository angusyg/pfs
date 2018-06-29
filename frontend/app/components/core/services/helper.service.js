/**
 * @ngdoc factory
 * @name helper
 * @memberof frontend.core.services
 * @description Helper service
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

    /**
     * Check if object parameter is blank in front of rules based on object type
     * @memberof helper
     * @param {Object} obj - Object to test
     * @returns {boolean} true if obj is blank (null, {}, empty, undefined, length = 0 ...)
     */
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

    /**
     * Check if object parameter is not blank in front of rules based on object type
     * @memberof helper
     * @param {Object} obj - Object to test
     * @returns {boolean} true if obj is not blank (null, {}, empty, undefined, length = 0 ...)
     */
    function isNotBlank(obj) {
      return !isBlank(obj);
    }
  }
})();
