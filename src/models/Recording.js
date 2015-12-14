'use strict';
module.exports = function(sequelize, DataTypes) {
  var Recording = sequelize.define('Recording', {
    method: DataTypes.STRING,
    path: DataTypes.STRING,
    headers: DataTypes.TEXT,
    statusCode: DataTypes.INTEGER,
    body: DataTypes.BLOB
  }, {
    classMethods: {

      associate(db) {
        Recording.belongsTo(db.Site, {
          foreignKey: 'siteId',
          onUpdate: 'no action',
          onDelete: 'cascade'
        });
      },

      findByMethodAndPath(siteId, method, path) {
        return this.findOne({
          where: {
            siteId: siteId,
            method: method,
            path: path
          }
        });
      },

      createIfNotFound(siteId, method, path, headers, statusCode, body) {
        return this.findOrCreate({
          where: {
            siteId: siteId,
            method: method,
            path: path
          },
          defaults: {
            siteId: siteId,
            method: method,
            path: path,
            headers: headers,
            statusCode: statusCode,
            body: body
          }
        }).spread((response, created) => {
          return Promise.resolve(response);
        });
      },

      updateOrCreate(siteId, method, path, headers, statusCode, body) {
        return this.findOrCreate({
          where: {
            siteId: siteId,
            method: method,
            path: path
          },
          defaults: {
            siteId: siteId,
            method: method,
            path: path,
            headers: headers,
            statusCode: statusCode,
            body: body
          }
        }).spread((response, created) => {
          if (created) {
            return Promise.resolve(response);
          } else {
            return response.update({
              headers: headers,
              statusCode: statusCode,
              body: body
            });
          }
        });
      }

    },
    createdAt: false,
    updatedAt: false
  });
  return Recording;
};
