<template>
  <div class="swiper-container">
    <!-- <swiper :options="swiperOptions">
      <swiper-slide v-for="(item, index) in swiperItem" :key="index">
        <img :src="item.imgUrl" alt="">
      </swiper-slide>
    </swiper> -->
    <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
      <van-swipe-item v-for="item in props.swiperItem" :key="item.id">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'

const props = defineProps(['swiperItem'])
// const swiperItem = [
//   {
//     id: 1,
//     imgUrl: '/img/swiper01.jpeg'
//   },
//   {
//     id: 2,
//     imgUrl: '/img/swiper02.jpeg'
//   },
//   {
//     id: 3,
//     imgUrl: '/img/swiper03.jpeg'
//   },
//   {
//     id: 4,
//     imgUrl: '/img/swiper04.jpeg'
//   },
//   {
//     id: 5,
//     imgUrl: '/img/swiper05.jpeg'
//   }
// ]
</script>

<style lang="less" scoped>
.swiper-container {
  height: 4.4rem;
  // .swiper {
  //   height: 100%;
  // }
  .van-swipe {
    height: 100%;
  }
  img {
    width: 100%;
    height: 4.4rem;
  }
}
</style>