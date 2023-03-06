import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Toasted from 'vue-toasted';
import i18n from '../i18n';
import { Plugin } from 'vue-fragment';
const cookies = require('vue-cookies');

Vue.config.productionTip = false;

const app = new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
// const formatter = Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 });
function formatNumberWithCommas(n) {
  const parts = n.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function formatNumber(amount, toFixedValue = undefined) {
  const processAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (processAmount == null || isNaN(processAmount)) {
    return '-'
  } else {
    return toFixedValue
      ? formatNumberWithCommas(parseFloat(processAmount.toFixed(toFixedValue)))
      : formatNumberWithCommas(processAmount)
  }
}

function getCommonDecimal(amount) {
  if (amount < 1) return 6
  if (amount < 10) return 4
  return 2
}

export function formatCommonNumber(amount) {
  const processAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (processAmount == null || isNaN(processAmount)) {
    return '-'
  }
  if (processAmount === 0) return '0'
  if (processAmount < 0.000001) return '<0.000001'
  return formatNumber(processAmount, getCommonDecimal(processAmount))
}
Vue.filter('numberFormat', (num) => {
  if (parseFloat(num)) {
    return formatCommonNumber(num);
  }
  return num;
});
Vue.filter('toUpperCase', str => {
  if (!str) return str;
  if (typeof str !== 'string') return str;
  return str.toUpperCase();
});
Vue.use(cookies);
Vue.use(Toasted, {
  // router,
  position: 'top-center',
  duration: 2000,
});
Vue.use(Plugin);

export default app;