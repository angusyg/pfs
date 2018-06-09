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
