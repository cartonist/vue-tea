<template>
  <ul class="icons-container">
    <li v-for="item in props.Icons" :key="item.id">
      <img :src="item.imgUrl" alt="">
      <span>{{item.title}}</span>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps(['Icons'])
// const Icons = [
//   {
//     id: 1,
//     title: '自饮',
//     imgUrl: '/img/icons01.png'
//   },
//   {
//     id: 2,
//     title: '茶具',
//     imgUrl: '/img/icons02.png'
//   },
//   {
//     id: 3,
//     title: '品牌',
//     imgUrl: '/img/icons03.png'
//   },
//   {
//     id: 4,
//     title: '赛事',
//     imgUrl: '/img/icons04.png'
//   },
//   {
//     id: 5,
//     title: '新人礼',
//     imgUrl: '/img/icons05.png'
//   }
// ]
</script>

<style lang="less" scoped>
.icons-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.48rem;
  align-items: center;
  padding: 0.2667rem 0;
  background-color: #fff;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 0.7467rem;
      height: 0.7467rem;
    }
    span {
      padding: 0.16rem 0;
      font-size: 0.3733rem;
    }
  }
}
</style>