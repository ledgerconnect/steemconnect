const queryOperationFields = {
  vote: {
    type: 'string',
    key: 'voter'
  },
  comment: {
    type: 'string',
    key: 'author'
  },
  transfer: {
    type: 'string',
    key: 'from'
  },
  custom_json: {
    type: 'array',
    index: 0,
    key: 'required_posting_auths'
  }
};

const isOperationAuthor = (operation, query, username) => {
  if (Object.prototype.hasOwnProperty.call(queryOperationFields, operation)) {
    const field = queryOperationFields[operation];
    if (!field) return false;

    if (field.type === 'string') {
      return query[field.key] === username;
    } else if (field.type === 'array') {
      return query[field.key] && query[field.key].length > field.index && query[field.key][field.index] === username;
    }
    return false;
  }
  return false;
}

const setDefaultParameters = (operation, query, username) => {
  const _query = query;
  if (Object.prototype.hasOwnProperty.call(queryOperationFields, operation)) {
    const field = queryOperationFields[operation];
    if (!field) return _query;

    if (field.type === 'string' && !_query[field.key]) {
      _query[field.key] = username;
    } else if (field.type === 'array') {
      if (!_query[field.key]) {
        _query[field.key] = [username];
      } else if (!_query[field.key][field.index]) {
        _query[field.key][field.index] = username;
      }
    }
  }
  return _query;
}

module.exports = {
  setDefaultParameters,
  isOperationAuthor
};
