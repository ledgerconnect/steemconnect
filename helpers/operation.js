const _ = require('lodash');

/** Parse error message from Steemd response */
const getErrorMessage = (error) => {
  return _.has(error, 'payload.error.data.stack[0].format')
    ? error.payload.error.data.stack[0].format
    : '';
};

module.exports = {
  getErrorMessage,
};
