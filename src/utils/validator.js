import steem from 'steem';

export const isUsername = async (username) => {
  const accounts = await steem.api.getAccountsAsync([username]);
  return !!accounts[0];
};

export const isNotUsername = async username => !await isUsername(username);

export const accountExist = (rule, value, callback) => {
  steem.api.getAccounts([value], (err, result) => {
    if (result && result.find(a => a.name === value)) {
      callback();
    } else {
      callback(['Account name is not found']);
    }
  });
};

export const accountNotExist = (rule, value, callback) => {
  steem.api.getAccounts([value], (err, result) => {
    if (result && result.find(a => a.name === value)) {
      callback(['Account name is not available']);
    } else {
      callback();
    }
  });
};

// https://github.com/steemit/condenser/blob/eaf8a02658b8deaef376ec90b81d0866e52582cc/app/utils/ChainValidation.js#L4
export const validateAccountName = (rule, value, callback) => {
  let i;
  let label;
  let len;
  let suffix;

  suffix = 'Account name should ';
  if (!value) {
    callback([`${suffix}not be empty.`]);
  }
  const length = value.length;
  if (length < 3) {
    callback([`${suffix}be longer.`]);
  }
  if (length > 16) {
    callback([`${suffix}be shorter.`]);
  }
  if (/\./.test(value)) {
    suffix = 'Each account segment should ';
  }
  const ref = value.split('.');
  for (i = 0, len = ref.length; i < len; i += 1) {
    label = ref[i];
    if (!/^[a-z]/.test(label)) {
      callback([`${suffix}start with a letter.`]);
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      callback([`${suffix}have only letters, digits, or dashes.`]);
    }
    if (/--/.test(label)) {
      callback([`${suffix}have only one dash in a row.`]);
    }
    if (!/[a-z0-9]$/.test(label)) {
      callback([`${suffix}end with a letter or digit.`]);
    }
    if (!(label.length >= 3)) {
      callback([`${suffix}be longer`]);
    }
  }
  callback();
};
