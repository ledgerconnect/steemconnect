module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('refresh_tokens', {
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
      queryInterface.addIndex('refresh_tokens', { fields: ['token'], unique: true });
    }),
  down: (queryInterface) => {
    queryInterface.dropTable('refresh_tokens');
  },
};
