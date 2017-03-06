import {inBrowser} from 'utils';
import {takeLatest, put, call, select, take, fork} from 'redux-saga/effects';
import {fromJS} from 'immutable';
import {auth, api} from 'steem';
import crypto from 'crypto';

import {updateAction} from '../actions/update';

const userLoginAction = ({error = null, inProgress = false, privateKeys = null}) =>
  updateAction('user', 'login', {error, loggedIn: privateKeys != null, inProgress, privateKeys})

export default sagaMiddleware => {
  if (inBrowser()) {
    sagaMiddleware.run(initUserLogin);
    sagaMiddleware.run(loadLocalStorage);
    sagaMiddleware.run(saveLocalStorage);
    sagaMiddleware.run(function* () {
      yield takeLatest('user/login', login);
    });
    sagaMiddleware.run(function* () {
      yield takeLatest('user/logout', logout);
    });
  }
}

function* loadLocalStorage() {
  const value = fromJS(JSON.parse(localStorage.user || '{}'))
  yield put(updateAction('user', 'localStorage', value))
}

function* saveLocalStorage() {
  while (true) { // eslint-disable-line no-constant-condition
    const lsBefore = yield select(state => state.user.get('localStorage'))
    yield take('user/update')
    const lsAfter = yield select(state => state.user.get('localStorage'))
    if (lsBefore !== lsAfter) {
      const json = JSON.stringify(lsAfter, null, 0)
      localStorage.user = json
    }
  }
}

function* initUserLogin() {
  yield put(userLoginAction({}))
}

function* logout() {
  yield put(userLoginAction({loggedIn: false}))
}

/**
@arg {object} action.username - Blockchain username.  This is hashed with the password and key_type to create private keys.
@arg {object} action.password - Password or WIF private key.  A WIF is only one key type, a password can create all four
key_types: active, owner, posting, memo.
*/
function* login({payload: {username, password}}) {
  yield put(userLoginAction({inProgress: true}))

  const [account] = yield call([api, api.getAccountsAsync], [username])
  if (!account) {
    yield put(userLoginAction({error: 'Username does not exist'}))
    return
  }

  const {privateKeys, isWif} = yield getAccountPrivateKeys(account, username, password)

  const activeOrPosting = privateKeys.active != null || privateKeys.posting != null

  if (privateKeys.owner != null) {
    if (isWif || !activeOrPosting) {
      yield put(userLoginAction({error: 'Please do not use your owner key here'}))
      return
    }
    // Never keep an owner key around.. Instead, prompt and discard when needed
    delete privateKeys.owner;
  }

  if (!activeOrPosting) {
    yield put(userLoginAction({error: 'Incorrect password'}))
    return
  }
  yield put(userLoginAction({privateKeys}))
}

/** Return any private keys that match acccount's authorities or memo key. */
function* getAccountPrivateKeys(account, username, password) {
  const privateKeys = {}
  const isWif = auth.isWif(password)
  // This WIF may appear in one or more key authorities
  for (const role of ['owner', 'active', 'posting', 'memo']) {
    const accountRole = account[role]
    const wif = isWif ? password : auth.toWif(username, password, role)
    const pubkey = yield wifToPublicCache(wif) // optimization
    const match = accountRole ?
      accountRole.key_auths.find(k => k[0] === pubkey) != null :
      account.memo_key === pubkey

    if (match) {
      privateKeys[role] = wif
      privateKeys[`${role}Pubkey`] = pubkey
      if (accountRole) {
        privateKeys[`${role}Threshold`] = accountRole.weight_threshold
        const keyWeight = accountRole.key_auths.find(k => k[0] === pubkey)[1]
        privateKeys[`${role}KeyWeight`] = keyWeight
      }
    }
  }
  return {privateKeys, isWif}
}

function* wifToPublicCache(wif) {
  const key = crypto.createHash('sha256').update(wif).digest().toString('base64')
  const pubkeyCache = yield select(state => state.user.getIn(['localStorage', 'wifToPublicCache', key]))
  if (pubkeyCache)
    return pubkeyCache

  const pubkey = auth.wifToPublic(wif) // S L O W
  yield put(updateAction('user', ['localStorage', 'wifToPublicCache', key], pubkey))
  return pubkey
}
