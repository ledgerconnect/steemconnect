import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { isElectron, isChromeExtension } from '@/helpers/utils';
import { hasAccounts } from '@/helpers/keychain';

const Market = () => import(/* webpackChunkName: "market" */ '@/views/Market.vue');
const Create = () => import(/* webpackChunkName: "create" */ '@/views/Create.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const OpenOrders = () => import(/* webpackChunkName: "open-orders" */ '@/views/OpenOrders.vue');
const Portfolio = () => import(/* webpackChunkName: "portfolio" */ '@/views/Portfolio.vue');
const TransferHistory = () => import(/* webpackChunkName: "transfer-history" */ '@/views/TransferHistory.vue');
const Contacts = () => import(/* webpackChunkName: "contacts" */ '@/views/Contacts.vue');
const Permissions = () => import(/* webpackChunkName: "permissions" */ '@/views/Permissions.vue');
const Sign = () => import(/* webpackChunkName: "sign" */ '@/views/Sign.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const AppStore = () => import(/* webpackChunkName: "app-store" */ '@/views/AppStore.vue');
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
      path: '/market/:asset',
      name: 'market',
      beforeEnter: requireAuth,
      component: Market,
    },
    {
      path: '/open-orders',
      name: 'open-orders',
      beforeEnter: requireAuth,
      component: OpenOrders,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      beforeEnter: requireAuth,
      component: Portfolio,
    },
    {
      path: '/transfer-history',
      name: 'transfer-history',
      beforeEnter: requireAuth,
      component: TransferHistory,
    },
    {
      path: '/contacts',
      name: 'contacts',
      beforeEnter: requireAuth,
      component: Contacts,
    },
    {
      path: '/permissions',
      name: 'permissions',
      beforeEnter: requireAuth,
      component: Permissions,
    },
    {
      path: '/app-store',
      name: 'app-store',
      beforeEnter: requireAuth,
      component: AppStore,
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
