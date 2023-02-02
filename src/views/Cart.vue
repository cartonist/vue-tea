<template>
  <div class="cart-container container">
    <header>
      <ul class="header">
        <li class="back-icon">
          <van-icon name="arrow-left" size="0.64rem" color="#fff" @click="goBack" />
        </li>
        <li class="login">
          <slot>
            <span>购物车</span>
          </slot>
        </li>
        <li class="edit" @click="isEditBar">
          <span>{{editStatus?'完成':'编辑'}}</span>
        </li>
      </ul>
    </header>
    <section v-if="!loginStatus" ref="wrapper">
      <div>
        <van-empty description="您尚未登录，请先登录" image-size="5.333rem">
          <van-button round type="primary" class="login-btn" @click="goLogin">登录</van-button>
        </van-empty>
      </div>

    </section>
    <section v-else-if="itemList.length" ref="wrapper">
      <div>
        <div class="cart-title">
          <van-checkbox :checked="isCheckedAll" @click="checkAll" checked-color="#e1251b" icon-size="0.533rem"></van-checkbox>
          <span>商品</span>
        </div>
        <ul>
          <li v-for="item in itemList" :key="item.id">
            <div class="checkbox">
              <van-checkbox v-model="item.checked" checked-color="#e1251b" icon-size="0.533rem" @click="checkItem(item.id)"></van-checkbox>
            </div>
            <div>
              <img :src="item.goods_imgUrl" alt="">
            </div>
            <div class="goods">
              <div class="goods_title">
                <span>
                  {{ item.goods_name }}
                </span>
                <van-icon name="delete-o" size="0.5333rem" @click="store.dispatch('delGoodsFn',item.id)" />
              </div>
              <div class="goods-price">
                <p>￥{{item.goods_price}}</p>
              </div>
              <van-stepper v-model="item.goods_num" integer input-width="0.8rem" button-size="0.64rem" @change="updateNum($event, item.id)" />
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section v-else ref="wrapper">
      <div>
        <van-empty description="暂无商品" image-size="5.333rem" />
      </div>
      <!-- <div>
        首页
      </div> -->
    </section>
    <footer v-if="itemList.length && loginStatus">
      <ul class="cart-footer">
        <li class="radio">
          <van-checkbox :checked="isCheckedAll" @click="checkAll" checked-color="#e1251b" icon-size="0.533rem"></van-checkbox>
        </li>
        <li class="total">
          <div v-show="!editStatus">
            共有
            <span class="count">{{total.num}}</span>
            件商品
          </div>
          <div v-show="!editStatus">
            总计:
            <span class="price">￥{{total.price.toFixed(2)}} + 0茶币</span>
          </div>
        </li>
        <li class="order" :class="selectList.length == 0?'order_bgc_g':'order order_bgc_r'" v-if="editStatus" @click="store.dispatch('delGoodsFn')">删除</li>
        <li class="order" :class="selectList.length == 0?'order_bgc_g':'order order_bgc_r'" v-else @click="goOrder">去结算</li>
      </ul>
    </footer>
  </div>

</template>

<script setup>
import { ref } from '@vue/reactivity'
import { computed, getCurrentInstance, onBeforeMount } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import request from '@/common/api/request.js'
import { useStore } from 'vuex'
import BScroll from 'better-scroll'
import { showToast } from 'vant'
import 'vant/es/toast/style'

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()
const editStatus = ref(false)
const loginStatus = ref(true)

const goBack = () => {
  router.back()
}
const isEditBar = () => {
  editStatus.value = !editStatus.value
}

const checked = ref(true)
const itemList = computed(() => store.state.cart.list)
const selectList = computed(() => store.state.cart.selectList)
const isCheckedAll = computed(() => store.getters.isCheckedAll)
const total = computed(() => store.getters.total)

const checkAll = () => {
  store.dispatch('checkAllFn')
}
const checkItem = id => {
  store.commit('CHECK_ITEM', id)
}
// 修改购物车数量
const updateNum = async (value, id) => {
  const res = await request({
    url: 'api/updateNum',
    method: 'POST',
    headers: {
      token: true
    },
    data: {
      id,
      num: value
    }
  })
}
const goOrder = async () => {
  if (selectList.value.length == 0) {
    showToast('请选择商品')
    return
  } else {
    // 选中的商品项
    let newList = itemList.value.filter(item => {
      return selectList.value.find(id => item.id == id)
    })
    // 生成一个订单
    const res = await request({
      url: '/api/addOrder',
      method: 'POST',
      headers: {
        token: true
      },
      data: {
        arr: newList
      }
    })
    // 存储订单
    store.commit('INIT_ORDER', res.data)
    // 进入提交订单页面
    router.push({
      name: 'Order',
      query: {
        goodsList: JSON.stringify(newList)
      }
    })
  }
}
const goLogin = () => {
  router.push({ name: 'Login' })
}
onBeforeMount(async () => {
  // 未登录
  if (!localStorage.getItem('teaUserInfo')) {
    loginStatus.value = false
    return
  }

  const res = await request({
    url: 'api/selectCart',
    method: 'POST',
    headers: {
      token: true
    }
  })
  // 手动添加checked属性，表示选中状态
  res.forEach(item => {
    item.checked = true
  })
  store.commit('GET_LIST', res)
  proxy.$nextTick(() => {
    new BScroll(proxy.$refs.wrapper, {
      pullUpLoad: true, // 上拉加载
      scrollbar: false, //滚动条
      pullDownRefresh: false, //下拉加载
      mouseWheel: true,
      disableTouch: false,
      click: true,
      probeType: 3
      // bounce: false
      // and so on
    })
  })
})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.1733rem;
  background-color: #e1251b;
  li {
    height: 100%;
  }
  .back-icon {
    margin-left: 0.2667rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login {
    font-size: 0.48rem;
    color: #fff;
    line-height: 1.1733rem;
  }
  .edit {
    font-size: 0.48rem;
    margin-right: 0.2667rem;
    line-height: 1.1733rem;
    color: #fff;
  }
}
.cart-title {
  display: flex;
  padding: 0.2667rem;
  span {
    padding-left: 0.2667rem;
    font-size: 0.48rem;
    font-weight: 700;
  }
}
section {
  ul {
    li {
      background-color: #fff;
      height: 2.6667rem;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      margin-bottom: 0.2667rem;
      .checkbox {
        padding: 0 0.2667rem;
      }
      img {
        width: 1.9733rem;
        height: 1.9733rem;
        vertical-align: middle;
      }
      .goods {
        flex: 1;
        height: 1.9733rem;
        font-size: 0.3733rem;
        padding: 0 0.2667rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .goods_title {
          height: 0.8rem;
          display: flex;
          justify-content: space-between;
          span {
            vertical-align: top;
            white-space: nowrap;
            width: 5.3333rem;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .goods-price {
          font-size: 0.4267rem;
          color: #e1251b;
        }
        .van-stepper {
          text-align: right;
        }
      }
    }
  }
}
footer {
  .cart-footer {
    background-color: #fff;
    height: 1.2rem;
    border-top: 1px solid #efefef;
    display: flex;
    align-items: center;
    .radio {
      padding: 0 0.4rem;
    }
    .total {
      div {
        padding: 0.0533rem 0;
      }
      font-size: 0.3733rem;
      flex: 1;
      .count {
        color: #e1251b;
      }
      .price {
        font-size: 0.4267rem;
        color: #e1251b;
      }
    }
    .order {
      width: 3.2rem;
      height: 1.2rem;
      line-height: 1.2rem;
      text-align: center;
      font-size: 0.48rem;
      color: #fff;
      background-color: #e1251b;
    }
    .order_bgc_r {
      background-color: #e1251b;
    }
    .order_bgc_g {
      background-color: gray;
    }
  }
}
.login-btn {
  width: 5.333rem;
  height: 1.0667rem;
  background-color: #e1251b;
  border: none;
}
.van-empty {
  &:deep(p) {
    font-size: 0.4267rem !important;
  }
}
</style>