module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('authorizations', {
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
    scope: {
      type: Sequelize.JSONB,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('authorizations'),
};
