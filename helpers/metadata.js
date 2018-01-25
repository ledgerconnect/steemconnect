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
    const userMetadata = await metadata.findOne({
      attributes: ['user_metadata'],
      where: { client_id: proxy, user },
    });
    if (userMetadata) {
      /** Update */
      await metadata.update(
        { user_metadata: JSON.stringify(newMetadata) },
        { where: { client_id: proxy, user } },
      );
    } else {
      await metadata.create({
        client_id: proxy,
        user,
        user_metadata: JSON.stringify(newMetadata),
      });
    }
  } catch (error) {
    debug('updateUserMetadata failed', error);
    throw new Error(error);
  }
};

module.exports = {
  getUserMetadata,
  updateUserMetadata,
};
