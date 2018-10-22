import Vue from 'vue';
import Router from 'vue-router';
import getStoreInstance from '@/store';
import { isElectron, isChromeExtension } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Import = () => import(/* webpackChunkName: "import" */ '@/views/Import.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const Permissions = () => import(/* webpackChunkName: "permissions" */ '@/views/Permissions.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');

Vue.use(Router);

const requireAuth = (to, from, next) => {
  getStoreInstance(store => {
    if (!store.state.auth.account.name) {
      const name = hasAccounts() ? 'login' : 'import';

      next({ name, query: { redirect: to.fullPath } });
    } else {
      next();
    }
  });
};

const beforeLogin = (to, from, next) => {
  if (!hasAccounts()) {
    next({ name: 'import', query: { redirect: to.query.redirect } });
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
      path: '/import',
      name: 'import',
      component: Import,
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
  ],
});
