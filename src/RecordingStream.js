import { Writable } from 'stream';

export default class RecordingStream extends Writable {

  constructor(method, path, headers, statusCode) {
    super();
    this.method = method;
    this.path = path;
    this.headers = headers;
    this.statusCode = statusCode;
    this.body = null;
    this._buf = [];
  }

  write(chunk) {
    this._buf.push(chunk);
    return true;
  }

  end(chunk) {
    if (chunk) {
      this.write(chunk);
    }
    this.body = Buffer.concat(this._buf);
    this.emit('recordingCompleted', this);
  }

}
