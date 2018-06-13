/**
 * @fileoverview User service
 * @module services/users
 * @requires {@link external:uuid/v4}
 * @requires {@link external:jsonwebtoken}
 * @requires {@link external:uuid/v4}
 * @requires config/api
 * @requires models/users
 * @requires models/errors
 */

const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const config = require('../config/api');
const User = require('../models/users');
const { ApiError, UnauthorizedAccessError } = require('../models/errors');

const service = {};

/**
 * Generates an access token with user infos
 * @function generateAccessToken
 * @private
 * @param   {Object} user - user informations
 * @returns {string} JWT access token
 */
function generateAccessToken(user) {
  return jwt.sign({
    login: user.login,
    roles: user.roles,
  }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
}

/**
 * Generates a refresh and persist the token on user in database
 * @function registerRefreshToken
 * @private
 * @param   {Object} user - user informations
 * @returns {Promise<string>} refresh token if user had been given a new refresh token
 */
function registerRefreshToken(user) {
  return new Promise((resolve, reject) => {
    const refreshToken = uuidv4();
    User.findOneAndUpdate({ _id: user._id }, { refreshToken })
      .then(() => resolve(refreshToken))
      .catch(err => reject(err));
  });
}

/**
 * Checks logins informations for user to connect
 * @method login
 * @param   {Object} infos - connection infos (login, password)
 * @returns {Promise<Object>} access and refresh tokens
 */
service.login = infos => new Promise((resolve, reject) => {
  User.findOne({ login: infos.login })
    .catch(err => reject(err))
    .then((user) => {
      if (!user) reject(new UnauthorizedAccessError('BAD_LOGIN', 'Bad login'));
      else {
        user.comparePassword(infos.password)
          .then((match) => {
            if (!match) reject(new UnauthorizedAccessError('BAD_PASSWORD', 'Bad password'));
            else {
              registerRefreshToken(user)
                .catch(err => reject(err))
                .then(refreshToken => resolve({
                  refreshToken,
                  accessToken: generateAccessToken(user),
                }));
            }
          })
          .catch(err => reject(err));
      }
    });
});

/**
 * Refreshes user access token after validating refresh token
 * @method refreshToken
 * @param   {string} accessToken   - JWT token
 * @param   {string} refreshToken  - user refresh token
 * @returns {Promise<Object>} new access token
 */
service.refreshToken = (accessToken, refreshToken) => new Promise((resolve, reject) => {
  if (accessToken && refreshToken) {
    const payload = jwt.decode(accessToken.split(' ')[1]);
    User.findOne({ login: payload.login })
      .then((user) => {
        if (user) {
          if (refreshToken === user.refreshToken) resolve({ accessToken: generateAccessToken(user) });
          else reject(new UnauthorizedAccessError('REFRESH_NOT_ALLOWED', 'Refresh token has been revoked'));
        } else reject(new ApiError('USER_NOT_FOUND', 'No user found for login in JWT Token'));
      })
      .catch(err => reject(err));
  } else reject(new UnauthorizedAccessError('MISSING_TOKEN', 'Access/refresh token missing'));
});

module.exports = service;
