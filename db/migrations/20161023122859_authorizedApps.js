
exports.up = function up(knex, Promise) {
  return knex.schema.createTable('authorizedApps', (table) => {
    table.increments();
    table.string('username').notNullable();
    table.string('appName').notNullable();
    table.unique(['username', 'appName']);
    table.jsonb('permissions').notNullable();
    table.timestamps();
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('authorizedApps');
};
