/**
 * Frontend client application auth module;
 * Directive to show login modal on authentication error event
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .directive('authDialog', AuthDialog)
    .directive('permissionDialog', PermissionDialog);

  AuthDialog.$inject = [
    '$state',
    '$uibModal',
    '$templateCache',
    'AUTH_EVENTS',
    'AUTH_EVENTS_TYPE',
  ];

  function AuthDialog($state, $uibModal, $templateCache, AUTH_EVENTS, AUTH_EVENTS_TYPE) {
    return {
      restrict: 'E',
      link: link,
    };

    function link(scope) {
      let loginInProgress = false;

      const show = (event, data) => {
        if (!loginInProgress) {
          loginInProgress = true;
          const loggedIn = $uibModal.open({
            animation: true,
            template: $templateCache.get('AUTH-DIRECTIVE'),
            controller: ModalController,
            controllerAs: 'auth',
            windowClass: 'frontend-app',
            size: 'dialog-centered modal-sm',
            backdrop: 'static',
          });

          loggedIn.result
            .then(() => {
              if (data.type === AUTH_EVENTS_TYPE.STATE_TRANSITION) $state.go(data.data.$to());
            })
            .finally(() => loginInProgress = false);
        }
      };
      scope.$on(AUTH_EVENTS.NOT_AUTHENTICATED, show);
    }

    ModalController.$inject = [
      '$uibModalInstance',
      'authService',
      '$timeout',
      'PARAMETERS',
      'HTTP_STATUS_CODE',
    ];

    function ModalController($uibModalInstance, authService, $timeout, PARAMETERS, HTTP_STATUS_CODE) {
      const vm = this;
      vm.user = {
        login: '',
        password: '',
      };
      vm.error = null;
      vm.login = login;

      function login() {
        authService.login(vm.user)
          .then(() => $uibModalInstance.close())
          .catch((err) => {
            if (err.status === HTTP_STATUS_CODE.UNAUTHORIZED && err.data.code) vm.error = err.data.code;
            else vm.error = 0;
            $timeout(() => vm.error = null, PARAMETERS.TOOLTIP_DURATION);
          });
      }
    }
  }

  PermissionDialog.$inject = [
    '$state',
    '$uibModal',
    '$templateCache',
    'AUTH_EVENTS',
    'AUTH_EVENTS_TYPE',
  ];

  function PermissionDialog($state, $uibModal, $templateCache, AUTH_EVENTS, AUTH_EVENTS_TYPE) {
    return {
      restrict: 'E',
      link: link,
    };

    function link(scope) {
      const show = (event, data) => {
        $uibModal.open({
          animation: true,
          template: $templateCache.get('PERMISSION-DIRECTIVE'),
          windowClass: 'frontend-app',
          size: 'dialog-centered modal-sm',
          controller: ModalPermController,
          controllerAs: 'perm',
          backdrop: true,
        });
      };
      scope.$on(AUTH_EVENTS.NOT_AUTHORIZED, show);
    }

    ModalPermController.$inject = ['$uibModalInstance'];

    function ModalPermController($uibModalInstance) {
      const vm = this;
      vm.exit = exit;

      function exit() {
        $uibModalInstance.close();
      }
    }
  }
})();
