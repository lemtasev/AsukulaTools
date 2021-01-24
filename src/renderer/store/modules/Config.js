import Vue from 'vue'
const state = {
  userConfig: {}
}

// 加工state成员给外界，getters['moduleName/function']
const getters = {
  getUserConfig (state, getters) {
    return state.userConfig
  }
}

// state成员操作，Mutation 必须是同步函数，commit('moduleName/function')
const mutations = {
  clearUserConfig (state) {
    for (let key in state.userConfig) {
      Vue.delete(state.userConfig, key)
    }
  },
  update (state, {key, value}) {
    Vue.set(state.userConfig, key, value)
  },
  updateAll (state, newConfig) {
    for (let key in newConfig) {
      Vue.set(state.userConfig, key, newConfig[key])
    }
  }
}

// 异步操作，dispatch('moduleName/function')
const actions = {
  do ({ commit }, { type, data }) {
    // 调用方式：dispatch('moduleName/do', {type: mutationsFunctionName, data: mutationsFunctionArgs})
    return new Promise((resolve, reject) => {
      commit(type, data)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
