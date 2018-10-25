import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import VueScrollTo from 'vue-scrollto';

Vue.use(VueScrollTo);

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
