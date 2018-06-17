const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const camo = require('camo');
const uuidv4 = require('uuid/v4');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const User = require('../backend/models/users');

chai.use(chaiHttp);
const expect = chai.expect;
const uuid = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
const jwtVerify = util.promisify(jsonwebtoken.verify);

describe('API integration tests', () => {
  let app;
  let config;

  before((done) => {
    process.env.DB_FOLDER = 'memory';
    process.env.TOKEN_SECRET = 'TOKEN_SECRET';
    app = require('../backend/app');
    require('../backend/bin/www');
    config = require('../backend/config/api')
    app.on("appStarted", () => {
      done();
    });
  });

  describe('GET /urlnotfound', () => {
    it('returns a 404 error', (done) => {
      request(app)
        .get('/notfound')
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'NOT_FOUND');
          expect(res.body).to.have.own.property('message', 'Not Found');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });
  });

  describe('POST /api/login', () => {
    before((done) => {
      User.create({
          login: 'test',
          password: 'test',
          roles: ['USER'],
        })
        .save()
        .then(() => done());
    });

    after((done) => {
      User.deleteOne({ login: 'test' })
        .then(() => done());
    });

    it('OK: returns authentication tokens', (done) => {
      request(app)
        .post('/api/login')
        .send({
          login: 'test',
          password: 'test'
        })
        .end(async (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('refreshToken');
          expect(res.body.refreshToken).to.match(uuid);
          expect(res.body).to.have.own.property('accessToken');
          try {
            await jwtVerify(res.body.accessToken, config.tokenSecretKey);
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
            done();
          } catch (err) {
            done(err);
          }
        });
    });

    it('ERROR: returns bad login error', (done) => {
      request(app)
        .post('/api/login')
        .send({
          login: 'test1',
          password: 'test'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'BAD_LOGIN');
          expect(res.body).to.have.own.property('message', 'Bad login');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });

    it('ERROR: returns bad password error', (done) => {
      request(app)
        .post('/api/login')
        .send({
          login: 'test',
          password: 'test1'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'BAD_PASSWORD');
          expect(res.body).to.have.own.property('message', 'Bad password');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });
  });

  describe('GET /api/refresh', () => {
    let accessTokenBadLogin;
    let accessTokenBadRefresh;
    let accessToken;
    let refreshToken;

    before((done) => {
      accessToken = jsonwebtoken.sign({
        login: 'test',
        roles: ['USER'],
      }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
      accessTokenBadRefresh = jsonwebtoken.sign({
        login: 'test1',
        roles: ['USER'],
      }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
      accessTokenBadLogin = jsonwebtoken.sign({
        login: 'test2',
        roles: ['USER'],
      }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
      refreshToken = uuidv4();

      Promise.all([
        User.create({
          login: 'test',
          password: 'test',
          roles: ['USER'],
          refreshToken,
        })
        .save(),
        User.create({
          login: 'test1',
          password: 'test1',
          roles: ['USER'],
          refreshToken: '',
        })
        .save()
      ]).then(() => done());
    });

    after((done) => {
      Promise.all([
          User.deleteOne({ login: 'test' }),
          User.deleteOne({ login: 'test1' })
        ])
        .then(() => done());
    });

    it('OK: returns an access token', (done) => {
      request(app)
        .get('/api/refresh')
        .set(config.accessTokenHeader, `bearer ${accessToken}`)
        .set(config.refreshTokenHeader, refreshToken)
        .end(async (err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('accessToken');
          try {
            await jwtVerify(res.body.accessToken, config.tokenSecretKey);
            done();
          } catch (err) {
            done(err);
          }
        });
    });

    it('ERROR: returns an unauthorized error', (done) => {
      request(app)
        .get('/api/refresh')
        .set(config.accessTokenHeader, `bearer ${accessTokenBadRefresh}`)
        .set(config.refreshTokenHeader, refreshToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'REFRESH_NOT_ALLOWED');
          expect(res.body).to.have.own.property('message', 'Refresh token has been revoked');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });

    it('ERROR: returns an user not found error', (done) => {
      request(app)
        .get('/api/refresh')
        .set(config.accessTokenHeader, `bearer ${accessTokenBadLogin}`)
        .set(config.refreshTokenHeader, refreshToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'USER_NOT_FOUND');
          expect(res.body).to.have.own.property('message', 'No user found for login in JWT Token');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });

    it('ERROR: returns a missing refresh token error', (done) => {
      request(app)
        .get('/api/refresh')
        .set(config.accessTokenHeader, `bearer ${accessToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'MISSING_REFRESH_TOKEN');
          expect(res.body).to.have.own.property('message', 'Refresh token\'s missing');
          expect(res.body).to.have.own.property('reqId');
          expect(res.body.reqId).to.match(uuid);
          done();
        });
    });
  });

  describe('GET /logout', () => {
    let accessToken;
    let accessTokenBadSignature;
    let accessTokenExpired;

    before((done) => {
      accessToken = jsonwebtoken.sign({
        login: 'test',
        roles: ['USER'],
      }, config.tokenSecretKey, { expiresIn: config.accessTokenExpirationTime });
      accessTokenBadSignature = jsonwebtoken.sign({
        login: 'test',
        roles: ['USER'],
      }, ' ', { expiresIn: config.accessTokenExpirationTime });
      accessTokenExpired = jsonwebtoken.sign({
        login: 'test',
        roles: ['USER'],
      }, config.tokenSecretKey, { expiresIn: 0 });

      User.create({
          login: 'test',
          password: 'test',
          roles: ['USER'],
          refreshToken: '',
        })
        .save()
        .then(() => done());
    });

    after((done) => {
      User.deleteOne({ login: 'test' })
        .then(() => done());
    });

    it('OK: returns no content', (done) => {
      request(app)
        .get('/api/logout')
        .set(config.accessTokenHeader, `bearer ${accessToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(204);
          expect(res.body).to.be.an('object');
          expect(res.body).to.be.empty;
          done();
        });
    });

    it('ERROR: returns a no token error', (done) => {
      request(app)
        .get('/api/logout')
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'NO_TOKEN_FOUND');
          expect(res.body).to.have.own.property('message', 'No Jwt token found in authorization header');
          expect(res.body).to.have.own.property('reqId');
          done();
        });
    });

    it('ERROR: returns an invalid token signature error', (done) => {
      request(app)
        .get('/api/logout')
        .set(config.accessTokenHeader, `bearer ${accessTokenBadSignature}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'INVALID_TOKEN_SIGNATURE');
          expect(res.body).to.have.own.property('message', 'Jwt token signature is invalid');
          expect(res.body).to.have.own.property('reqId');
          done();
        });
    });

    it('ERROR: returns an expired token error', (done) => {
      request(app)
        .get('/api/logout')
        .set(config.accessTokenHeader, `bearer ${accessTokenExpired}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.own.property('code', 'TOKEN_EXPIRED');
          expect(res.body).to.have.own.property('message', 'Jwt token has expired');
          expect(res.body).to.have.own.property('reqId');
          done();
        });
    });
  });
});
