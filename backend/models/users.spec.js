/* eslint no-unused-expressions: 0 */

const chai = require('chai');
const sinon = require('sinon');
const camo = require('camo');
const { ValidationError } = require('camo/lib/errors');
const { validateId } = require('camo/test/util');
const User = require('./users');

const expect = chai.expect;

describe('Module models/users', () => {
  // it('should export User', (done) => {
  //   expect('users').to.be.a('function');
  //   done();
  // });

  let database;
  before((done) => {
    camo.connect('nedb://memory')
      .then((db) => {
        database = db;
        done();
      });
  });

  afterEach((done) => {
    database.dropDatabase()
      .then(() => done());
  });

  after((done) => {
    database.dropDatabase()
      .then(() => done());
  });

  describe('Unit tests', () => {
    it('create(): should create an empty User', (done) => {
      const user = User.create();
      expect(user).to.have.property('login');
      expect(user.login).to.be.undefined;
      expect(user).to.have.property('password');
      expect(user.password).to.be.undefined;
      expect(user).to.have.property('roles');
      expect(user.roles).to.be.eql(['USER']);
      expect(user).to.have.property('refreshToken');
      expect(user.refreshToken).to.be.empty;
      done();
    });

    it('create(u: Object): should create a User from u', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
      });
      expect(user.login).to.be.equal('LOGIN');
      expect(user.password).to.be.equal('PASSWORD');
      expect(user.roles).to.be.eql(['ADMIN', 'USER']);
      expect(user.refreshToken).to.be.equal('');
      done();
    });

    it('should allow to fill User after create()', (done) => {
      const user = User.create();
      user.login = 'LOGIN';
      user.password = 'PASSWORD';
      user.roles = ['ADMIN', 'USER'];
      user.refreshToken = 'TOKEN';
      expect(user.login).to.be.equal('LOGIN');
      expect(user.password).to.be.equal('PASSWORD');
      expect(user.roles).to.be.eql(['ADMIN', 'USER']);
      expect(user.refreshToken).to.be.equal('TOKEN');
      done();
    });

    it('comparePassword(p: string): should compare p against encrypted User password', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
      });
      user.preSave();
      user.comparePassword('PASSWORD')
        .then((match) => {
          expect(match).to.be.true;
          done();
        })
        .catch(err => done(err));
    });

    it('save(): should save User in database', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
      });
      user.save()
        .then(() => {
          validateId(user);
          expect(user.login).to.be.equal('LOGIN');
          expect(user.roles).to.be.eql(['ADMIN', 'USER']);
          expect(user.refreshToken).to.be.equal('');
          user.comparePassword('PASSWORD')
            .then((match) => {
              expect(match).to.be.true;
              done();
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    });

    it('save(): should reject with a ValidationError on empty login', (done) => {
      const user = User.create({
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Key users.login is required, but got undefined');
          done();
        });
    });

    it('save(): should reject with a ValidationError on empty password', (done) => {
      const user = User.create({
        login: 'LOGIN',
        roles: ['ADMIN', 'USER'],
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Key users.password is required, but got undefined');
          done();
        });
    });

    it('save(): should reject with a ValidationError on type of login not being String', (done) => {
      const user = User.create({
        login: 0,
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Value assigned to users.login should be String, got number');
          done();
        });
    });

    it('save(): should reject with a ValidationError on type of password not being String', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 0,
        roles: ['ADMIN', 'USER'],
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Value assigned to users.password should be String, got number');
          done();
        });
    });

    it('save(): should reject with a ValidationError on type of roles not being [String]', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 'PASSWORD',
        roles: [0],
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Value assigned to users.roles should be [String], got [0]');
          done();
        });
    });

    it('save(): should reject with a ValidationError on type of refreshToken not being String', (done) => {
      const user = User.create({
        login: 'LOGIN',
        password: 'PASSWORD',
        roles: ['ADMIN', 'USER'],
        refreshToken: 0,
      });
      user.save()
        .catch((err) => {
          expect(err).to.be.an.instanceof(ValidationError);
          expect(err.message).to.be.equal('Value assigned to users.refreshToken should be String, got number');
          done();
        });
    });
  });
});
