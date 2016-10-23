const db = require('./index');

function addPermissionToDB(username, appUserName, permissions) {
  let insert = db('authorizedApps').insert({ username, appUserName, permissions }).toString();
  insert = insert.replace(/\svalues\s\(/, ' select ').slice(0, -1);

  const update = db('authorizedApps').where('username', username)
    .andWhere('appUserName', appUserName)
    .update({ permissions })
    .toString();

  const query = `BEGIN; 
  LOCK TABLE "authorizedApps" IN SHARE ROW EXCLUSIVE MODE;
  WITH upsert AS (${update} RETURNING *) 
  ${insert} WHERE NOT EXISTS (SELECT * FROM upsert);
  COMMIT;`;

  return db.raw(query);
}

function getPermissionFromDB(username, appUserName) {
  if (!username || !appUserName) { return Promise.resolve([]); }

  return db.select('*').from('authorizedApps').where('username', username)
    .andWhere('appUserName', appUserName)
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
