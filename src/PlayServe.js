import httpProxy from 'http-proxy';
import AbstractServe from './AbstractServe';

export default class PlayServe extends AbstractServe {

  handleProxyRequest(req, res, next) {
    const { method, path } = req;
    this.serveFindResponse(method, path, res);
  }

  serveFindResponse(method, path, res) {
    return this._site.findResponseByMethodAndPath(method, path)
    .then(responseRecord => {
      if (responseRecord) {
        const { headers, body, statusCode } = responseRecord.get({ plain: true });
        res.set(JSON.parse(headers));
        res.status(statusCode).send(body);
      } else {
        res.status(502).send('502 Bad Gateway');
      }
      return Promise.resolve(res);
    });
  }

}
