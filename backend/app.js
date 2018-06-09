/**
 * @fileoverview Express application
 * @module app
 * @requires {@link external:express}
 * @requires {@link external:path}
 * @requires {@link external:body-parser}
 * @requires {@link external:compression}
 * @requires {@link external:express-pino-logger}
 * @requires {@link external:uuid/v4}
 * @requires {@link external:helmet}
 * @requires {@link external:cors}
 * @requires config/app
 * @requires config/db
 * @requires helpers/errorhandler
 * @requires helpers/logger
 * @requires routes/api
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const helmet = require('helmet');
const cors = require('cors');
const appConfig = require('./config/app');
const { connect } = require('./config/db');
const errorHandler = require('./helpers/errorhandler');
const { logger } = require('./helpers/logger')();
const apiRouter = require('./routes/api');

const app = express();

app.set('port', appConfig.app.port);

// Connection to db
connect();

// Logger middleware
app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));

// Security middlewares
app.use(helmet());
app.use(cors(appConfig.crossOrigin));

// Body parser (to json) middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(express.static(path.join(__dirname, '..', 'web')));
}

// Map modules routes
app.use('/api', apiRouter);

// Default error handlers
app.use(errorHandler.errorNoRouteMapped);
app.use(errorHandler.errorHandler);

module.exports = app;
