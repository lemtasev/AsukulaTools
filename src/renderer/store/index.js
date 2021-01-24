import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'
// import { createSharedMutations } from 'vuex-electron'
import createPromiseAction from './promise-action'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState(), // 持久化插件
    createSharedMutations(), // 多进程间共享vuex，会影响action返回promise
    createPromiseAction() // 用来处理action无法返回promise
  ],
  strict: process.env.NODE_ENV !== 'production'
})
