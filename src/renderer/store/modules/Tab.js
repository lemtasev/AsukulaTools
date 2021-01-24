const state = {
  openedTabs: []
}

// 加工state成员给外界，getters['moduleName/function']
const getters = {
  get (state, getters) {
    return state.openedTabs
  }
}

// state成员操作，Mutation 必须是同步函数，commit('moduleName/function')
const mutations = {
  // 点击菜单栏，如果tab已打开，激活tab，如果没打开，打开tab
  open (state, args) {
    let has = false
    state.openedTabs.forEach(it => {
      if (it.link === args.link) {
        has = true
        it.active = true
      } else {
        it.active = false
      }
    })
    if (!has) {
      args.active = true
      state.openedTabs.push(args)
    }
  },
  pushNullTab (state) {
    state.openedTabs.push({
      name: '空',
      active: false
    })
  },
  closeTab (state, n) {
    if (state.openedTabs[n].active && state.openedTabs.length > 1) {
      if (n === 0) {
        // 关闭第1个已激活窗口，自动激活n + 1的窗口
        state.openedTabs[1].active = true
      } else {
        // 关闭非第1个已激活窗口，自动激活n - 1的窗口
        state.openedTabs[n - 1].active = true
      }
    }
    state.openedTabs.splice(n, 1)
  },
  // 点击tab，切换已激活tab，并更新菜单栏选中项
  activeTab (state, n) {
    state.openedTabs.forEach((it, i) => {
      if (n === i) {
        it.active = true
      } else {
        it.active = false
      }
    })
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
