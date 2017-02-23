import {takeLatest, put, call, select, take, fork} from 'redux-saga/effects';
import {fromJS} from 'immutable';
import {auth, api} from 'steem';
import crypto from 'crypto';

export default sagaMiddleware => {
  if(process.env.BROWSER) {
    sagaMiddleware.run(loadLocalStorage);
    sagaMiddleware.run(fork(saveLocalStorage2));
    // sagaMiddleware.run(function* () {
    //   yield takeLatest('user/update', saveLocalStorage);
    // });

    sagaMiddleware.run(function* () {
      yield takeLatest('user/login', login);
    });
    sagaMiddleware.run(function* () {
      yield takeLatest('user/logout', logout);
    });
  }
}

function* loadLocalStorage() {
  console.log('loadLocalStorage');
  const value = fromJS(localStorage.user || {})
  yield put({type: 'user/update', payload: {key: 'localStorage', value}})
}

// function* saveLocalStorage({payload: {key}}) {
//   const keyPath = Array.isArray(key) ? key : [key]
//   if(keyPath.indexOf(k => k === 'localStorage') === -1)
//     return
//   // if(keyPath[0] !== 'localStorage')
//   //   return
//
//   const ls = yield select(state => state.user.get('localStorage'))
//   const json = JSON.stringify(ls, null, 0)
//   console.log('new localStorage', json)
//   localStorage.user = json
// }

function* saveLocalStorage2() {
  while(true) { // eslint-disable-line no-constant-condition
    const lsBefore = yield select(state => state.user.get('localStorage'))
    yield take({type: 'user/update'})
    const lsAfter = yield select(state => state.user.get('localStorage'))
    console.log('saveLocalStorage2');
    if(lsBefore !== lsAfter) {
      const json = JSON.stringify(lsAfter, null, 0)
      console.log('new localStorage', json)
      localStorage.user = json
    }
  }
}

const updateAction = (reducerName, key, value) => ({type: `update/${reducerName}`, payload: {key, value}})

const userLogin = ({error = null, inProgress = false, privateKeys = null}) =>
  updateAction('user', 'login', {error, loggedIn: privateKeys != null, inProgress, privateKeys})

function* logout() {
  yield put(userLogin({loggedIn: false}))
}

/**
@arg {object} action.username - Blockchain username.  This is hashed with the password and key_type to create private keys.
@arg {object} action.password - Password or WIF private key.  A WIF is only one key type, a password can create all four
key_types: active, owner, posting, memo.
*/
function* login({payload: {username, password}}) {
  yield put(userLogin({inProgress: true}))

  const [account] = yield call(api.getAccounts, [username])
  if (!account) {
    yield put(userLogin({error: 'Username does not exist'}))
    return
  }

  const {privateKeys, isWif} = yield getAccountPrivateKeys(account, username, password)

  const activeOrPosting = privateKeys.active != null || privateKeys.posting != null

  if(privateKeys.owner != null) {
    if(isWif || !activeOrPosting) {
      yield put(userLogin({error: 'Please do not use your owner key here'}))
      return
    }
    // Never keep an owner key around.. Instead, prompt and discard when needed
    delete privateKeys.owner;
  }

  if(!activeOrPosting) {
    yield put(userLogin({error: 'Incorrect password'}))
    return
  }
  yield put(userLogin({privateKeys}))
}

/** Return any private keys that match acccount's authorities or memo key. */
function* getAccountPrivateKeys(account, username, password) {
  const privateKeys = {}
  const isWif = auth.isWif(password)
  // This WIF may appear in one or more key authorities
  for(const role of ['owner', 'active', 'posting', 'memo']) {
    const accountRole = account[role]
    const wif = isWif ? password : auth.toWif(username, password, role)
    const pubkey = yield wifToPublicCache(wif) // optimization
    const match = accountRole ?
      accountRole.key_auths.find(k => k[1] === pubkey) != null :
      account.memo_key === pubkey

    if(match) {
      privateKeys[role] = wif
      privateKeys[`${role}Pubkey`] = pubkey
      if(accountRole) {
        privateKeys[`${role}Threshold`] = accountRole.weight_threshold
        const keyWeight = accountRole.key_auths.find(k => k[1] === pubkey)[0]
        privateKeys[`${role}KeyWeight`] = keyWeight
      }
    }
  }
  return {privateKeys, isWif}
}

function* wifToPublicCache(wif) {
  const key = crypto.createHash('sha256').update(wif).digest().toString('base64')
  const pubkeyCache = yield select(state => state.user.getIn(['localStorage', 'wifToPublicCache', key]))
  if(pubkeyCache)
    return pubkeyCache

  const pubkey = auth.wifToPublic(wif) // S L O W
  yield fork(put({type: 'user/update', payload: {key: ['localStorage', 'wifToPublicCache', key], value: pubkey}}))
  return pubkey
}
