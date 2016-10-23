const db = require('./index');

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

module.exports = {
  addPermissionToDB,
  getPermissionFromDB,
};
