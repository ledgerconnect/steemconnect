
exports.up = function up(knex) {
  return knex.schema.createTable('apps', (table) => {
    table.increments();
    table.string('app').notNullable().unique();
    table.string('author').notNullable();
    table.string('name').notNullable();
    table.jsonb('permissions');
    table.jsonb('origins');
    table.jsonb('redirect_urls');
    table.string('tagline');
    table.string('description');
    table.timestamps(false, true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable('apps');
};
