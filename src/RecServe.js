import httpProxy from 'http-proxy';
import RecordingStream from './RecordingStream';
import AbstractServe from './AbstractServe';

export default class RecServe extends AbstractServe {

  constructor(site) {
    super(site);

    this._proxy = httpProxy.createProxy({
      target: site.url,
      changeOrigin: true
    });
    this._proxy.on('proxyRes', this.onProxyRes.bind(this));
  }

  handleProxyRequest(req, res, next) {
    this._proxy.web(req, res);
  }

  onProxyRes(proxyRes, req, res) {
    const { headers, req: { method, path }, statusCode } = proxyRes;
    const stream = new RecordingStream(method, path, headers, statusCode);
    stream.on('recordingCompleted', stream => {
      this.storeResponse(stream);
    });
    proxyRes.pipe(stream);
  }

  storeResponse(stream) {
    const { method, path, headers, statusCode, body } = stream;
    return this._site.addResponse(method, path, JSON.stringify(headers), statusCode, body)
    .catch(e => {
      console.log(e);
    });
  }

}
