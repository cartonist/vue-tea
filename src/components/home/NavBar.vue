<template>
  <section class="theme-list">
    <div class="fixed-nav" ref="fixednav">
      <div class="fixed-nav-content" v-for="item in theme" :key="item.id" :class="['tab-title', activeId === item.id && 'select-tab']" @click="changeTab(item.id, $event)">
        <p class="tab-item">
          {{ item.title }}
        </p>
        <div :class="[activeId == item.id?'bgc-red':'','subline']"></div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { ref } from '@vue/reactivity'
import { getCurrentInstance, onBeforeMount } from '@vue/runtime-core'
import { useStore } from 'vuex'
// 引入滚动插件
import BScroll from 'better-scroll'
import request from '@/common/api/request.js'
const { proxy } = getCurrentInstance()
const store = useStore()
const theme = ref([])
const getData = async index => {
  const res = await request({ url: `/api/index_list/${index}/data/1` })
  store.commit('setNewData', Object.freeze(res))
  proxy.$nextTick(() => {
    // 在同一个页面中，先销毁之前的bs，再重新创建
    let bs = store.state.bs
    if (bs) bs.destroy()
    bs = new BScroll('.wrapper', {
      pullUpLoad: true,
      scrollbar: false,
      pullDownRefresh: false,
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
const getTopBar = async () => {
  const res = await request({ url: '/api/themeList' })
  theme.value = res.topBar
}
onBeforeMount(() => {
  getTopBar()
})
const activeId = ref(0)
const changeTab = (id, event) => {
  if (id !== activeId) {
    activeId.value = id
    // 计算当前按钮的位置，看是否需要移动
    const spanLeft = event.clientX // 当前点击的元素左边距离
    const divBox = document.querySelector('.select-tab').clientWidth / 2 // 点击的元素一半宽度
    const totalWidths = document.body.clientWidth // 屏幕总宽度
    const widths = totalWidths / 2 // 一半的屏幕宽度
    const spanRight = totalWidths - spanLeft // 元素的右边距离
    const scrollBox = document.querySelector('.fixed-nav') // 获取最外层的元素
    const scrollL = scrollBox.scrollLeft // 滚动条滚动的距离
    // 当元素左边距离 或者 右边距离小于100时进行滑动
    if (spanRight < 100 || spanLeft < 100) {
      scrollBox.scrollLeft = scrollL + (spanLeft - widths) + divBox
    }
    getData(id)
  }
}
</script>

<style scoped>
.theme-list {
  /* position: fixed;
  z-index: 99; */
  background-color: #fff;
  border-bottom: 1px solid #efefef;
  width: 100%;
  /* height: 55p */
  /* top: 1.1733rem; */
}
.fixed-nav {
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  height: 1.3333rem;
  display: flex;
  align-items: center;
}
.fixed-nav-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fixed-nav-content .subline {
  width: 1.0667rem;
  height: 0.1333rem;
  /* margin: 0.1333rem 0; */
  /* background-color: red; */
  border-radius: 0.1333rem;
}
.tab-item {
  height: 0.8rem;
  line-height: 0.8rem;
}
.bgc-red {
  background-color: #e1251b;
}
.tab-title {
  padding: 0 0.3467rem;
  margin-right: 0.2667rem;
  color: #333;
  border-radius: 0.3467rem;
  font-size: 0.4267rem;
  flex-shrink: 0;
  /* height: 0.52rem; */
  /* line-height: 0.52rem; */
}
.select-tab {
  font-size: 0.4267rem;
  font-weight: 700;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0.01rem;
  opacity: 0;
  display: none;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: #fff;
  opacity: 0;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  width: 0.01rem;
  border-radius: 0.01rem;
  opacity: 0;
}
</style>