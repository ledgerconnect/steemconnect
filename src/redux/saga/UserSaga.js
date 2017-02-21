import {takeLatest} from 'redux-saga/effects';
// import {call, put, select, fork} from 'redux-saga/effects';

export default sagaMiddleware => {
  sagaMiddleware.run(function* loginWatch() {
    yield* takeLatest('user/usernamePasswordLogin', usernamePasswordLogin);
  })
}


/**
@arg {object} action.username - Blockchain username.  This is hashed with the password and key_type to create private keys.
@arg {object} action.password - Password or WIF private key.  A WIF is only one key type, a password can create all four
key_types: active, owner, posting, memo.
*/
function* usernamePasswordLogin({payload: {username, password}}) {

}
