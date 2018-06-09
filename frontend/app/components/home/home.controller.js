/**
 * @fileoverview Home module controller
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = [];

  function HomeController() {
    const vm = this;
  }
}());
