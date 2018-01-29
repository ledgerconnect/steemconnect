module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('metadata', {
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
    user_metadata: {
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
      .then(() => queryInterface.addIndex('metadata', { fields: ['client_id', 'user'], unique: true }))
      .then(() => queryInterface.addConstraint('metadata', ['client_id', 'user'], {
        type: 'unique',
        name: 'metadata_client_id_user_key',
      })),
  down: queryInterface => queryInterface.dropTable('metadata'),
};
