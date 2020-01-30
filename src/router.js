import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { isWeb } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Import = () => import(/* webpackChunkName: "import" */ '@/views/Import.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue');
const Auths = () => import(/* webpackChunkName: "auths" */ '@/views/Auths.vue');
const LoginRequest = () =>
  import(/* webpackChunkName: "login-request" */ '@/views/LoginRequest.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Authorize = () => import(/* webpackChunkName: "authorize" */ '@/views/Authorize.vue');
const Revoke = () => import(/* webpackChunkName: "revoke" */ '@/views/Revoke.vue');
const Profile = () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const Accounts = () => import(/* webpackChunkName: "accounts" */ '@/views/Accounts.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');
const Apps = () => import(/* webpackChunkName: "apps" */ '@/views/Apps.vue');
const Developers = () => import(/* webpackChunkName: "developers" */ '@/views/Developers.vue');
const Error404 = () => import(/* webpachChunkName: "error-404" */ '@/views/404.vue');

Vue.use(Router);

const requireAuth = (to, from, next, params) => {
  if (!store.state.auth.account.name) {
    const name = hasAccounts() ? 'login' : 'import';
    const redirect = to.fullPath === '/' ? undefined : to.fullPath;
    const query = { redirect };
    if (params && params.authority) query.authority = params.authority;
    next({ name, query });
  } else {
    next();
  }
};

const beforeLogin = (to, from, next) => {
  if (!hasAccounts()) {
    const redirect = to.query.redirect === '/' ? undefined : to.query.redirect;
    next({ name: 'import', query: { redirect } });
  } else {
    next();
  }
};

const redirectToLoginRequest = (to, from, next) => {
  const { query } = to;
  const clientId = query.client_id;
  delete query.client_id;
  let scope = 'posting';
  if (query.scope === 'login') scope = 'login';
  if (query.scope && query.scope.includes('offline')) {
    scope = 'posting';
    query.response_type = 'code';
  }
  query.scope = scope;
  next({ name: 'login-request-app', params: { clientId }, query });
};

export default new Router({
  mode: isWeb() ? 'history' : 'hash',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: isWeb() ? 'home' : 'dashboard',
      beforeEnter: isWeb() ? null : requireAuth,
      component: isWeb() ? Home : Dashboard,
    },
    {
      path: '/import',
      name: 'import',
      component: Import,
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: beforeLogin,
      component: Login,
    },
    {
      path: '/auths',
      name: 'auths',
      beforeEnter: requireAuth,
      component: Auths,
    },
    {
      path: '/oauth2/authorize',
      beforeEnter: redirectToLoginRequest,
    },
    {
      path: '/login-request',
      name: 'login-request',
      component: LoginRequest,
    },
    {
      path: '/login-request/:clientId',
      name: 'login-request-app',
      component: LoginRequest,
    },
    {
      path: '/sign/*',
      name: 'sign',
      component: Sign,
    },
    {
      path: '/authorize/@:username',
      redirect: to => ({
        name: 'authorize',
        params: {
          username: to.params.username,
        },
      }),
    },
    {
      path: '/authorize/:username',
      name: 'authorize',
      component: Authorize,
    },
    {
      path: '/revoke/@:username',
      redirect: to => ({
        name: 'revoke',
        params: {
          username: to.params.username,
        },
      }),
    },
    {
      path: '/revoke/:username',
      name: 'revoke',
      component: Revoke,
    },
    {
      path: '/profile',
      name: 'profile',
      beforeEnter: requireAuth,
      component: Profile,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Accounts,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/apps',
      name: 'apps',
      component: Apps,
    },
    {
      path: '/developers',
      name: 'developers',
      component: Developers,
    },
    {
      path: '*',
      component: Error404,
      name: 'error-404',
    },
  ],
});
