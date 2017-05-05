'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('apps', [{
      client_id: 'busy.app',
      secret: 'secretkey-abc-123',
      redirect_uris: 'http://localhost:3000/demo',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('apps', null, {});
  }
};
