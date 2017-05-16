import steem from 'steem';

export const isUsername = async (username) => {
  const accounts = await steem.api.getAccountsAsync([username]);
  return !!accounts[0];
};

export const isNotUsername = async (username) => !await isUsername(username);
