'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('apps', [
      {
        client_id: 'busy.app',
        secret: 'secretkey-abc-123',
        owner: 'siol',
        redirect_uris: JSON.stringify(['http://localhost:3000/demo', 'https://v2.steemconnect.com/demo', 'https://busy.org/callback']),
        name: 'Busy.org',
        description: 'Ensuring compensation for the creators of value',
        icon: 'https://byteball.co/img/logo.jpg',
        website: 'https://busy.org',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'simple-app',
        secret: 'secretkey-abc-456',
        owner: 'val',
        redirect_uris: JSON.stringify(['http://localhost:3000/demo', 'https://v2.steemconnect.com/demo', 'https://busy.org/callback']),
        name: 'Simple App',
        description: 'This is a test app.',
        icon: 'https://byteball.co/img/logo.jpg',
        website: 'https://example.com',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('apps', null, {});
  }
};
