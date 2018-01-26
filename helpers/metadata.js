const { metadata } = require('../db/models');

/** Get user_metadata */
const getUserMetadata = async (proxy, user) => {
  try {
    const userMetadata = await metadata.findOne({ where: { client_id: proxy, user } });
    if (userMetadata) {
      return userMetadata.user_metadata;
    }
  } catch (error) {
    throw new Error(error);
  }
  return {};
};

/** Update user_metadata */
const updateUserMetadata = async (proxy, user, newMetadata) => {
  try {
    await metadata.upsert({ user_metadata: JSON.stringify(newMetadata), client_id: proxy, user });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getUserMetadata,
  updateUserMetadata,
};
