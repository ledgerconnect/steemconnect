import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { isWeb } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Import = () => import(/* webpackChunkName: "import" */ '@/views/Import.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue');
const Keys = () => import(/* webpackChunkName: "keys" */ '@/views/Keys.vue');
const LoginRequest = () =>
  import(/* webpackChunkName: "login-request" */ '@/views/LoginRequest.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');
const Error404 = () => import(/* webpachChunkName: "error-404" */ '@/views/404.vue');

Vue.use(Router);

const requireAuth = (to, from, next) => {
  if (!store.state.auth.account.name) {
    const name = hasAccounts() ? 'login' : 'import';
    const redirect = to.fullPath === '/' ? undefined : to.fullPath;
    next({ name, query: { redirect } });
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
  next({ name: 'login-request-app', params: [clientId], query: to.query });
};

export default new Router({
  mode: isWeb() ? 'history' : 'hash',
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
      path: '/keys',
      name: 'keys',
      beforeEnter: requireAuth,
      component: Keys,
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
      path: '/login-request/*',
      name: 'login-request-app',
      component: LoginRequest,
    },
    {
      path: '/sign/*',
      name: 'sign',
      component: Sign,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '*',
      component: Error404,
      name: 'error-404',
    },
  ],
});
