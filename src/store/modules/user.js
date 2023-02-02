import { USER_LOGIN,INIT_USER,LOGIN_OUT } from './mutations-types.js'
const user = {
  state: {
    loginStatus: false, //登录状态
    token: null, //token
    userInfo: null //用户信息
  },
  getters: {

  },
  mutations: {
    [USER_LOGIN](state, user) {
      state.loginStatus = true
      state.token = user.token
      state.userInfo = user
      // 持久化存储
      localStorage.setItem('teaUserInfo', JSON.stringify(user))
    },
    // 从本地读取用户信息
    [INIT_USER](state) {
      const userInfo = JSON.parse(localStorage.getItem('teaUserInfo'))
      if( userInfo ) {
        state.loginStatus = true
        state.token = userInfo.token
        state.userInfo = userInfo
      }
    },
    // 退出登录
    [LOGIN_OUT](state) {
      state.loginStatus = false
      state.token = null
      state.userInfo = null
      // 持久化存储
      localStorage.removeItem('teaUserInfo')
    }
  },
  actions: {

  }
}
export default user