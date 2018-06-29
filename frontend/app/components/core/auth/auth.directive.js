/**
 * @ngdoc directive
 * @name auth-dialog
 * @memberof frontend.core.auth
 * @param {service} $state            - Ui router state service
 * @param {service} $uibModal         - UI bootstrap modal service
 * @param {service} $templateCache    - AngularJS $templateCache service
 * @param {service} AUTH_EVENTS       - Authentication events constant
 * @param {service} AUTH_EVENTS_TYPE  - Authentication events type constant
 * @description Directive to show a modal when an authentication event "not authenticated" is sent
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .directive('authDialog', AuthDialog);

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

      // variables
      vm.user = {
        login: '',
        password: '',
      };
      vm.error = null;

      // functions
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
})();

/**
 * @ngdoc directive
 * @name permission-dialog
 * @memberof frontend.core.auth
 * @param {service} $state            - Ui router state service
 * @param {service} $uibModal         - UI bootstrap modal service
 * @param {service} $templateCache    - AngularJS $templateCache service
 * @param {service} AUTH_EVENTS       - Authentication events constant
 * @param {service} AUTH_EVENTS_TYPE  - Authentication events type constant
 * @description Directive to show a modal when an authentication event "not authorized" is sent
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .directive('permissionDialog', PermissionDialog);

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

      /** functions */
      vm.exit = exit;

      function exit() {
        $uibModalInstance.close();
      }
    }
  }
})();
