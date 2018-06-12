/**
 * @fileoverview This is passport configuration for JWT authentication
 * @module helpers/passport
 * @requires {@link external:passport}
 * @requires {@link external:passport-jwt}
 * @requires config/api
 * @requires models/users
 */

const passport = require('passport');
const { Strategy, ExtractJWT } = require('passport-jwt');
const config = require('../config/api');
const User = require('../models/users');

/**
 * Defines passport JWT authentication strategy
 * @method errorNoRouteMapped
 * @private
 * @param  {external:Strategy}  strategy - JWT strategy authentication
 */
passport.use(new Strategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.tokenSecretKey,
  }, (jwtPayload, cb) => User.findOneById(jwtPayload._id)
  .then((user) => {
    if (!user) return cb(null, false);
    return cb(null, user);
  })
  .catch(err => cb(err))
));
