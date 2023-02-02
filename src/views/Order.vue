<template>
  <div class="order-container container">
    <header>
      <ul class="header">
        <li class="back-icon">
          <van-icon name="arrow-left" size="0.64rem" color="#fff" @click="router.back()" />
        </li>
        <li class="login">
          <slot>
            <span>提交订单</span>
          </slot>
        </li>
        <li class="home-icon">
          <van-icon name="home-o" color="#fff" size="0.64rem" @click="goHome" />
        </li>
      </ul>
    </header>
    <section ref="wrapper">
      <div>
        <div class="address-msg">收货信息：</div>

        <div class="address" v-if="address" @click="goAddr">
          <div class="addr-msg">
            <div class="basic-msg">
              <span class="name">{{address.name}}</span>
              <span>{{address.tel}}</span>
            </div>
            <div class="main-msg">
              <!-- <span class="default active" v-if="item.isDefault == '1'">[默认]</span> -->
              <span>{{address.province}} &nbsp;</span>
              <span>{{address.city}} &nbsp;</span>
              <span>{{address.county}} &nbsp;</span>
              <span>{{address.addressDetail}}</span>
            </div>
          </div>
          <div class="addr-arrow">
            <van-icon name="arrow" color="#999" size="0.64rem" />
          </div>
        </div>
        <div class="address" v-else @click="goAddr">
          <div class="addr-msg" style="line-height: 1.333rem; text-align: center; font-size: 0.48rem">
            暂无收货地址，请添加
          </div>
          <div class="addr-arrow">
            <van-icon name="arrow" color="#999" size="0.64rem" />
          </div>
        </div>

        <div class="payment">
          <div class="payment-title">支付方式</div>
          <van-radio-group v-model="payment" direction="horizontal">
            <van-radio name="wx" icon-size="0.4267rem">微信支付</van-radio>
            <van-radio name="ali" icon-size="0.4267rem">支付宝支付</van-radio>
          </van-radio-group>
        </div>
        <ul class="goods">
          <li v-for="item in goodsList" :key="item.id">
            <div class="goods-img">
              <img :src="item.goods_imgUrl" alt="">
            </div>
            <div class="goods-content">
              <div class="goods-title">{{item.goods_name}}</div>
              <div class="goods-type">规格: 无</div>
              <div class="goods-total">
                <span class="price">￥{{item.goods_price}}</span>
                <span class="num">x{{item.goods_num}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer>
      <div class="order-total">
        <span>共</span>
        <b>{{total.num}}</b>
        <span>件，</span>
        <span>总金额：</span>
        <em>￥{{parseFloat(total.price).toFixed(2)}}</em>
      </div>
      <div class="order-topay" @click="goPayment">
        提交订单
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onActivated, onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import request from '@/common/api/request.js'
import BScroll from 'better-scroll'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import bus from '@/common/bus.js'
import qs from 'qs'
const router = useRouter()
const route = useRoute()
const store = useStore()
const { proxy } = getCurrentInstance()
let bs = null
// 支付方式
const payment = ref('wx')
// 地址
let address = ref({})
// 默认地址
let defaultAddr = computed(() => store.getters.defaultAddr)
// 商品列表
const goodsList = ref([])
// 订单总计
const total = ref({
  price: 0,
  num: 0
})
const goHome = () => {
  router.push({ name: 'Home' })
}
// 查询地址
const getAddress = async () => {
  const res = await request({
    url: '/api/getAddr',
    method: 'POST',
    headers: {
      token: true
    }
  })
  store.commit('INIT_ADDR', res.data)

  // 如果有默认地址
  if (defaultAddr.value.length) {
    address.value = defaultAddr.value[0]
  } else {
    // 没有默认地址则返回地址列表的第一项
    address.value = store.state.address.addrList[0]
  }
}
// 查询订单
const getOrder = async () => {
  const res = await request({
    url: '/api/selectOrder',
    method: 'POST',
    data: {
      orderId: store.state.order.orderId
    }
  })
  // 存储订单
  store.commit('INIT_ORDER', res.data)
  total.value = {
    price: res.data[0].goods_price,
    num: res.data[0].goods_num
  }
  // 订单表没设计好，这里的订单项通过路由参数传递，也可以保证持久化 （正常应该使用订单表中返回的res数据，毕竟orderId的持久化都做了）
  goodsList.value = JSON.parse(route.query.goodsList)
  proxy.$nextTick(() => {
    if (bs) {
      bs.destroy()
    }
    bs = new BScroll(proxy.$refs.wrapper, {
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
    bs.scrollTo(0, 1)
  })
}

// 进入地址页
const goAddr = () => {
  router.push({
    name: 'Address',
    query: {
      type: 'select'
    }
  })
}

// 提交订单
const goPayment = async () => {
  if (!address.value) {
    showToast('请填写收货地址')
    return
  }
  // 发送请求： ==》 1. 修改订单状态 2. 删除购物车数据
  const res = await request({
    url: '/api/submitOrder',
    method: 'POST',
    headers: {
      token: true
    },
    data: {
      orderId: store.state.order.orderId,
      shopArr: goodsList.value.map(item => {
        return item.id
      })
    }
  })
  if (res.success) {
    // 成功修改订单状态和删除购物车后再发送支付请求
    let nameArr = goodsList.value.map(item => {
      return item.goods_name
    })
    // 支付接口需要传递的参数
    let dataOrder = {
      orderId: store.state.order.orderId,
      name: nameArr.join(''),
      price: total.value.price
    }
    const res = await request({
      url: '/api/payment',
      method: 'POST',
      headers: {
        token: true,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // qs是增加安全性的序列化,序列化成为URL的形式
      data: qs.stringify(dataOrder)
    })
    if (res.success) {
      // 打开支付宝支付页面
      window.location.href = res.paymentUrl
    }
  }
}

onBeforeMount(() => {
  getAddress()
  getOrder()
})
onActivated(() => {
  bus.on('selectPath', e => {
    address.value = JSON.parse(e)
  })
  getOrder()
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
  .home-icon {
    margin-right: 0.2667rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.address-msg {
  padding: 0.2667rem 0.4rem 0;
  font-size: 0.3733rem;
  font-weight: 700;
}
.address {
  display: flex;
  height: 2.1333rem;
  border: 1px solid #efefef;
  margin: 0.2667rem 0;
  background-color: #fff;
  .addr-msg {
    box-sizing: border-box;
    height: 100%;
    width: 90%;
    padding: 0.4rem;
    font-size: 0.3733rem;
    .basic-msg {
      margin: 0.1333rem 0 0.2667rem 0;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      .name {
        // span是行内元素，宽高属性不生效，margin和padding只有left和right生效

        padding-right: 0.5333rem;
      }
      span {
        font-weight: 700;
      }
    }
    .main-msg {
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      .default {
        padding-right: 0.2667rem;
      }
      .active {
        color: #e1251b;
      }
    }
  }
  .addr-arrow {
    height: 100%;
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.payment {
  border: 1px solid #efefef;
  height: 2.1333rem;
  font-size: 0.3733rem;
  background-color: #fff;
  margin: 0.2667rem 0;
  .payment-title {
    font-weight: 700;
    padding: 0.2667rem 0.4rem 0.4rem 0.4rem;
  }
  .van-radio-group {
    padding: 0 0.4rem;
    .van-radio {
      padding-right: 0.2667rem;
      margin: 0;
    }
  }
}
.goods {
  background-color: #fff;
  border: 1px solid #efefef;
  margin: 0.2667rem 0;
  li {
    border-bottom: 1px solid #efefef;
    padding: 0.2667rem;
    height: 2.1333rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 1.9733rem;
      height: 1.9733rem;
      vertical-align: middle;
    }
    .goods-content {
      height: 1.9733rem;
      flex: 1;
      font-size: 0.3733rem;
      padding-left: 10px;
      .goods-title {
        padding-bottom: 0.64rem;
        font-size: 0.3733rem;
      }
      .goods-type {
        padding-bottom: 0.2133rem;
        color: #999;
      }
      .goods-total {
        display: flex;
        justify-content: space-between;
        .price {
          color: #e1251b;
        }
      }
    }
  }
}
footer {
  display: flex;
  width: 100%;
  height: 1.2rem;
  border-top: 1px solid #fcfcfc;
  justify-content: space-between;
  .order-total {
    padding-left: 0.2667rem;
    line-height: 1.2rem;
    span {
      font-size: 0.3733rem;
    }
    b {
      color: #e1251b;
      font-size: 0.4267rem;
      padding: 0 0.1333rem;
    }
    em {
      color: #e1251b;
      font-size: 0.48rem;
      font-style: normal;
    }
  }
  .order-topay {
    width: 3.2rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 0.48rem;
    color: #fff;
    background-color: #e1251b;
    text-align: center;
  }
}
</style>