import Sequelize from 'sequelize';
import defineRecording from './Recording';
import defineSite from './Site';

export default function initDatabase(dbPath=':memory:') {

  if (!dbPath || dbPath.length === 0) {
    throw new Error('Database path not found.');
  }

  const sequelize = new Sequelize(null, null, null, {
    storage: dbPath,
    dialect: 'sqlite',
    logging: null
  });
  const Site = defineSite(sequelize, Sequelize);
  const Recording = defineRecording(sequelize, Sequelize);

  const db = {
    Recording,
    Site
  };

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.sync = function() {
    return Site.sync()
    .then(() => {
      return Recording.sync();
    })
    .then(() => {
      return Promise.resolve(db);
    });
  };
  db.drop = function() {
    return Site.drop()
    .then(() => {
      return Recording.drop();
    });
  };

  return db;
}
