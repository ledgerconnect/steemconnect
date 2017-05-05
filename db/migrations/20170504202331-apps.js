'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('apps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: { type: Sequelize.STRING },
      secret: { type: Sequelize.STRING },
      redirect_uris: { type: Sequelize.TEXT },
      admins: { type: Sequelize.TEXT },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    }).then(function () {
      queryInterface.addIndex('apps', ['client_id']);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('apps');
  }
};
