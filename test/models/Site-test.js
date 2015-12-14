import assert from 'power-assert';
import path from 'path';
import initDatabase from '../../src/models';

const db = initDatabase(':memory:');

describe('Site', function() {
  const Site = db.Site;
  beforeEach(() => {
    return db.sync();
  });
  afterEach(() => {
    return db.drop();
  });

  describe('#createIfNotFound', () => {
    context('when not found', () => {
      it('should create', () => {
        return Site.createIfNotFound('http://localhost:8080')
        .then(site => {
          assert(site.url === 'http://localhost:8080');
        });
      });
    });
    context('when found', () => {
      beforeEach(() => {
        return Site.create({
          url: 'http://localhost:3000'
        });
      });
      it('should not create', () => {
        return Site.createIfNotFound('http://localhost:3000')
        .then(site => {
          assert(site.url === 'http://localhost:3000');
        });
      });
    });
  });

});
