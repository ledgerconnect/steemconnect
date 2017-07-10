'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('operations', [
      {
        client_id: 'busy.app',
        user: 'guest123',
        token: 'secret-token-123',
        operation_type: 'vote',
        operation_payload: JSON.stringify({
          voter: 'guest123',
          author: 'god-is-love',
          permlink: 're-monita-hey-steemit-this-is-pulido-20170703t071500172z',
          weight:	7518,
        }),
        tx_id: 'bd2b53b716971ed8725edf05dc8576282a825ef5',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'busy.app',
        user: 'guest123',
        token: 'secret-token-123',
        operation_type: 'comment',
        operation_payload: JSON.stringify({
          parent_author: 'siol',
          parent_permlink: 'test',
          author: 'guest123',
          permlink: 're-siol-test-20170627t161337463z',
          title: 'Test',
          body: 'This is a test using Steem.js v0.6.0-beta.0.',
          json_metadata: { tags:['test'], app: 'steemjs/0.6.0-beta.0' },
        }),
        tx_id: '6f2ffb57392720942064a6ae20265f7fe8a63cc7',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('operations', null, {});
  }
};
