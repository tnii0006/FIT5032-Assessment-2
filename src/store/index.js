import { createStore } from 'vuex'
import user from './user'

const store = createStore({
  state: {
    // 全局状态
  },
  mutations: {
    // 同步修改状态
  },
  actions: {
    // 异步操作
  },
  modules: {
    // 模块化状态管理
  }
})

// 初始化 Firebase 认证
user.initAuth()

export default store