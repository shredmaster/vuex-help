import 'babel-polyfill'
import Vue from 'vue'
import store from './store'
import App from './components/App.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
new Vue({
  store, // inject store to all children
  el: '#app',
  render: h => h(App)
})
