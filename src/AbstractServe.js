import express from 'express';
import morgan from 'morgan';

export default class AbstractServe {

  constructor(site) {
    this._site = site;

    this._app = express();
    this._app.use(morgan('[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
    this._app.use(this.handleProxyRequest.bind(this));
  }

  listen(port) {
    this._app.listen(port);
    console.log(`server started http://localhost:${port}`);
  }

  handleProxyRequest(req, res, next) {
    throw new Error('Not implemented yet.');
  }

}
