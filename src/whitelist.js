import Vue from 'vue'
import Whitelist from './views/WhitelistUser.vue'
import store from './store'
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import Toasted from 'vue-toasted'
Vue.use(Vuetify);

Vue.use(Toasted, {
  // router,
  position: 'top-center',
  duration: 2000,
})

const app = new Vue({
  store,
  render: h => h(Whitelist)
}).$mount('#app')

export default app