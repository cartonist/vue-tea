<template>
  <div class="detail-container">
    <header>
      <div class="header-returns" v-show="!isShow" :style="opacity1">
        <div>
          <van-icon name="arrow-left" size="0.533rem" color="#fff" @click="goBack" />
        </div>
        <div>
          <van-icon name="home-o" color="#fff" size="0.533rem" @click="goHome" />
        </div>
      </div>
      <div class="bg" v-show="!isShow" :style="opacity2"></div>
      <div class="header-bar" v-show="isShow" :style="opacity2">
        <div class="back">
          <van-icon name="arrow-left" size="0.533rem" color="#000" @click="goBack" />
        </div>
        <div class="center">
          <div :class="currentIndex == 0?'border-red':''" @click="goScroll(0)">
            <span>商品评价</span>
          </div>
          <div :class="currentIndex == 1?'border-red':''" @click="goScroll(1)">
            <span>商品详情</span>
          </div>
        </div>
        <div class="home">
          <van-icon name="home-o" color="#000" size="0.533rem" @click="goHome" />
        </div>
      </div>
    </header>
    <section ref="wrapper">
      <div>
        <div class="swiper-container">
          <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
            <van-swipe-item v-for="item in swiperItem" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </van-swipe-item>
            <!-- 自定义指示器 -->
            <template #indicator="{ active, total }">
              <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
            </template>
          </van-swipe>
        </div>
        <div class="goods-msg">
          <div class="goods-name">
            <h1>{{goods.name}}</h1>
            <div>{{goods.content}}</div>
          </div>
          <div class="goods-price">
            <div class="oprice">
              <span>￥</span>
              <b>{{goods.price}}</b>
            </div>
            <div class="pprice">
              <span>价格：</span>
              <del>￥{{goods.price}}</del>
            </div>
          </div>
        </div>
        <div class="commends">
          <div class="cmd-header">
            <div class="title">
              茶友点评（199）
            </div>
            <div class="more">
              <span>查看更多 ></span>
            </div>
          </div>
          <ul>
            <li class="cmd-content">
              <div class="user">
                <img src="/img/user01.jpeg" alt="">
                <span class="username">
                  觉得舒服了
                </span>
              </div>
              <div class="commend">
                茶叶好
              </div>
              <div class="time">
                2022-07-24 12:06
              </div>
            </li>
            <li class="cmd-content">
              <div class="user">
                <img src="/img/user01.jpeg" alt="">
                <span class="username">
                  觉得舒服了
                </span>
              </div>
              <div class="commend">
                茶叶好
              </div>
              <div class="time">
                2022-07-24 12:06
              </div>
            </li>
            <li class="cmd-content">
              <div class="user">
                <img src="/img/user01.jpeg" alt="">
                <span class="username">
                  觉得舒服了
                </span>
              </div>
              <div class="commend">
                茶叶好
              </div>
              <div class="time">
                2022-07-24 12:06
              </div>
            </li>
            <li class="cmd-content">
              <div class="user">
                <img src="/img/user01.jpeg" alt="">
                <span class="username">
                  觉得舒服了
                </span>
              </div>
              <div class="commend">
                茶叶好
              </div>
              <div class="time">
                2022-07-24 12:06
              </div>
            </li>
          </ul>
        </div>
        <div class="goods-details">
          <div class="title">商品详情</div>
          <ul class="details-img">
            <li>
              <img src="/img/goods-details01.jpg" alt="">
            </li>
            <li>
              <img src="/img/goods-details02.jpg" alt="">
            </li>
            <li>
              <img src="/img/goods-details03.jpg" alt="">
            </li>
          </ul>
        </div>
      </div>
    </section>
    <footer>
      <ul>
        <li class="service">
          <van-icon name="service" color="#aaa" size="0.5333rem" />
          <span>客服</span>
        </li>
        <li class="favorite">
          <van-icon name="star-o" color="#aaa" size="0.5333rem" />
          <span>收藏</span>
        </li>
        <li class="mycart" @click="router.push({ name: 'Cart' })">
          <van-icon name="cart-o" color="#aaa" size="0.5333rem" :badge="badge?badge:''" />
          <span>购物车</span>
        </li>
        <li class="cart" @click="addCart">
          <span>加入购物车</span>
        </li>
        <li class="buy">
          <span>立即购买</span>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import BScroll from 'better-scroll'
import { computed, getCurrentInstance, onActivated, onBeforeMount, onMounted } from '@vue/runtime-core'
import request from '@/common/api/request.js'
import { useStore } from 'vuex'
import { showSuccessToast, showToast, showFailToast } from 'vant'

const store = useStore()
const swiperItem = ref([
  {
    id: 1,
    imgUrl: '/img/white01.jpeg'
  },
  {
    id: 2,
    imgUrl: '/img/white02.jpeg'
  },
  {
    id: 3,
    imgUrl: '/img/white03.jpeg'
  },
  {
    id: 4,
    imgUrl: '/img/white04.jpeg'
  },
  {
    id: 5,
    imgUrl: '/img/white05.jpeg'
  }
])
const isShow = ref(false)
const router = useRouter()
const route = useRoute()
const goods = ref({})
const allHeight = ref([])
const badge = ref(0)
let scrollY = ref(0)
let bs = null
let id = 0
const goScroll = id => {
  bs.scrollTo(0, -(allHeight.value[id] + 5), 300)
}
const opacity1 = ref({
  opacity: 1
})
const opacity2 = ref({
  opacity: 0
})
// 计算滚动的范围对应的左侧index
let currentIndex = computed(() => {
  return allHeight.value.findIndex((item, index) => {
    // 返回第一个满足条件的数组下标，函数不会再调用
    return scrollY.value >= item && scrollY.value < allHeight.value[index + 1]
  })
})
const { proxy } = getCurrentInstance()
const addCart = async () => {
  // 没有登录则跳转至登录页面
  if (!localStorage.getItem('teaUserInfo')) {
    router.push({ name: 'Login' })
    return
  }
  const id = route.query.id
  const res = await request({
    url: 'api/addCart',
    method: 'POST',
    data: {
      id
    },
    headers: {
      token: true
    }
  })
  if (res && res.success) {
    showSuccessToast(res.msg)
  }
  badge.value++
}
const getData = async () => {
  const id = route.query.id
  const res = await request({
    url: 'api/goods/id',
    params: {
      id
    }
  })
  goods.value = res
  proxy.$nextTick(() => {
    bs = store.state.bs
    if (bs) bs.destroy()
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
    store.commit('setBS', bs)
    let swiper = proxy.$refs.wrapper.getElementsByClassName('swiper-container')
    let goodsMsg = proxy.$refs.wrapper.getElementsByClassName('goods-msg')
    // 获取“茶友评论”的DOM结构
    let commends = proxy.$refs.wrapper.getElementsByClassName('commends')
    let details = proxy.$refs.wrapper.getElementsByClassName('goods-details')
    // height是“茶友评论上面所有DOM的总高度”
    let height = swiper[0].clientHeight + goodsMsg[0].clientHeight
    // clientHeight得到的高度不包括marign值，所以margin单独计算

    let cmdMarginTop = 0.022 * commends[0].clientHeight
    let detailMarginTop = 0.011 * details[0].clientHeight
    let header = 0.098 * commends[0].clientHeight

    // 先对allHeight置空
    allHeight.value = []
    allHeight.value.push(height + cmdMarginTop - header)
    allHeight.value.push(commends[0].clientHeight + height + cmdMarginTop + detailMarginTop - header)
    allHeight.value.push(10000)

    bs.on('scroll', pos => {
      scrollY.value = Math.abs(pos.y)
      if (scrollY.value > 200) {
        isShow.value = true
      } else {
        isShow.value = false
      }
      // 控制透明度 opacity1从亮到暗， opacity2从暗到亮
      let op = scrollY.value / 300
      op = op > 1 ? 1 : op
      opacity1.value = {
        opacity: 1 - op
      }
      opacity2.value = {
        opacity: op
      }
    })
  })
}
// 获取购物车数量
const getCartTotal = async () => {
  // 未登录
  if (!localStorage.getItem('teaUserInfo')) {
    return
  }
  const res = await request({
    url: 'api/selectCart',
    method: 'POST',
    headers: {
      token: true
    }
  })
  let nums = 0
  res.forEach(item => {
    nums += parseInt(item.goods_num)
  })
  badge.value = nums
}
onBeforeMount(() => {
  id = route.query.id
  getData()
  getCartTotal()
})
const goBack = () => {
  router.back()
}
onActivated(() => {
  getCartTotal()
  // 判断当前的路由参数和上一次展示该组件的参数是否一致
  if (id != route.query.id) {
    getData()
    id = route.query.id
  } else {
    proxy.$nextTick(() => {
      let bs = store.state.bs
      if (bs) bs.destroy()
      bs = new BScroll(proxy.$refs.wrapper, {
        pullUpLoad: true, // 上拉加载
        scrollbar: true, //滚动条
        pullDownRefresh: false, //下拉加载
        mouseWheel: true,
        disableTouch: false,
        click: true,
        probeType: 3
        // bounce: false
        // and so on
      })
      bs.scrollTo(0, 1)
      store.commit('setBS', bs)
      let swiper = proxy.$refs.wrapper.getElementsByClassName('swiper-container')
      let goodsMsg = proxy.$refs.wrapper.getElementsByClassName('goods-msg')
      // 获取“茶友评论”的DOM结构
      let commends = proxy.$refs.wrapper.getElementsByClassName('commends')
      let details = proxy.$refs.wrapper.getElementsByClassName('goods-details')
      // height是“茶友评论上面所有DOM的总高度”
      let height = swiper[0].clientHeight + goodsMsg[0].clientHeight
      // clientHeight得到的高度不包括marign值，所以margin单独计算

      let cmdMarginTop = 0.022 * commends[0].clientHeight
      let detailMarginTop = 0.011 * details[0].clientHeight
      let header = 0.098 * commends[0].clientHeight
      allHeight.value = []
      allHeight.value.push(height + cmdMarginTop - header)
      allHeight.value.push(commends[0].clientHeight + height + cmdMarginTop + detailMarginTop - header)
      allHeight.value.push(10000)

      bs.on('scroll', pos => {
        scrollY.value = Math.abs(pos.y)
        if (scrollY.value > 200) {
          isShow.value = true
        } else {
          isShow.value = false
        }
        // 控制透明度 opacity1从亮到暗， opacity2从暗到亮
        let op = scrollY.value / 300
        op = op > 1 ? 1 : op
        opacity1.value = {
          opacity: 1 - op
        }
        opacity2.value = {
          opacity: op
        }
      })
    })
  }
})
const goHome = () => {
  router.push({ name: 'Home' })
}
</script>

<style lang="less" scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  section {
    margin-bottom: 1.3333rem;
    flex: 1;
    overflow: hidden;
  }
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.1733rem;
  z-index: 99;
  .header-returns {
    width: 100%;
    height: 100%;
    align-content: center;
    display: flex;
    justify-content: space-between;
    div {
      margin: 0.1333rem;
      width: 0.9067rem;
      height: 0.9067rem;
      // text-align: center;
      // line-height: 0.9067rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .bg {
    position: fixed;
    // 再z-index等于99的基础上令z-index为-1表示
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.1733rem;
    background-color: #fff;
  }
  .header-bar {
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    width: 100%;
    height: 100%;
    align-content: center;
    display: flex;
    justify-content: space-between;
    .back,
    .home {
      margin: 0.1333rem;
      width: 0.9067rem;
      height: 0.9067rem;
      text-align: center;
      line-height: 0.9067rem;
    }
    .center {
      line-height: 1.1733rem;
      font-size: 0.4267rem;
      display: flex;
      div {
        margin: 0 0.4rem;
      }
    }
  }
}
.swiper-container {
  height: 10rem;
  .van-swipe {
    height: 100%;
  }
  img {
    width: 100%;
    height: 10rem;
  }
}
.custom-indicator {
  position: absolute;
  right: 0.1333rem;
  bottom: 0.1333rem;
  padding: 0.08rem 0.16rem;
  font-size: 0.3733rem;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
}
.goods-msg {
  background-color: #fff;
  padding: 0 0.2667rem;
  border-bottom: 1px solid #efefef;
  .goods-name {
    padding: 0.4rem 0;
    border-bottom: 1px solid #efefef;
    h1 {
      font-size: 0.48rem;
      font-weight: 400;
    }
    div {
      font-size: 0.3733rem;
      padding-top: 0.2667rem;
      color: #999;
    }
  }
  .goods-price {
    padding: 0.2667rem 0;
    .oprice {
      color: #e1251b;
      span {
        font-size: 0.4267rem;
      }
      b {
        font-size: 0.7467rem;
        font-weight: 400;
      }
    }
    .pprice {
      padding-top: 0.1333rem;
      font-size: 0.2667rem;
      color: #999;
    }
  }
}
.commends {
  padding: 0.2667rem;
  margin-top: 0.2667rem;
  background-color: #fff;
  .cmd-header {
    width: 100%;
    height: 0.5867rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      height: 100%;
      position: relative;
      margin-left: 0.2667rem;
      line-height: 0.5867rem;
      font-size: 0.4267rem;
      &::before {
        content: '';
        display: inline-block;
        width: 0.1333rem;
        height: 0.4267rem;
        background-color: #e1251b;
        position: absolute;
        top: 0.0533rem;
        left: -0.32rem;
      }
    }
    .more {
      height: 100%;
      color: #999;
      line-height: 0.5867rem;
      font-size: 0.3733rem;
    }
  }
  .cmd-content {
    padding: 0.2667rem 0.2133rem;
    border-bottom: 1px solid #efefef;
    .user {
      width: 100%;
      height: 0.8rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        vertical-align: middle;
      }
      .username {
        color: #999;
        font-size: 0.32rem;
        padding: 0 0.1333rem;
        vertical-align: middle;
      }
    }
    .commend {
      font-size: 0.3733rem;
      padding: 0.2133rem 0;
    }
    .time {
      padding: 0.1333rem 0;
      font-size: 0.32rem;
      color: #999;
      text-align: right;
    }
  }
}
.goods-details {
  padding: 0.2667rem;
  margin-top: 0.2667rem;
  background-color: #fff;
  .title {
    height: 100%;
    position: relative;
    margin-left: 0.2667rem;
    line-height: 0.5867rem;
    font-size: 0.4267rem;
    &::before {
      content: '';
      display: inline-block;
      width: 0.1333rem;
      height: 0.4267rem;
      background-color: #e1251b;
      position: absolute;
      top: 0.08rem;
      left: -0.32rem;
    }
  }
  .details-img {
    padding: 0.2667rem 0;
    li {
      width: 100%;
      height: 100%;
    }
    img {
      vertical-align: middle;
      width: 100%;
      height: 100%;
    }
  }
}
footer {
  width: 100%;
  height: 1.3067rem;
  border-top: 1px solid #efefef;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    li {
      height: 100%;
    }
    .service,
    .favorite,
    .mycart {
      width: 15%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 0.3733rem;
      border-left: 1px solid #efefef;
      color: #999;
      span {
        padding-top: 0.2133rem;
      }
    }
    .cart,
    .buy {
      flex: 1;
      font-size: 0.4267rem;
      text-align: center;
      line-height: 1.3067rem;
      color: #fff;
    }
    .cart {
      background-color: #ff9500;
    }
    .buy {
      background-color: #e1251b;
    }
  }
}
.border-red {
  border-bottom: 2px solid #e1251b;
}
</style>