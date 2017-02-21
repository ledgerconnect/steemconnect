import {takeLatest, put} from 'redux-saga/effects';
import {fromJS} from 'immutable';

export default sagaMiddleware => {

  if(process.env.BROWSER) {
    sagaMiddleware.run(loadLocalStorage);
    sagaMiddleware.run(function* () {
      yield takeLatest('user/login', login);
    });
  }
}


/**
@arg {object} action.username - Blockchain username.  This is hashed with the password and key_type to create private keys.
@arg {object} action.password - Password or WIF private key.  A WIF is only one key type, a password can create all four
key_types: active, owner, posting, memo.
*/
function login({payload: {username, password}}) {
  // console.log('login');
}

function* loadLocalStorage() {
  const value = fromJS(localStorage.user || {})
  yield put({type: 'user/update', payload: {key: 'localStorage', value}})
}
