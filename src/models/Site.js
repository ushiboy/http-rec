'use strict';
module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define('Site', {
    url: DataTypes.STRING
  }, {

    instanceMethods: {

      addResponse() {
        var RecRes = this.Model.associations.Recordings.target;
        var args = Object.keys(arguments).map(k => arguments[k]);
        return RecRes.updateOrCreate.apply(RecRes, [this.get('id')].concat(args));
      },

      findResponseByMethodAndPath(method, path) {
        var RecRes = this.Model.associations.Recordings.target;
        return RecRes.findByMethodAndPath(this.get('id'), method, path);
      }

    },

    classMethods: {

      associate(db) {
        Site.hasMany(db.Recording, {
          foreignKey: 'siteId',
          constraints: false
        });
      },

      createIfNotFound(url) {
        return this.findOrCreate({
          where: {
            url
          },
          defaults: {
            url
          }
        }).spread((site, created) => {
          return Promise.resolve(site);
        });
      }

    },
    createdAt: false,
    updatedAt: false
  });
  return Site;
};
