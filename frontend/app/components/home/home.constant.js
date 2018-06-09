/**
 * @fileoverview Home module constants
 */
(function() {
  'use strict';

  angular
    .module('frontend.home')
    .constant('TRANSLATE', {
      FR: {
        HELLO_WORLD: "Hello world depuis le module constants",
      },
      EN: {
        HELLO_WORLD: "Hello world from module constants",
      }
    });
})();
