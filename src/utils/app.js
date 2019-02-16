import Promise from 'bluebird';
import steem from '@steemit/steem-js';

const getApp = username => new Promise((resolve, reject) => {
  steem.api.getAccountsAsync([username]).then((accounts) => {
    let metadata;
    try {
      metadata = JSON.parse(accounts[0].json_metadata);
      if (metadata.profile && metadata.profile.type && metadata.profile.type === 'app') {
        resolve(metadata.profile);
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

export {
  getApp,
  getApps,
};
