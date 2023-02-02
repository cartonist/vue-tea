import { GET_LIST, CHECK_ALL, UN_CHECK_ALL, CHECK_ITEM, DEL_CARTS } from './mutations-types.js'
import request from '@/common/api/request.js'
import { showToast, showFailToast, showSuccessToast,showConfirmDialog  } from 'vant'
import 'vant/es/toast/style'
import 'vant/es/dialog/style';
import router from '../../router/index.js';
const user = {
  state: {
    // 购物车数据
    list: [],
    // 选中的购物车项id
    selectList: []
  },
  getters: {
    // 判断是否全选
    isCheckedAll(state) {
      return state.list.length == state.selectList.length;
    },
    // 总计
    total(state) {
      let total = {
        num: 0,
        price: 0
      }
      state.list.forEach( item => {
        if(item.checked) {
          total.num += parseFloat(item.goods_num)
          total.price += item.goods_num * item.goods_price
        }
      })
      return total
    }
  },
  mutations: {
    [GET_LIST](state, list) {
      state.list = list
      state.selectList = []
      list.forEach(item => {
        state.selectList.push(item.id)
      })
    },
    // 全选
    [CHECK_ALL](state) {
      state.selectList = state.list.map(item => {
        item.checked = true
        return item.id
      })
    },
    // 全不选
    [UN_CHECK_ALL](state) {
      state.selectList = []
      state.list.forEach(item => {
        item.checked = false
      })
    },
    // 单选
    [CHECK_ITEM](state, id) {
      let index = state.selectList.indexOf(id)
      if(index > -1) {
        state.selectList.splice(index,1)
      } else {
        state.selectList.push(id)
      }
    },
    //删除
    [DEL_CARTS](state, arrCart) {
      if(arrCart.length == 1) {
        state.list.some((item, index) => {
          if(item.id == arrCart[0]) {
            state.list.splice(index,1)
            return true
          }
        })
        state.selectList.some((item, index) => {
          if(item == arrCart[0]) {
            state.selectList.splice(index,1)
            return true
          }
        })
      } else {
        state.list = state.list.filter(item => {
          return state.selectList.indexOf(item.id) == -1
        })
        state.selectList = []
      }
    }
  },
  // 用于提交mutations,支持异步操作
  actions: {
    // 全选
    checkAllFn({ commit, getters}) {
      getters.isCheckedAll ? commit('UN_CHECK_ALL') : commit('CHECK_ALL')
    },
    // 删除
    delGoodsFn({state, commit}, id) {
      let arrCart = []
      if(typeof id == 'number') {
        // 单个删除
        arrCart = [id]
      } else {
        // 多选删除
        arrCart = state.selectList
      }
      // 多选时，空选则阻止
      if (state.selectList.length == 0 && typeof id != 'number') {
        showToast('请选择商品')
      }
      else
      showConfirmDialog({
        message:
          '是否确认删除？',
        confirmButtonColor: '#bc0707'
      })
        .then(async () => {
          const res = await request({
            url: '/api/delCarts',
            method: 'POST',
            data: {
              arrId:arrCart
            }
          })
          // 删除数据库后更新vuex中的list和selectList
          commit('DEL_CARTS', arrCart)
          showSuccessToast(res.msg)
        })
        .catch(() => {
          // on cancel
        });
    }
  }
}
export default user