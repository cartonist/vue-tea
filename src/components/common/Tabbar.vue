<template>
  <div class="tabbar-container">
    <ul class="tabbar">
      <li v-for="item in routerList" :key="item.title" @click="switchTab(item.path)">
        <van-icon :name="item.active" size="0.7rem" :color="route.path == item.path?'#df2b20':''" />
        <p :class="route.path == item.path? 'blue-font':''">{{item.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const routerList = ref([])
routerList.value = [
  {
    title: '首页',
    path: '/home',
    active: 'wap-home-o',
    selected: ''
  },
  {
    title: '分类',
    path: '/list',
    active: 'apps-o',
    selected: ''
  },
  {
    title: '购物车',
    path: '/cart',
    active: 'shopping-cart-o',
    selected: ''
  },
  {
    title: '我的',
    path: '/my',
    active: 'manager-o',
    selected: ''
  }
]
// 路由跳转
const switchTab = path => {
  // router.replace(path)
  router.push(path)
}
</script>

<style lang="less">
.tabbar-container {
  position: fixed;
  width: 100%;
  z-index: 99;
  height: 1.4667rem;
  bottom: 0;
  border-top: 1px solid #efefef;
  .tabbar {
    background-color: #fff;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    li p {
      font-size: 0.3733rem;
      height: 0.5333rem;
      line-height: 0.5333rem;
    }
  }
}
.blue-font {
  color: #e1251b;
}
</style>