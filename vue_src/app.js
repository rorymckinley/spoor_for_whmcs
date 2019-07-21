import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import storeConfig from './store-config.js';

Vue.use(Vuex);

const store = new Vuex.Store(storeConfig);

new Vue({
  el: '#app',
  store,
  render: (createElement) => {
    return createElement(App);
  },
});
