/**
 * @fileoverview App main and debug logger
 * @module helpers/logger
 * @requires {@link external:fs}
 * @requires {@link external:pino}
 * @requires {@link external:pino-debug}
 * @requires {@link external:pino-multi-stream}
 * @requires {@link external:debug}
 * @requires config/logger
 */

const fs = require('fs');
const pino = require('pino');
const pinoDebug = require('pino-debug');
const multistream = require('pino-multi-stream').multistream;
const debug = require('debug');
const config = require('../config/logger');

/**
 * Creates streams depending current execution environment
 * @function getStreams
 * @private
 * @param  {external:Error}     req  - Request received
 * @param  {external:Response}  res  - Response to be send
 * @param  {nextMiddleware}     next - Callback to pass control to next middleware
 */
function getStreams() {
  const streams = [{
    level: config.logLevel,
    stream: fs.createWriteStream(config.logFile, { flag: 'a' }),
  }];
  if (process.env.NODE_ENV === 'development') {
    streams.push({
      level: config.debugLevel,
      stream: process.stderr,
    });
    streams.push({
      level: config.debugLevel,
      stream: fs.createWriteStream(config.debugFile, { flag: 'a' }),
    });
  }
  return streams;
}


// Defines app logger
const logger = pino({ level: config.debugLevel }, multistream(getStreams()));

// Creates debug logger based on pino
pinoDebug(logger, {
  auto: false,
  map: config.debugMapNs,
});

/**
 * Exports module adds debug logger if requested
 * @function get
 * @private
 * @param   {string}  name  - namespace to use for debug logger
 * @returns {Object}  logger with or whitout debug logger
 */
const get = (name) => {
  if (name) {
    debug(`${config.debugBaseNs}:helpers:logger`)(`${config.debugBaseNs}helpers:logger:get: Creating logger for namespace ${name}`);
    return {
      logger,
      debug: debug(`${config.debugBaseNs}${name}`),
    };
  }
  return { logger };
};

module.exports = get;
