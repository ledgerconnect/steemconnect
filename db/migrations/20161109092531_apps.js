
exports.up = function up(knex, Promise) {
  return Promise.all([
    knex.schema.table('apps', (table) => {
      table.enu('env', ['dev', 'prod']).defaultTo('dev');
    }),
  ]);
};

exports.down = function down(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('apps'),
  ]);
};
