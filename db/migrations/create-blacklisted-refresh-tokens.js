module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('blacklisted_refresh_tokens', {
    token: {
      allowNull: false,
      type: Sequelize.TEXT,
      primaryKey: true,
    },
    client_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user: {
      allowNull: false,
      type: Sequelize.STRING,
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
      queryInterface.addIndex('blacklisted_refresh_tokens', { fields: ['token'], unique: true });
    }),
  down: (queryInterface) => {
    queryInterface.dropTable('blacklisted_refresh_tokens');
  },
};
