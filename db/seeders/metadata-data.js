'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('metadata', [
      {
        client_id: 'busy.app',
        user: 'fabien',
        user_metadata: JSON.stringify({
          locale: 'fr',
          color: 'blue',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'busy.app',
        user: 'val',
        user_metadata: JSON.stringify({
          locale: 'ru',
          color: 'red',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('metadata', null, {});
  }
};
