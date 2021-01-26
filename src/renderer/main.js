import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'

import less from 'less'

import * as utils from '@/assets/js/utils'
import * as ElectronVueProcess from '@/assets/js/electron-vue-process'

Vue.use(less)
Vue.use(ElementUI)

Vue.prototype.$moment = moment
Vue.prototype.$utils = utils
Vue.prototype.$process = ElectronVueProcess

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
