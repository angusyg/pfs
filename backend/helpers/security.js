/**
 * @fileoverview Security middlewares to check user authorizations
 * @module helpers/security
 * @requires {@link external:passport}
 * @requires models/errors
 */

const passport = require('./passport');
const { ForbiddenOperationError } = require('../models/errors');

const security = {};

/**
 * Checks if request is authenticated or not
 * @method requiresLogin
 */
security.requiresLogin = (req, res, next) => passport.authenticate(req, res, next);

/**
 * Call middleware with user request permissions
 * @method requiresPermission
 * @param   {string[]}         permissions - Array of permissions to call the endpoint
 * @returns {checkPermission}  Middleware to check if user has permission to call endpoint
 */
security.requiresPermission = permissions => (req, res, next) => {
  if (permissions.length === 0) next();
  else if (req.user && permissions.some(permission => req.user.permissions.includes(permission))) next();
  else next(new ForbiddenOperationError());
};

module.exports = security;
