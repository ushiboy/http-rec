import RecServe from './RecServe';
import PlayServe from './PlayServe';
import initDatabase from './models';

export function httpRec(target, dbPath, recording=true) {
  return initDatabase(dbPath).sync()
  .then(db => {
    return db.Site.createIfNotFound(target);
  })
  .then(site => {
    if (recording) {
      return Promise.resolve(new RecServe(site));
    } else {
      return Promise.resolve(new PlayServe(site));
    }
  });
}
