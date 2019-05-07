export const KEYCHAIN_LOCALSTORAGE_KEY = 'keychain';

export function getKeychain() {
  const storedKeychain = localStorage.getItem(KEYCHAIN_LOCALSTORAGE_KEY);
  let keychain = {};
  if (storedKeychain) {
    try {
      keychain = JSON.parse(storedKeychain);
    } catch (err) {
      console.log("Couldn't parse stored keychain", err);
    }
  }
  return keychain;
}

export function hasAccounts() {
  const keychain = getKeychain();
  return Object.keys(keychain).length !== 0;
}

export function addToKeychain(username, encryptedPassword) {
  const keychain = getKeychain();
  keychain[username] = encryptedPassword;
  localStorage.setItem(KEYCHAIN_LOCALSTORAGE_KEY, JSON.stringify(keychain));
}

export function removeFromKeychain(username) {
  const keychain = getKeychain();
  delete keychain[username];
  localStorage.setItem(KEYCHAIN_LOCALSTORAGE_KEY, JSON.stringify(keychain));
}
