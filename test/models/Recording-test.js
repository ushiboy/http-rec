import assert from 'power-assert';
import path from 'path';
import initDatabase from '../../src/models';

const db = initDatabase(':memory:');

describe('Recording', function() {
  const Site = db.Site;
  const Recording = db.Recording;
  let siteId;
  beforeEach(() => {
    return db.sync()
    .then(() => {
      return Site.create({ url: 'http://localhost:3000' });
    })
    .then(site => {
      siteId = site.get('id');
    });
  });
  afterEach(() => {
    return db.drop();
  });

  describe('#findByMethodAndPath', () => {
    beforeEach(() => {
      return Recording.create({
        siteId,
        method: 'GET',
        path: '/users',
        statusCode: 200
      }).then(() => {
        return Recording.create({
          siteId,
          method: 'POST',
          path: '/users',
          statusCode: 201
        });
      }).then(() => {
        return Recording.create({
          siteId,
          method: 'GET',
          path: '/groups',
          statusCode: 404
        });
      });
    });

    it('should find record', () => {
      return Recording.findByMethodAndPath(siteId, 'GET', '/users')
      .then(record => {
        assert(record.method === 'GET');
        assert(record.path === '/users');
        assert(record.statusCode === 200);
      });
    });
  });

  describe('#createIfNotFound', () => {
    context('when not found', () => {
      it('should create', () => {
        return Recording.createIfNotFound(siteId, 'GET', '/friends', '{}', 200, '')
        .then(record => {
          assert(record.method === 'GET');
          assert(record.path === '/friends');
          assert(record.statusCode === 200);
        });
      });
    });
    context('when found', () => {
      beforeEach(() => {
        return Recording.create({
          siteId,
          method: 'GET',
          path: '/users',
          statusCode: 404
        });
      });
      it('should not create', () => {
        return Recording.createIfNotFound(siteId, 'GET', '/users', '{}', 200, '')
        .then(record => {
          assert(record.method === 'GET');
          assert(record.path === '/users');
          assert(record.statusCode === 404);
        });
      });
    });
  });

  describe('#updateOrCreate', () => {
    context('when not found', () => {
      it('should create', () => {
        return Recording.updateOrCreate(siteId, 'GET', '/friends', '{}', 200, '')
        .then(record => {
          assert(record.method === 'GET');
          assert(record.path === '/friends');
          assert(record.statusCode === 200);
        });
      });
    });
    context('when found', () => {
      beforeEach(() => {
        return Recording.create({
          siteId,
          method: 'GET',
          path: '/users',
          statusCode: 404
        });
      });
      it('should update', () => {
        return Recording.updateOrCreate(siteId, 'GET', '/users', '{}', 200, '')
        .then(record => {
          assert(record.method === 'GET');
          assert(record.path === '/users');
          assert(record.statusCode === 200);
        });
      });
    });
  });

});
