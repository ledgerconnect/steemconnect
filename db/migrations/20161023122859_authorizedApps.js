
exports.up = function up(knex) {
  return knex.schema.createTable('authorizedApps', (table) => {
    table.increments();
    table.string('username').notNullable();
    table.string('app').notNullable();
    table.unique(['username', 'app']);
    table.string('permissions');
    table.timestamps(false, true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable('authorizedApps');
};
