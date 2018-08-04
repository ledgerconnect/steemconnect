import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Market = () => import(/* webpackChunkName: "market" */ '@/views/Market.vue');
const Login = () => import(/* webpackChunkName: "login" */ '@/views/Login.vue');
const OpenOrders = () => import(/* webpackChunkName: "open-orders" */ '@/views/OpenOrders.vue');
const Portfolio = () => import(/* webpackChunkName: "portfolio" */ '@/views/Portfolio.vue');
const TransferHistory = () => import(/* webpackChunkName: "transfer-history" */ '@/views/TransferHistory.vue');
const Permissions = () => import(/* webpackChunkName: "permissions" */ '@/views/Permissions.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');

Vue.use(Router);

const requireAuth = (to, from, next) => {
  if (!store.state.auth.account.name) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: requireAuth,
      component: Home,
    },
    {
      path: '/market/:asset',
      name: 'market',
      beforeEnter: requireAuth,
      component: Market,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        layout: 'light',
      },
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
      path: '/permissions',
      name: 'permissions',
      beforeEnter: requireAuth,
      component: Permissions,
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
