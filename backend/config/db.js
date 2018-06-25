/**
 * @fileoverview This is NeDB database configuration values
 * @module config/db
 * @requires {@link external:path}
 * @requires {@link external:fs}
 * @requires {@link external:camo}
 * @requires helpers/logger
 */

const path = require('path');
const fs = require('fs');
const camo = require('camo');
const logger = require('../helpers/logger');

// Creates db folder if it does not exists
const dbFolder = process.env.DB_FOLDER || path.join(__dirname, '..', '..', 'data');
if (dbFolder !== 'memory' && !fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);

/**
 * Connect app to NeDB database
 * @function connect
 */
const connect = () => camo.connect(`nedb://${dbFolder}`)
  .then((db) => {
    logger.info(`Connection opened to DB 'nedb://${dbFolder}'`);
    return db;
  })
  .catch((err) => {
    logger.fatal(`Error during DB connection : ${JSON.stringify(err)}`);
    process.exit(0);
  });

module.exports = { connect };
