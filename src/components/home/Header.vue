<template>
  <div class="header-container">
    <ul class="header">
      <li class="search" @click="goSearch">
        <van-icon name="search" size="0.64rem" color="#aaa" />
        <span>搜索您喜欢的...</span>
      </li>
      <li class="service">
        <van-icon name="service" color="#fff" size="0.64rem" />
      </li>
    </ul>
    <nav-bar></nav-bar>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import NavBar from '@/components/home/NavBar.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const goSearch = () => {
  router.push({ name: 'Search' })
}
</script>

<style lang="less" scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}
.header {
  // position: fixed;
  display: flex;
  // top: 0;
  // z-index: 99;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 1.1733rem;
  background-color: #e1251b;
  .search {
    width: 7.56rem;
    height: 0.8rem;
    margin-left: 0.2667rem;
    border-radius: 0.4rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    i {
      margin: 0 0.2667rem;
    }
    span {
      font-size: 0.3733rem;
      color: #aaa;
    }
  }
  .service {
    margin-right: 0.2667rem;
  }
}
</style>