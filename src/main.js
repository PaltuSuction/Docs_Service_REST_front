import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import store from './store'
import Axios from "axios";

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuex)

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
new Vue({
  router,
  render: h => h(App),
  store: store
}).$mount('#app')
