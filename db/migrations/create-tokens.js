module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    client_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    token: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
    .then(() => {
      queryInterface.addIndex('tokens', { fields: ['token'], unique: true });
      queryInterface.sequelize.query('CREATE FUNCTION public.delete_expired_tokens_func()\n' +
      'RETURNS trigger\n' +
      'LANGUAGE \'plpgsql\'\n' +
      'COST 100\n' +
      'VOLATILE NOT LEAKPROOF\n' +
      'AS $BODY$\n' +
      'BEGIN\n' +
      'DELETE FROM tokens WHERE created_at < NOW() - INTERVAL \'8 days\';\n' +
      'DELETE FROM tokens WHERE id IN(SELECT id FROM tokens WHERE client_id = new."client_id" AND "user" = new."user" ORDER BY created_at DESC OFFSET 20);\n' +
      'RETURN NULL;\n' +
      'END;\n' +
      '$BODY$;');
      queryInterface.sequelize.query('CREATE TRIGGER delete_expired_tokens_trigger\n' +
        'AFTER INSERT\n' +
        'ON public.tokens\n' +
        'FOR EACH ROW\n' +
        'EXECUTE PROCEDURE public.delete_expired_tokens_func();');
    }),
  down: (queryInterface) => {
    queryInterface.dropTable('tokens');
    queryInterface.sequelize.query('DROP TRIGGER delete_expired_tokens_trigger ON public.tokens;');
    queryInterface.sequelize.query('DROP FUNCTION public.delete_expired_tokens_func();');
  },
};
