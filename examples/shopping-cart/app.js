import 'babel-polyfill'
import Vue from 'vue'
import App from './components/App.vue'
import store from './store'
import { currency } from './currency'
import Vuex from 'vuex'
import VuexHelp from 'vuex-help'

Vue.filter('currency', currency)
Vue.use(VuexHelp)
Vue.use(Vuex)
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
