<template>
  <div class="ad-container">
    <div v-for="item in props.adList" :key="item.id" class="img-container">
      <img :src="item.imgUrl" alt="">
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['adList'])
</script>

<style lang="less" scoped>
.ad-container {
  .img-container {
    width: 100%;
    height: 4.4rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>