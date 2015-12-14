import assert from 'power-assert';
import RecordingStream from '../src/RecordingStream';

describe('RecordingStream', function() {

  const method = 'GET';
  const path = '/users';
  const headers = {
    'Content-Type': 'text/plain'
  };
  const statusCode = 200;

  let stream;

  beforeEach(() => {
    stream = new RecordingStream(method, path, headers, statusCode);
  });

  it('sets method', () => {
    assert(stream.method === method);
  });
  it('sets path', () => {
    assert(stream.path === path);
  });
  it('sets headers', () => {
    assert(stream.headers['Content-Type'] === headers['Content-Type']);
  });
  it('sets statusCode', () => {
    assert(stream.statusCode === statusCode);
  });

  describe('#end', () => {
    it('should concat body', () => {
      stream.write(new Buffer('test1'));
      stream.write(new Buffer('test2'));
      stream.end(new Buffer('test3'));
      assert(stream.body.toString() === 'test1test2test3');
    });
    it('should emit recordingCompleted event', () => {
      let isEventFired = false;
      stream.on('recordingCompleted', () => {
        isEventFired = true;
      });
      stream.end();
      assert(isEventFired === true);
    });
  });

});
