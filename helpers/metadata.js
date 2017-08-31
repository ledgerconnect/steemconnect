const { metadata } = require('../db/models');

/** Get user_metadata */
const getUserMetadata = async (proxy, user) => {
  try {
    const userMetadata = await metadata.findOne({ where: { client_id: proxy, user } });
    if (userMetadata) {
      return userMetadata.user_metadata;
    }
  } catch (error) {
    console.log(error);
  }
  return {};
};

/** Update user_metadata */
const updateUserMetadata = async (proxy, user, newMetadata) => {
  try {
    const userMetadata = await metadata.findOne({ where: { client_id: proxy, user } });
    if (userMetadata) {
      /** Update */
      await metadata.update({ user_metadata: newMetadata }, { where: { client_id: proxy, user } });
    } else {
      await metadata.create({
        client_id: proxy,
        user,
        user_metadata: newMetadata,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserMetadata,
  updateUserMetadata,
};
