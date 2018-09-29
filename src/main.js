import 'primer/index.scss';
import '@vue/ui/dist/vue-ui.css';
import '@/styles.less';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueUi from '@vue/ui';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import moment from 'moment';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store/index';
import messages from '@/translation.json';
import numberFormats from '@/number.json';
import createIdleDetector from '@/helpers/idle';

let ipc = null;
if (typeof window !== 'undefined' && window.require) {
  ipc = window.require('electron').ipcRenderer;
}

// eslint-disable-next-line import/prefer-default-export
export const idleDetector = createIdleDetector({
  autostop: true,
});

const requireComponent = require.context('./components', true, /[\w-]+\.vue$/);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')));
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.filter('date', value => moment.utc(value).local().fromNow());
Vue.filter('timeOnly', value => moment.utc(value).local().format('HH:mm'));
Vue.filter('dateHeader', value => moment(value, 'YYYY-MM-DD').format('MMM D, YYYY'));

Vue.use(VueUi);
Vue.use(VueI18n);

store.dispatch('loadSettings');

if (ipc) {
  ipc.on('handleProtocol', (e, arg) => {
    const newUrl = `/${arg.slice('steem://'.length)}`;

    router.push(newUrl);
  });
}


const i18n = new VueI18n({
  locale: 'en',
  messages,
  numberFormats,
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
