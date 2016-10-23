
exports.up = function up(knex, Promise) {
  return knex.schema.createTable('authorizedApps', (table) => {
    table.increments();
    table.string('username').notNullable();
    table.string('appUserName').notNullable();
    table.unique(['username', 'appUserName']);
    table.string('permissions');
    table.timestamps();
  });
};

exports.down = function down(knex, Promise) {
  return knex.schema.dropTable('authorizedApps');
};
