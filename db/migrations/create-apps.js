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
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    is_public: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    is_approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('apps'),
};
