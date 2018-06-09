(function() {
  'use strict';

  angular
    .module('frontend.core.resources')
    .factory('resourcesService', ResourcesService);

  ResourcesService.$inject = [];

  function ResourcesService() {
    return {};
  }
})();
