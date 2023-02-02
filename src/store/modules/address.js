import { INIT_ADDR } from './mutations-types.js'
const address = {
  state: {
    addrList : []
  },
  getters: {
    // 默认地址
    defaultAddr(state){
      return state.addrList.filter((item) => {
        return item.isDefault == '1'
      })
    }
  },
  mutations: {
    [INIT_ADDR](state, addrArr) {
      state.addrList = addrArr
    }
  },
  actions: {}

}
export default address