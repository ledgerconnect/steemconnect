'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('authorizations', [
      {
        client_id: 'busy.app',
        user: 'fabien',
        scope: JSON.stringify(['login']),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'busy.app',
        user: 'hellosteem',
        scope: JSON.stringify(['vote', 'custom_json']),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('authorizations', null, {});
  }
};
