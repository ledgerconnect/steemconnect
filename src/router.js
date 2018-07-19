import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Market from './views/Market.vue';
import About from './views/About.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/market/:asset', name: 'market', component: Market },
    { path: '/about', name: 'about', component: About },
  ],
});
