const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const camo = require('camo');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const User = require('../backend/models/users');

chai.use(chaiHttp);
const expect = chai.expect;
const uuid = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
const jwtVerify = util.promisify(jsonwebtoken.verify);

const initEnv = () => {
  process.env.DB_FOLDER = 'memory';
  process.env.TOKEN_SECRET = 'TOKEN_SECRET';
};

const initDb = (done) => {
  camo.connect(`nedb://${process.env.DB_FOLDER}`)
    .then(() => {
      const testUser = new User();
      testUser.login = 'test';
      testUser.password = 'test';
      testUser.roles = ['USER'];
      testUser.save();
      done();
    })
    .catch(err => done(err));
};

describe('API integration tests', () => {
  let app;
  let accessToken;
  let refreshToken;
  let config;

  before((done) => {
    initEnv();
    app = require('../backend/app');
    require('../backend/bin/www');
    config = require('../backend/config/api')
    app.on("appStarted", () => {
      initDb(done);
    });
  });

  describe('ERROR', () => {
    describe('Url not found', () => {
      it('should return a 404 error', done => {
        request(app)
          .get('/notfound')
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('code', 'Not Found');
            expect(res.body).to.have.own.property('message', 'No endpoint mapped for requested url');
            expect(res.body).to.have.own.property('reqId');
            expect(res.body.reqId).to.match(uuid);
            done();
          });
      });
    });
  });

  describe('ENDPOINT : POST /api/login', () => {
    describe('OK', () => {
      it('should return authentication tokens', done => {
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
    });
    describe('ERROR', () => {
      it('should return bad login error', done => {
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
    });
    describe('ERROR', () => {
      it('should return bad password error', done => {
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
  });

  describe('ENDPOINT : GET /api/refresh', () => {
    describe('OK', () => {
      it('should return an access token', done => {
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
    });
    describe('ERROR', () => {
      let accessTokenBadLogin;

      before((done) => {
        accessTokenBadLogin = jsonwebtoken.sign({
          login: 'test1',
          roles: ['USER'],
          exp: Math.floor(Date.now() / 1000) + config.accessTokenExpirationTime,
        }, config.tokenSecretKey);
        done();
      });
      it('should return an user not found error', done => {
        request(app)
          .get('/api/refresh')
          .set(config.accessTokenHeader, `bearer ${accessTokenBadLogin}`)
          .set(config.refreshTokenHeader, refreshToken)
          .end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('code', 'USER_NOT_FOUND');
            expect(res.body).to.have.own.property('message', 'No user found for login in JWT Token');
            expect(res.body).to.have.own.property('reqId');
            expect(res.body.reqId).to.match(uuid);
            done();
          });
      });
    });
    describe('ERROR', () => {
      before((done) => {
        User.findOne({ login: 'test' })
          .then((user) => {
            user.refreshToken = '';
            user.save()
              .then(() => done());
          });
      });
      it('should return an unauthorized error', done => {
        request(app)
          .get('/api/refresh')
          .set(config.accessTokenHeader, `bearer ${accessToken}`)
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
    });
    describe('ERROR', () => {
      it('should return an missing access token error', done => {
        request(app)
          .get('/api/refresh')
          .set(config.refreshTokenHeader, refreshToken)
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('code', 'MISSING_TOKEN');
            expect(res.body).to.have.own.property('message', 'Access/refresh token missing');
            expect(res.body).to.have.own.property('reqId');
            expect(res.body.reqId).to.match(uuid);
            done();
          });
      });
    });
    describe('ERROR', () => {
      it('should return an missing refresh token error', done => {
        request(app)
          .get('/api/refresh')
          .set(config.accessTokenHeader, `bearer ${accessToken}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            expect(res).to.be.json;
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('code', 'MISSING_TOKEN');
            expect(res.body).to.have.own.property('message', 'Access/refresh token missing');
            expect(res.body).to.have.own.property('reqId');
            expect(res.body.reqId).to.match(uuid);
            done();
          });
      });
    });
  });

  describe('ENDPOINT : GET /logout', () => {
    describe('OK', () => {
      it('should return no content', done => {
        request(app)
          .get('/api/logout')
          .set(config.accessTokenHeader, `bearer ${accessToken}`)
          .set(config.refreshTokenHeader, refreshToken)
          .end((err, res) => {
            expect(res.statusCode).to.equal(204);
            expect(res.body).to.be.an('object');
            expect(res.body).to.be.empty;
            done();
          });
      });
    });
    describe('ERROR', () => {
      it('should return an unauthorized error', done => {
        request(app)
          .get('/api/logout')
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            done();
          });
      });
    });
  });

});
