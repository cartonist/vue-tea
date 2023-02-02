<template>
  <div class="search-list">
    <div class="search-header">
      <Header></Header>
      <ul>
        <li v-for="(item, index) in searchType.data" :key="index" @click="changeTab(index)">
          <div :class="index == searchType.currentIndex?'active':'' ">{{item.name}}</div>
          <div class="search-filter" v-if="index != 0">
            <i>
              <van-icon name="arrow-up" size="0.3733rem" :class="item.status == 1?'active':''" />
            </i>
            <i>
              <van-icon name="arrow-down" size="0.3733rem" :class="item.status == 2?'active':''" />
            </i>
          </div>
        </li>
      </ul>
    </div>
    <section class="wrapper">
      <ul class="goods" v-if="goodsList.length">
        <li v-for="item in goodsList" :key="item.id" @click="goDetail(item.id)">
          <div class="goods-img">
            <img v-lazy="item.imgUrl" alt="">
          </div>
          <div class="goods-msg">
            <p class="title">{{item.name}}</p>
            <span style="font-size: 0.3733rem; color: #e1251b">￥</span>
            <span class="price">{{item.price}}</span>
          </div>
        </li>
      </ul>
      <div v-else>
        <van-empty description="找不到商品" image-size="5.333rem" />
      </div>
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/search/Header.vue'
import request from '@/common/api/request.js'
import { computed, getCurrentInstance, onBeforeMount, onMounted, ref, watch } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import BScroll from 'better-scroll'
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
import { useStore } from 'vuex'
const store = useStore()
const goodsList = ref([])
const searchType = ref({})
searchType.value = {
  currentIndex: 0,
  data: [
    // status: 0 都不亮，status: 1 上箭头亮，status: 2 下箭头亮
    { name: '综合', key: 'id' },
    { name: '价格', status: 0, key: 'price' },
    { name: '销量', status: 0, key: 'num' }
  ]
}
const orderBy = computed(() => {
  let currentItem = searchType.value.data[searchType.value.currentIndex]
  let val = currentItem.status == 1 ? 'asc' : 'desc'
  return {
    [currentItem.key]: val
  }
})
const goDetail = id => {
  router.push({
    name: 'Detail',
    query: {
      id
    }
  })
}
const getShopList = async () => {
  const res = await request({
    url: '/api/goods/shopList',
    params: {
      searchName: route.query.key,
      ...orderBy.value
    }
  })
  goodsList.value = res
  // 由于路由一旦发色变化就会触发getShopList, 因此需要判断路由是否跳转自身，只有跳转自身的时候才需要创建BScroll
  if (route.path == '/search/list') {
    proxy.$nextTick(() => {
      // 在同一个页面中，先销毁之前的bs，再重新创建
      let bs = store.state.bs
      if (bs) bs.destroy()
      bs = new BScroll('.wrapper', {
        pullUpLoad: true, // 上拉加载
        scrollbar: false, //滚动条
        pullDownRefresh: false, //下拉加载
        mouseWheel: true,
        disableTouch: false,
        click: true,
        probeType: 3
        // and so on
      })
      bs.scrollTo(0, 1)
      store.commit('setBS', bs)
    })
  }
}
onBeforeMount(() => {
  getShopList()
})

const changeTab = index => {
  searchType.value.currentIndex = index
  let item = searchType.value.data[index]
  searchType.value.data.forEach((v, i) => {
    if (i != index && i != 0) {
      v.status = 0
    }
    if (index != 0) item.status = item.status == 1 ? 2 : 1
  })
  getShopList()
}
// 路由跳转自身，不会触发vue生命周期函数，所以需要监听路由的变化，重新发送请求
watch(route, (newVal, oldVal) => {
  getShopList()
})
</script>

<style lang="less" scoped>
.search-list {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .search-header {
    background-color: #fff;
    ul {
      height: 1.0667rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      li {
        width: 1.6rem;
        font-size: 0.4267rem;
        display: flex;
        justify-content: center;
        .search-filter {
          padding-left: 0.1333rem;
          display: flex;
          flex-direction: column;
          i {
            margin: -0.1067rem 0;
          }
        }
      }
    }
  }
  section {
    flex: 1;
    overflow: hidden;
    .goods {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 0.32rem;
      li {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.32rem;
        background-color: #fff;
        width: 4.56rem;
        img {
          width: 4.56rem;
          height: 4.56rem;
        }
        img[lazy='loading'] {
          background-color: #e5e6e8;
        }
        .goods-msg {
          padding: 0.2667rem;
        }
        .title {
          font-size: 0.3733rem;
          padding-bottom: 0.2667rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .price {
          font-size: 0.48rem;
          color: #e1251b;
        }
      }
    }
    .van-empty {
      &:deep(p) {
        font-size: 0.4267rem !important;
      }
    }
  }
}
.active {
  color: #e1251b;
}
</style>