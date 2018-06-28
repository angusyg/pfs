/**
 * @ngdoc factory
 * @name i18nPartialLoaderErrorHandler
 * @memberof frontend.core.i18n
 * @description I18n partial loader error handler
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.i18n')
    .factory('i18nPartialLoaderErrorHandler', I18nPartialLoaderErrorHandler);

  /**
   * Dependency injection
   * @type string[]
   */
  I18nPartialLoaderErrorHandler.$inject = ['$q'];

  /**
   * Handles error during loading of i18n translate files
   * @memberof i18nPartialLoaderErrorHandler
   * @param {Object} $q - Promise service
   * @returns {function} a function to return an empty object when an error occured during loading
   */
  function I18nPartialLoaderErrorHandler($q) {
    return (partName, languageKey) => $q.when({});
  }
})();
