/* eslint-disable no-param-reassign */
const db = require('./index');
const debug = require('debug')('steemconnect:db');

function addPermissionToDB(username, app, permissions) {
  let insert = db('authorizedApps').insert({ username, app, permissions }).toString();
  insert = insert.replace(/\svalues\s\(/, ' select ').slice(0, -1);

  const update = db('authorizedApps').where('username', username)
    .andWhere('app', app)
    .update({ permissions })
    .toString();

  const query = `BEGIN; 
  LOCK TABLE "authorizedApps" IN SHARE ROW EXCLUSIVE MODE;
  WITH upsert AS (${update} RETURNING *) 
  ${insert} WHERE NOT EXISTS (SELECT * FROM upsert);
  COMMIT;`;

  return db.raw(query);
}

function getPermissionFromDB(username, app) {
  if (!username || !app) { return Promise.resolve([]); }

  return db.select('*').from('authorizedApps').where('username', username)
    .andWhere('app', app)
    .limit(1)
    .then((result) => {
      if (result.length) {
        const permissions = result[0].permissions || '';
        return permissions.split(',');
      }
      return [];
    });
}

function stringify(data) {
  return typeof data === 'string' ? data : JSON.stringify(data);
}

function upsertApp(appData) {
  debug('upserting app');

  appData.permissions = stringify(appData.permissions);
  appData.redirect_urls = stringify(appData.redirect_urls);
  appData.origins = stringify(appData.origins);

  let insert = db('apps').insert(appData).toString();
  insert = insert.replace(/\svalues\s\(/, ' select ').slice(0, -1);

  const update = db('apps').where('app', appData.app)
    .update(appData)
    .toString();

  const query = `BEGIN; 
  LOCK TABLE "apps" IN SHARE ROW EXCLUSIVE MODE;
  WITH upsert AS (${update} RETURNING *) 
  ${insert} WHERE NOT EXISTS (SELECT * FROM upsert);
  COMMIT;`;

  return db.raw(query);
}

function getApp(username) {
  debug('finding app for user', username);
  if (!username) { return Promise.reject({ error: new Error('Please specify username') }); }

  return db.select('*').from('apps')
    .where('app', username)
    .limit(1)
    .then((result) => {
      if (result.length) {
        return result[0];
      }
      throw new Error('App not found');
    });
}

function deleteApp(username) {
  debug('deleting app by user', username);
  if (!username) { return Promise.reject({ error: new Error('Please specify username') }); }

  return db('apps')
    .where('app', username)
    .del();
}

function getAppList(filter = '', page = 0) {
  debug('finding app', filter);

  return db.select('app', 'author', 'name', 'id', 'tagline', 'description', 'origins').from('apps')
    .where('app', 'like', `%${filter}%`)
    .limit(10)
    .offset(page * 10)
    .then((result = []) => result);
}


module.exports = {
  addPermissionToDB,
  getPermissionFromDB,
  upsertApp,
  getApp,
  deleteApp,
  getAppList,
};
