const db = require('./index');

function addPermissionToDB(username, appName, permissions) {
  let insert = db('authorizedApps').insert({ username, appName, permissions: JSON.stringify(permissions) }).toString();
  insert = insert.replace(/\svalues\s\(/, ' select ').slice(0, -1);

  const update = db('authorizedApps').where('username', username)
    .andWhere('appName', appName)
    .update({ permissions: JSON.stringify(permissions) })
    .toString();

  const query = `BEGIN; 
  LOCK TABLE "authorizedApps" IN SHARE ROW EXCLUSIVE MODE;
  WITH upsert AS (${update} RETURNING *) 
  ${insert} WHERE NOT EXISTS (SELECT * FROM upsert);
  COMMIT;`;

  return db.raw(query);
}

module.exports = {
  addPermissionToDB,
};
