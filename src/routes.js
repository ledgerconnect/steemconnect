import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import ModalWrapper from './ModalWrapper';
import Profile from './profile/Profile';
import Authorize from './auth/Authorize';
import Developers from './developers/Developers';
import AppSetup from './apps/AppSetup';
import Summary from './summary/Summary';
import PublicPage from './public';
import Apps from './apps/Apps';
import App from './apps/App';
import Transfer from './transfer/Transfer';
import SignUp from './auth/Signup';
import Login from './auth/Login';
import cookie from '../lib/cookie';

module.exports = (
  <Route path="/">
    {!cookie.get('auth') && <IndexRoute component={PublicPage} />}
    <Route path="/login" component={Login} />
    <Route path="/register" component={SignUp} />
    <Route component={Wrapper}>
      <IndexRoute component={Summary} />
      <Route path="/apps" component={Apps} />
      <Route path="/apps/@:app" component={App} />
      <Route path="/apps/setup" component={AppSetup} />
      <Route path="/profile" component={Profile} />
      <Route path="/developers" component={Developers} />
    </Route>

    <Route component={ModalWrapper}>
      <Route path="/transfer(/@:to)(/:amount)(/:currency)(/:memo)" component={Transfer} />
      <Route path="/authorize/@:app" component={Authorize} />
    </Route>
  </Route>
);
