/**
 * @fileoverview This is passport configuration for JWT authentication
 * @module helpers/passport
 * @requires {@link external:passport}
 * @requires {@link external:passport-jwt}
 * @requires {@link external:jsonwebtoken}
 * @requires config/api
 * @requires models/users
 * @requires models/errors
 */

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const config = require('../config/api');
const User = require('../models/users');
const { UnauthorizedAccessError, JwtTokenExpiredError, NoJwtTokenError, JwtTokenSignatureError } = require('../models/errors');

/**
 * JWT strategy authentication
 * @private
 */
const jwtStrategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.tokenSecretKey,
}, (jwtPayload, cb) => {
  User.findOne({ login: jwtPayload.login })
    .then((user) => {
      if (!user) return cb(null, false);
      return cb(null, user);
    })
    .catch(err => cb(err));
});

// Registers strategy
passport.use(jwtStrategy);

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (info) {
      if (info instanceof TokenExpiredError) return next(new JwtTokenExpiredError());
      if (info instanceof JsonWebTokenError) return next(new JwtTokenSignatureError());
      if (info instanceof Error && info.message === 'No auth token') return next(new NoJwtTokenError());
      return next(new UnauthorizedAccessError());
    }
    if (user === null || user === false) return next(new UnauthorizedAccessError('USER_NOT_FOUND', 'No user found for login in JWT Token'));
    req.user = user;
    return next();
  })(req, res, next),
};
