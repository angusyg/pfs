/**
 * @fileoverview User class module
 * @module models/users
 * @requires {@link external:camo}
 * @requires {@link external:bcrypt}
 * @requires config/app
 */

const { Document } = require('camo');
const bcrypt = require('bcrypt');
const config = require('../config/app');

/**
 * Creates a User
 * @class
 * @extends external:camo.Document
 * @name User
 */
class User extends Document {
  constructor() {
    super();

    /**
     * User login
     * @member {string}
     */
    this.login = {
      type: String,
      unique: true,
      required: true,
    };

    /**
     * User password
     * @member {string}
     */
    this.password = {
      type: String,
      required: true,
    };

    /**
     * User roles
     * @member {string[]}
     */
    this.roles = {
      type: [String],
      required: true,
      default: ['USER'],
    };

    /**
     * User refresh token
     * @member {string}
     * @default ''
     */
    this.refreshToken = {
      type: String,
      default: '',
    };
  }

  /**
   * Compares a candidate password with user password
   * @method comparePassword
   * @param  {string}           candidatePassword - Candidate password
   * @return {Promise<boolean>} true if candidate password match, false if not
   */
  comparePassword(candidatePassword) {
    return new Promise((resolve) => {
      bcrypt.compare(candidatePassword, this.password)
        .then(match => resolve(match));
    });
  }

  /**
   * Pre save hook, encrypts user password before persist
   * @method preSave
   * @private
   */
  preSave() {
    this.password = bcrypt.hashSync(this.password, config.app.saltFactor);
  }
}

module.exports = User;
