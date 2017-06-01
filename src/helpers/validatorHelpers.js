import steem from 'steem';

export const isUsername = async (username) => {
  const accounts = await steem.api.getAccountsAsync([username]);
  return !!accounts[0];
};

export const isNotUsername = async (username) => !await isUsername(username);

export const accountExist = (rule, value, callback) => {
  steem.api.getAccounts([value], (err, result) => {
    if (result[0]) {
      callback();
    } else {
      callback(['Account name is not found']);
    }
  });
};
