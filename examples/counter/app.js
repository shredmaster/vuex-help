import 'babel-polyfill'
import Vue from 'vue'
import Counter from './Counter.vue'
import store from './store'
import Vuex from 'vuex'

Vue.use(Vuex)
new Vue({
  el: '#app',
  store,
  render: h => h(Counter)
})
