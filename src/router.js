import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { isElectron, isChromeExtension } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Create = () => import(/* webpackChunkName: "create" */ '@/views/Create.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const Permissions = () => import(/* webpackChunkName: "permissions" */ '@/views/Permissions.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');

Vue.use(Router);

const requireAuth = (to, from, next) => {
  if (!store.state.auth.account.name) {
    const path = hasAccounts() ? '/login' : '/create';

    next({ path, query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

const beforeLogin = (to, from, next) => {
  if (!hasAccounts()) {
    next({ path: '/create', query: { redirect: to.query.redirect } });
  } else {
    next();
  }
};

export default new Router({
  mode: isElectron() ? 'hash' : 'history',
  routes: [
    {
      path: isChromeExtension() ? '/index.html' : '/',
      redirect: '/login',
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      meta: {
        layout: 'light',
      },
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: beforeLogin,
      component: Login,
      meta: {
        layout: 'light',
      },
    },
    {
      path: '/permissions',
      name: 'permissions',
      beforeEnter: requireAuth,
      component: Permissions,
    },
    {
      path: '/sign/*',
      name: 'sign',
      beforeEnter: requireAuth,
      component: Sign,
    },
    {
      path: '/settings',
      name: 'settings',
      beforeEnter: requireAuth,
      component: Settings,
    },
    {
      path: '/about',
      name: 'about',
      beforeEnter: requireAuth,
      component: About,
    },
  ],
});
