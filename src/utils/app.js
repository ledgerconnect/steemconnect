import Promise from 'bluebird';
import steem from '@steemit/steem-js';

const getApp = username => new Promise((resolve, reject) => {
  steem.api.getAccountsAsync([username]).then((accounts) => {
    let metadata;
    try {
      metadata = JSON.parse(accounts[0].json_metadata);
      if (metadata.profile && metadata.profile.type && metadata.profile.type === 'app') {
        const appAccount = accounts[0];
        appAccount.profile = metadata.profile;
        resolve(appAccount);
      } else {
        reject(`The account @${username} is not an application`);
      }
    } catch (e) {
      reject(`Failed to parse account @${username} "json_metadata"`);
    }
  }).catch((e) => {
    reject(`Failed to load account @${username}`, e);
  });
});

const getAccountProfile = username => new Promise((resolve, reject) => {
  steem.api.getAccountsAsync([username]).then((accounts) => {
    let metadata;
    try {
      metadata = JSON.parse(accounts[0].json_metadata);
      if (metadata.profile) {
        resolve(metadata.profile);
      } else {
        resolve({});
      }
    } catch (e) {
      resolve({});
    }
  }).catch((e) => {
    reject(`Failed to load account @${username}`, e);
  });
});

const getApps = () => new Promise(async (resolve, reject) => {
  const step = 100;
  const username = 'steemscript';

  try {
    let follows = await steem.api.getFollowingAsync(username, '', 'blog', step);
    const allFollows = follows;

    while (follows.length === step) {
      const startFrom = allFollows[allFollows.length - 1].following;
      follows = await steem.api.getFollowingAsync(username, startFrom, 'blog', step);
      allFollows.push(...follows.slice(1));
    }
    const following = allFollows.map(follow => follow.following);

    resolve(following);
  } catch (e) {
    reject(e);
  }
});

const isSelfManaged = (owner) => {
  const managedOwner = {
    weight_threshold: 1,
    account_auths: [['steemconnect', 1]],
    key_auths: [['STM82hFUKjN2j8KGqQ8rz9YgFAbMrWFuCPkabtrAnUfV2JQshNPLz', 1]],
  };
  return JSON.stringify(owner) !== JSON.stringify(managedOwner);
};

export {
  getApp,
  getApps,
  getAccountProfile,
  isSelfManaged,
};
