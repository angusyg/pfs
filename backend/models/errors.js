/**
 * @fileoverview Api error class module to create and convert error to json response
 * @module models/errors
 * @requires {@link external:kind-of}
 * @requires {@link external:http-status}
 */

const kindOf = require('kind-of');
const http = require('http');

const ns = 'models:errors';
const logger = require('../helpers/logger');

/**
 * Creates a new ApiError
 * @class
 * @extends external:Error
 * @name ApiError
 * @param {external:Error|string} [arg] Error to convert or string key of endpoint error
 */
class ApiError extends Error {
  constructor(...args) {
    super('An unknown server error occured while processing request');
    /**
     * Name of the error
     * @default ApiError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default Internal Server Error
     * @member {string}
     */
    this.code = 'INTERNAL_SERVER_ERROR';

    /**
     * HTTP status code of the response to be send
     * @default 500
     * @member {number}
     */
    this.statusCode = 500;

    if (args.length === 1) {
      const type = kindOf(args[0]);
      if (type === 'error') this.message = args[0].message;
      else if (type === 'string') this.message = args[0];
      else if (type === 'array' && args[0].length === 2) {
        this.code = args[0][0];
        this.message = args[0][1];
      } else throw new TypeError(`Invalid type '${type}' for new ApiError argument`);
    } else if (args.length === 2) {
      let type = kindOf(args[0]);
      if (type === 'string') this.code = args[0];
      else throw new TypeError(`Invalid type '${type}' for new ApiError first argument`);
      type = kindOf(args[1]);
      if (type === 'string') this.message = args[1];
      else throw new TypeError(`Invalid type '${type}' for new ApiError second argument`);
    }
  }

  /**
   * Check error type and if needed convert it to ApiError before sending it in response
   * @method handle
   * @static
   * @param  {external:Request}  req - Request received
   * @param  {external:Response} res - Response to be send
   * @param  {external:Error}    err - Error to handle
   */
  static handle(req, res, err) {
    if (err instanceof ApiError) err.send(req, res);
    else new ApiError(err).send(req, res);
  }

  /**
   * Creates response depending on ApiError configuration
   * @method send
   * @param  {external:Request}  req - Request received
   * @param  {external:Response} res - Response to be send
   */
  send(req, res) {
    const err = {
      code: this.code,
      message: this.message,
      reqId: req.id,
    };
    res.status(this.statusCode).json(err);
    logger.error(`${ns}:send: sending error : ${JSON.stringify(err)}`);
  }
}

/**
 * Url not found error class module to create and convert error to json response
 * @class
 * @extends {ApiError}
 */
class NotFoundError extends ApiError {
  constructor() {
    super('NOT_FOUND', http.STATUS_CODES[404]);

    /**
     * Name of the error
     * @default NotFoundError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 404
     * @member {number}
     */
    this.statusCode = 404;
  }
}

/**
 * Creates an UnauthorizedAccessError
 * @class
 * @extends {ApiError}
 */
class UnauthorizedAccessError extends ApiError {
  constructor(...args) {
    if (args.length === 1) super('UNAUTHORIZED', args[0]);
    else if (args.length === 2) super(args[0], args[1]);
    else super('UNAUTHORIZED', http.STATUS_CODES[401]);

    /**
     * Name of the error
     * @default UnauthorizedAccessError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;
  }
}

/**
 * Creates an ForbiddenOperationError
 * @class
 * @extends {ApiError}
 */
class ForbiddenOperationError extends ApiError {
  constructor() {
    super('FORBIDDEN_OPERATION', http.STATUS_CODES[403]);

    /**
     * Name of the error
     * @default ForbiddenOperationError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 403
     * @member {number}
     */
    this.statusCode = 403;
  }
}

/**
 * Creates an JwtTokenExpiredError
 * @class
 * @extends {ApiError}
 */
class JwtTokenExpiredError extends ApiError {
  constructor() {
    super('TOKEN_EXPIRED', 'Jwt token has expired');

    /**
     * Name of the error
     * @default JwtTokenExpiredError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;
  }
}

/**
 * Creates an NoJwtTokenError
 * @class
 * @extends {ApiError}
 */
class NoJwtTokenError extends ApiError {
  constructor() {
    super('NO_TOKEN_FOUND', 'No Jwt token found in authorization header');

    /**
     * Name of the error
     * @default NoJwtTokenError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;
  }
}

/**
 * Creates an JwtTokenSignatureError
 * @class
 * @extends {ApiError}
 */
class JwtTokenSignatureError extends ApiError {
  constructor() {
    super('INVALID_TOKEN_SIGNATURE', 'Jwt token signature is invalid');

    /**
     * Name of the error
     * @default JwtTokenSignatureError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  UnauthorizedAccessError,
  ForbiddenOperationError,
  JwtTokenExpiredError,
  NoJwtTokenError,
  JwtTokenSignatureError,
};
