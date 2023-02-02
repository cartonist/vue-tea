<template>
  <div class="like-container">
    <div class="like-title">
      <Card>
        猜你喜欢
      </Card>
    </div>
    <ul class="like-goods">
      <li v-for="item in props.likeList" :key="item.id" @click="goDetail(item.id)">
        <div class="like-img">
          <img v-lazy="item.imgUrl" alt="">

        </div>
        <div class="like-msg">
          <p class="title">{{item.title}}</p>
          <span style="font-size: 0.3733rem; color: #e1251b">￥</span>
          <span class="price">{{item.price}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import Card from '@/components/home/Card.vue'
import { useRouter } from 'vue-router'
const props = defineProps(['likeList'])
const router = useRouter()
const goDetail = id => {
  router.push({
    name: 'Detail',
    query: {
      id
    }
  })
}
</script>

<style lang="less" scoped>
.like-title {
  margin-top: 0.48rem;
}
.like-goods {
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
    .like-msg {
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
</style>