const { metadata } = require('../db/models');
const debug = require('debug')('sc2:server');

/** Get user_metadata */
const getUserMetadata = async (proxy, user) => {
  try {
    const userMetadata = await metadata.findOne({
      attributes: ['user_metadata'],
      where: { client_id: proxy, user },
    });
    if (userMetadata) {
      return JSON.parse(userMetadata.user_metadata);
    }
  } catch (error) {
    debug('getUserMetadata failed', error);
    throw new Error(error);
  }
  return {};
};

/** Update user_metadata */
const updateUserMetadata = async (proxy, user, newMetadata) => {
  try {
    await metadata.upsert({ user_metadata: JSON.stringify(newMetadata), client_id: proxy, user });
  } catch (error) {
    debug('updateUserMetadata failed', error);
    throw new Error(error);
  }
};

module.exports = {
  getUserMetadata,
  updateUserMetadata,
};
