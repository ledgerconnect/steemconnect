module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('apps', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    client_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    secret: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    owner: {
      type: Sequelize.STRING,
    },
    redirect_uris: {
      type: Sequelize.JSONB,
    },
    name: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    icon: {
      type: Sequelize.TEXT,
    },
    website: {
      type: Sequelize.TEXT,
    },
    beneficiaries: {
      type: Sequelize.JSONB,
    },
    is_approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    is_public: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_disabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    .then(() => queryInterface.addIndex('apps', { fields: ['client_id'], unique: true }))
    .then(() => queryInterface.addIndex('apps', { fields: ['client_id', 'secret'], unique: true }))
    .then(() => queryInterface.addIndex('apps', { fields: ['client_id', 'redirect_uris'], unique: true })),
  down: queryInterface => queryInterface.dropTable('apps'),
};
