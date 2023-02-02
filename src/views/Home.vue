<template>
  <div class="home-container">
    <Header></Header>

    <section class="wrapper">
      <!-- 想让section的内容滚动，必须保证内容比盒子的高度大 -->
      <div class="wrapper-content">
        <div v-for="item in proxy.$store.state.newData" :key="item.id">
          <Swiper v-if="item.type == 'swiperList'" :swiperItem="item.data"></Swiper>
          <Icons v-if="item.type == 'IconList'" :Icons="item.data"></Icons>
          <Recommend v-if="item.type == 'recommendList'" :recommendList="item.data"></Recommend>
          <Like v-if="item.type == 'likeList'" :likeList="item.data"></Like>
          <Ad v-if="item.type == 'adList'" :adList="item.data"></Ad>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Header from '@/components/home/Header.vue'
import Swiper from '@/components/home/Swiper.vue'
import Icons from '@/components/home/Icons.vue'
import Recommend from '@/components/home/Recommend.vue'
import Like from '@/components/home/Like.vue'
import Ad from '@/components/home/Ad.vue'

// 引入滚动插件
import BScroll from 'better-scroll'

import { getCurrentInstance, onBeforeMount, onMounted, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
const store = useStore()

// 封装后的axios方法
import request from '@/common/api/request.js'
const { proxy } = getCurrentInstance()

let newData = ref([])
const getData = async () => {
  const res = await request({ url: '/api/index_list/0/data/1' })
  store.commit('setNewData', Object.freeze(res))
  newData.value = store.state.newData
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
onBeforeMount(() => {
  getData()
})
</script>

<style lang="less" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  section {
    flex: 1;
    overflow: hidden;
    margin: 2.5067rem 0 1.4933rem;
  }
}
</style>