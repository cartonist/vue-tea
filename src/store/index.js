import { createStore } from 'vuex'
import user from './modules/user.js'
import cart from './modules/cart.js'
import address from './modules/address.js'
import order from './modules/order.js'
export default createStore({
  state: {
    newData: [],
    bs: null
  },
  mutations: {
    setNewData(state, data) {
      state.newData = data
    },
    setBS(state, bs) {
      state.bs = bs
    }
  },
  modules: {
    user,
    cart,
    address,
    order
  }
})