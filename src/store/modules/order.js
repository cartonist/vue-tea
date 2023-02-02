import {INIT_ORDER} from './mutations-types.js'
const order = {
  state: {
    // 订单列表
    list: [],
    // 订单号
    orderId: localStorage.getItem('tea_orderId') || ''
  },
  getters: {

  },
  mutations: {
    [INIT_ORDER](state, order) {
      state.list = order
      state.orderId = order[0].order_id
      localStorage.setItem('tea_orderId', order[0].order_id)
    }
  }

}
export default order