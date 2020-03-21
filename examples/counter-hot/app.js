import Vue from 'vue'
import store from './store'
import CounterControls from './CounterControls.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
new Vue({
  el: '#app',
  store,
  render: h => h(CounterControls)
})
