const union = require('lodash/union');
const config = require('../config.json');

const pushAuthorizationScope = async (req, clientId, scope) => {
  const authorization = {
    client_id: clientId,
    user: req.user,
    scope: scope.length > 0 ? scope : config.authorized_operations,
  };
  const authorizations = await req.db.authorizations.findOne({
    where: { client_id: clientId, user: req.user },
  });

  if (!authorizations) {
    await req.db.authorizations.create(authorization);
  } else {
    authorization.scope = union(authorization.scope, authorizations.scope);
    await req.db.authorizations.update(
      authorization,
      {
        where: { client_id: clientId, user: req.user },
      }
    );
  }
};

module.exports = {
  pushAuthorizationScope,
};
