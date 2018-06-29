/**
 * @ngdoc factory
 * @name i18nPartialLoaderErrorHandler
 * @memberof frontend.core.i18n
 * @param {service} $q - AngularJS promise service
 * @returns a function to return an empty object when an error occured during loading
 * @description I18n partial loader error handler returns a function to return an empty object when an error occured during loading
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.i18n')
    .factory('i18nPartialLoaderErrorHandler', I18nPartialLoaderErrorHandler);

  I18nPartialLoaderErrorHandler.$inject = ['$q'];

  function I18nPartialLoaderErrorHandler($q) {
    return (partName, languageKey) => $q.when({});
  }
})();
