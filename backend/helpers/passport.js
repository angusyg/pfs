/**
 * @fileoverview This is passport configuration for JWT authentication
 * @module helpers/passport
 * @requires {@link external:passport}
 * @requires {@link external:passport-jwt}
 * @requires config/api
 * @requires models/users
 */

const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('../config/api');
const User = require('../models/users');

/**
 * JWT strategy authentication
 * @private
 */
const jwtStrategy = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.tokenSecretKey,
  }, (jwtPayload, cb) => User.findOne({ login: jwtPayload.login })
  .then((user) => {
    if (!user) return cb(null, false);
    return cb(null, user);
  })
  .catch(err => cb(err))
);

// Registers strategy
passport.use(jwtStrategy);

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate('jwt', { session: false }),
};
