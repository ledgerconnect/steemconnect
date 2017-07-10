module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('operations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      operation_type: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      operation_payload: {
        type: Sequelize.JSONB
      },
      tx_id: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('operations');
  }
};
