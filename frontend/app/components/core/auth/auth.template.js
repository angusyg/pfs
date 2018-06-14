/**
 * Frontend client application auth module;
 * Templates for authentication
 */
(function() {
  'use strict';

  angular
    .module('frontend.core.auth')
    .run(['$templateCache', ($templateCache) => {
      $templateCache.put('AUTH-DIRECTIVE',
        `<div class="modal-header">
          <h4 class="modal-title mx-auto" id="modal-header">
            <img src="{{'APP_LOGO' | translate}}" class="rounded mx-auto d-block" alt="avatar">{{'APP_NAME' | translate}}
          </h4>
        </div>
        <form name="authForm" ng-submit="auth.login()">
          <div class="modal-body" id="modal-body">
            <div class="form-group">
              <div tooltip-placement="right" uib-tooltip="{{'AUTH_BAD_LOGIN' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 'BAD_LOGIN'" tooltip-trigger="'none'" ng-class="{'shake': auth.error === 'BAD_LOGIN'}">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text"><i class="icon ion-person"></i></div>
                  </div>
                  <input name="login" type="text" class="form-control form-control-sm" id="login" placeholder="{{'AUTH_PLACEHOLDER_LOGIN' | translate}}" required ng-model="auth.user.login">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div tooltip-placement="right" uib-tooltip="{{'AUTH_BAD_PASSWORD' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 'BAD_PASSWORD'" tooltip-trigger="'none'" ng-class="{'shake': auth.error === 'BAD_PASSWORD'}">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text"><i class="icon ion-locked"></i></div>
                  </div>
                  <input name="password" type="password" class="form-control form-control-sm" id="password" placeholder="{{'AUTH_PLACEHOLDER_PASSWORD' | translate}}" required ng-model="auth.user.password">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-center" tooltip-placement="bottom" uib-tooltip="{{'AUTH_ERROR' | translate}}" tooltip-class="fe-error" tooltip-is-open="auth.error === 0" tooltip-trigger="'none'">
            <button class="btn btn-primary" type="submit" ng-disabled="authForm.$invalid">{{'AUTH_BTN_CONNEXION' | translate}}</button>
          </div>
        </form>`
      );
      $templateCache.put('PERMISSION-DIRECTIVE',
        `<div ng-click="perm.exit()">
          <div class="modal-header">
            <h4 class="modal-title mx-auto" id="modal-header">
              <img src="{{'AUTH_PERM_LOGO' | translate}}" class="rounded mx-auto d-block mid" alt="avatar">{{'AUTH_BAD_ROLE' | translate}}
            </h4>
          </div>
        </div>`
      );
    }]);
})();
