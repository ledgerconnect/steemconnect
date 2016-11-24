
exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('apps', (table) => {
      table.dropColumns('name', 'tagline', 'description');
    }),
    knex.schema.raw('ALTER TABLE apps ALTER COLUMN author DROP NOT NULL'),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('apps'),
  ]);
};
