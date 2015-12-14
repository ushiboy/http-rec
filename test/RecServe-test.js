import assert from 'power-assert';
import { Readable } from 'stream';
import RecServe from '../src/RecServe';
import RecordingStream from '../src/RecordingStream';
import initDatabase from '../src/models';

const db = initDatabase(':memory:');

class DummyProxyResponse extends Readable {

  constructor(method, path, statusCode, headers) {
    super();
    this.req = {
      path,
      method
    };
    this.statusCode = statusCode;
    this.headers = headers;
    this.implPipe = () => {};
  }

  pipe(stream) {
    this.implPipe(stream);
  }
}

describe('RecServe', function() {
  const Site = db.Site;

  let site;
  let server;
  beforeEach(() => {
    return db.sync()
    .then(() => {
      return Site.create({ url: 'http://localhost:3000' });
    })
    .then(s => {
      site = s;
      server = new RecServe(site);
    });
  });
  afterEach(() => {
    return db.drop();
  });

  describe('#onProxyRes', () => {

    const method = 'GET';
    const headers = {
      'Content-Type': 'text/plain'
    };
    const path = '/users';
    const statusCode = 200;

    let proxyRes;
    let writerStream;

    beforeEach(() => {
      proxyRes = new DummyProxyResponse(method, path, statusCode, headers);
      proxyRes.implPipe = stream => {
        writerStream = stream;
      };
      server.onProxyRes(proxyRes);
    });

    it('pipes proxy response into response recording stream', () => {
      assert(writerStream instanceof RecordingStream);
    });
    it('sets request method into response recording stream', () => {
      assert(writerStream.method === method);
    });
    it('sets request path into response recording stream', () => {
      assert(writerStream.path === path);
    });
    it('sets response status code into response recording stream', () => {
      assert(writerStream.statusCode === statusCode);
    });
    it('sets response headers into response recording stream', () => {
      assert(writerStream.headers['Content-Type'] === headers['Content-Type']);
    });
  });

  describe('#storeResponse', () => {
    const method = 'GET';
    const headers = {
      'Content-Type': 'text/plain'
    };
    const path = '/users';
    const statusCode = 200;

    it('saves stream', () => {
      const stream = new RecordingStream(method, path, headers, statusCode);
      stream.end(new Buffer('test'));
      return server.storeResponse(stream)
      .then(rec => {
        assert(rec.siteId === site.id);
        assert(rec.method === method);
        assert(rec.path === path);
        assert(rec.statusCode === statusCode);
        assert(rec.headers === JSON.stringify(headers));
        assert(rec.body.toString() === 'test');
      });
    });
  });

});
