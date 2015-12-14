import assert from 'power-assert';
import PlayServe from '../src/PlayServe';
import initDatabase from '../src/models';


class DummyResponse {

  constructor() {
    this.headers = null;
    this.statusCode = null;
    this.body = null;
  }

  set(headers) {
    this.headers = headers;
    return this;
  }

  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  send(body) {
    this.body = body;
    return this;
  }
}

const db = initDatabase(':memory:');

describe('PlayServe', function() {
  const Site = db.Site;
  const method = 'GET';
  const headers = {
    'Content-Type': 'text/plain'
  };
  const path = '/users';
  const statusCode = 200;

  let server;
  beforeEach(() => {
    return db.sync()
    .then(() => {
      return Site.create({ url: 'http://localhost:3000' });
    })
    .then(site => {
      server = new PlayServe(site);
      return site.addResponse(method, path, JSON.stringify(headers), statusCode, new Buffer('test'));
    });
  });
  afterEach(() => {
    return db.drop();
  });

  describe('#serveFindResponse', () => {
    context('when found recording', () => {
      let res;
      beforeEach(() => {
        res = new DummyResponse();
        return server.serveFindResponse(method, path, res);
      });

      it('sets status code', () => {
        assert(res.statusCode === statusCode);
      });
      it('sets response headers', () => {
        assert(res.headers['Content-Type'] === headers['Content-Type']);
      });
      it('sets response body', () => {
        assert(res.body.toString() === 'test');
      });
    });

    context('when not found recording', () => {
      let res;
      beforeEach(() => {
        res = new DummyResponse();
        return server.serveFindResponse('GET', '/none', res);
      });

      it('sets 502 status code', () => {
        assert(res.statusCode === 502);
      });
      it('sets "502 Bad Gateway" to response body', () => {
        assert(res.body === '502 Bad Gateway');
      });
    });
  });

});
