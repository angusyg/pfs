/* eslint no-unused-expressions: 0 */

const chai = require('chai');
const sinon = require('sinon');
const errors = require('./errors');

const expect = chai.expect;

describe('Module models/errors', () => {
  it('should export ApiError', (done) => {
    expect(errors).to.have.property('ApiError');
    done();
  });

  it('should export NotFoundError', (done) => {
    expect(errors).to.have.property('NotFoundError');
    done();
  });

  it('should export UnauthorizedAccessError', (done) => {
    expect(errors).to.have.property('UnauthorizedAccessError');
    done();
  });

  it('should export ForbiddenOperationError', (done) => {
    expect(errors).to.have.property('ForbiddenOperationError');
    done();
  });

  it('should export JwtTokenExpiredError', (done) => {
    expect(errors).to.have.property('JwtTokenExpiredError');
    done();
  });

  it('should export NoJwtTokenError', (done) => {
    expect(errors).to.have.property('NoJwtTokenError');
    done();
  });

  it('should export JwtTokenSignatureError', (done) => {
    expect(errors).to.have.property('JwtTokenSignatureError');
    done();
  });

  describe('Unit tests', () => {
    let status;
    let json;
    let res;
    const req = { id: 'UUID' };
    const {
      ApiError,
      NotFoundError,
      UnauthorizedAccessError,
      ForbiddenOperationError,
      JwtTokenExpiredError,
      NoJwtTokenError,
      JwtTokenSignatureError,
    } = errors;

    describe('ApiError', () => {
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it('constructor(): should return an ApiError', (done) => {
        const error = new ApiError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error.name).to.be.equal('ApiError');
        expect(error.statusCode).to.be.equal(500);
        expect(error.code).to.be.equal('Internal Server Error');
        expect(error.message).to.be.equal('An unknown server error occured while processing request');
        done();
      });

      it('constructor(a: string): should return an ApiError with custom message', (done) => {
        const error = new ApiError('test message');
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error.name).to.be.equal('ApiError');
        expect(error.statusCode).to.be.equal(500);
        expect(error.code).to.be.equal('Internal Server Error');
        expect(error.message).to.be.equal('test message');
        done();
      });

      it('constructor(a: Error): should return an ApiError with error message', (done) => {
        const error = new ApiError(new Error('test message'));
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error.name).to.be.equal('ApiError');
        expect(error.statusCode).to.be.equal(500);
        expect(error.code).to.be.equal('Internal Server Error');
        expect(error.message).to.be.equal('test message');
        done();
      });

      it('constructor(a: string[2]): should return an ApiError with custom code and message', (done) => {
        const error = new ApiError(['CODE', 'MESSAGE']);
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error.name).to.be.equal('ApiError');
        expect(error.statusCode).to.be.equal(500);
        expect(error.code).to.be.equal('CODE');
        expect(error.message).to.be.equal('MESSAGE');
        done();
      });

      it('constructor(a: boolean|number|Object): should throw a TypeError', (done) => {
        expect(() => new ApiError(0)).to.throw(TypeError, 'Invalid type \'number\' for new ApiError argument');
        done();
      });

      it('constructor(a: string, b: string): should return an ApiError with custom code and message', (done) => {
        const error = new ApiError('CODE', 'MESSAGE');
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error.name).to.be.equal('ApiError');
        expect(error.statusCode).to.be.equal(500);
        expect(error.code).to.be.equal('CODE');
        expect(error.message).to.be.equal('MESSAGE');
        done();
      });

      it('constructor(a: boolean|number|Object, b: string): should throw a TypeError', (done) => {
        expect(() => new ApiError(0, 'MESSAGE')).to.throw(TypeError, 'Invalid type \'number\' for new ApiError first argument');
        done();
      });

      it('constructor(a: string, b: boolean|number|Object): should throw a TypeError', (done) => {
        expect(() => new ApiError('CODE', 0)).to.throw(TypeError, 'Invalid type \'number\' for new ApiError second argument');
        done();
      });

      it('send(req: Request, res: Response): should send an ApiError as request response', (done) => {
        new ApiError().send(req, res);
        expect(status.calledOnce).to.be.true;
        expect(status.calledWith(500)).to.be.ok;
        expect(json.calledOnce).to.be.true;
        expect(json.calledWith({
          code: 'Internal Server Error',
          message: 'An unknown server error occured while processing request',
          reqId: 'UUID',
        })).to.be.ok;
        done();
      });

      it('handle(req: Request, res: Response, err: Error): should handle an Error and send an ApiError as request response', (done) => {
        ApiError.handle(req, res, new Error('MESSAGE'));
        expect(status.calledOnce).to.be.true;
        expect(status.calledWith(500)).to.be.ok;
        expect(json.calledOnce).to.be.true;
        expect(json.calledWith({
          code: 'Internal Server Error',
          message: 'MESSAGE',
          reqId: 'UUID',
        })).to.be.ok;
        done();
      });

      it('handle(req: Request, res: Response, err: ApiError): should handle an ApiError and send it as request response', (done) => {
        ApiError.handle(req, res, new ApiError('MESSAGE'));
        expect(status.calledOnce).to.be.true;
        expect(status.calledWith(500)).to.be.ok;
        expect(json.calledOnce).to.be.true;
        expect(json.calledWith({
          code: 'Internal Server Error',
          message: 'MESSAGE',
          reqId: 'UUID',
        })).to.be.ok;
        done();
      });
    });

    describe('UnauthorizedAccessError', () => {
      it('constructor(): should return an UnauthorizedAccessError', (done) => {
        const error = new UnauthorizedAccessError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(UnauthorizedAccessError);
        expect(error.name).to.be.equal('UnauthorizedAccessError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('Unauthorized');
        expect(error.message).to.be.equal('Not authorized to access to this resource');
        done();
      });

      it('constructor(a: string): should return an UnauthorizedAccessError with custom message', (done) => {
        const error = new UnauthorizedAccessError('MESSAGE');
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(UnauthorizedAccessError);
        expect(error.name).to.be.equal('UnauthorizedAccessError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('Unauthorized');
        expect(error.message).to.be.equal('MESSAGE');
        done();
      });

      it('constructor(a: string, b: string): should return an UnauthorizedAccessError with custom code and message', (done) => {
        const error = new UnauthorizedAccessError('CODE', 'MESSAGE');
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(UnauthorizedAccessError);
        expect(error.name).to.be.equal('UnauthorizedAccessError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('CODE');
        expect(error.message).to.be.equal('MESSAGE');
        done();
      });

      it('constructor(a: boolean|number|Object): should throw a TypeError', (done) => {
        expect(() => new UnauthorizedAccessError(0)).to.throw(TypeError, 'Invalid type \'number\' for new ApiError second argument');
        done();
      });

      it('constructor(a: boolean|number|Object, b: string): should throw a TypeError', (done) => {
        expect(() => new UnauthorizedAccessError(0, 'MESSAGE')).to.throw(TypeError, 'Invalid type \'number\' for new ApiError first argument');
        done();
      });

      it('constructor(a: string, b: boolean|number|Object): should throw a TypeError', (done) => {
        expect(() => new UnauthorizedAccessError('CODE', 0)).to.throw(TypeError, 'Invalid type \'number\' for new ApiError second argument');
        done();
      });

      it('constructor(any[>2]): should return an UnauthorizedAccessError', (done) => {
        const error = new UnauthorizedAccessError('a', 'b', 0);
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(UnauthorizedAccessError);
        expect(error.name).to.be.equal('UnauthorizedAccessError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('Unauthorized');
        expect(error.message).to.be.equal('Not authorized to access to this resource');
        done();
      });
    });

    describe('NotFoundError', () => {
      it('constructor(): should return a NotFoundError', (done) => {
        const error = new NotFoundError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(NotFoundError);
        expect(error.name).to.be.equal('NotFoundError');
        expect(error.statusCode).to.be.equal(404);
        expect(error.code).to.be.equal('Not Found');
        expect(error.message).to.be.equal('No endpoint mapped for requested url');
        done();
      });
    });

    describe('ForbiddenOperationError', () => {
      it('constructor(): should return a ForbiddenOperationError', (done) => {
        const error = new ForbiddenOperationError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(ForbiddenOperationError);
        expect(error.name).to.be.equal('ForbiddenOperationError');
        expect(error.statusCode).to.be.equal(403);
        expect(error.code).to.be.equal('Forbidden');
        expect(error.message).to.be.equal('Not authorized to perform operation');
        done();
      });
    });

    describe('JwtTokenExpiredError', () => {
      it('constructor(): should return a JwtTokenExpiredError', (done) => {
        const error = new JwtTokenExpiredError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(JwtTokenExpiredError);
        expect(error.name).to.be.equal('JwtTokenExpiredError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('TOKEN_EXPIRED');
        expect(error.message).to.be.equal('Jwt token has expired');
        done();
      });
    });

    describe('NoJwtTokenError', () => {
      it('constructor(): should return a NoJwtTokenError', (done) => {
        const error = new NoJwtTokenError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(NoJwtTokenError);
        expect(error.name).to.be.equal('NoJwtTokenError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('NO_TOKEN_FOUND');
        expect(error.message).to.be.equal('No Jwt token found in authorization header');
        done();
      });
    });

    describe('JwtTokenSignatureError', () => {
      it('constructor(): should return a JwtTokenSignatureError', (done) => {
        const error = new JwtTokenSignatureError();
        expect(error).to.be.an.instanceof(Error);
        expect(error).to.be.an.instanceof(ApiError);
        expect(error).to.be.an.instanceof(JwtTokenSignatureError);
        expect(error.name).to.be.equal('JwtTokenSignatureError');
        expect(error.statusCode).to.be.equal(401);
        expect(error.code).to.be.equal('INVALID_TOKEN_SIGNATURE');
        expect(error.message).to.be.equal('Jwt token signature is invalid');
        done();
      });
    });
  });
});
