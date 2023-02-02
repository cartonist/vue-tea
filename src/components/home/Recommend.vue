<template>
  <div class="recommend-container">
    <!-- 使用插槽 <span>标题</span> -->
    <Card>
    </Card>
    <ul class="rmd-goods">
      <li v-for="item in props.recommendList" :key="item.id" class="rmd-items" @click="goDetail(item.id)">
        <div class="rmd-img">
          <img :src="item.imgUrl" alt="">
        </div>
        <div class="rmd-msg">
          <div class="msg-title">{{item.title}}</div>
          <div class="msg-content">{{item.content}}</div>
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
const router = useRouter()
const props = defineProps(['recommendList'])
// const recommendList = [
//   {
//     id: 1,
//     title: '浙江果粟',
//     content: '来自龙井核心产区的地道滋味',
//     imgUrl: '/img/rmd01.jpeg',
//     price: 88
//   },
//   {
//     id: 2,
//     title: '龙井·飞花',
//     content: '2022明前龙井，早春全芽，外形好，口感佳',
//     imgUrl: '/img/rmd02.jpeg',
//     price: 100
//   },
//   {
//     id: 3,
//     title: '神秘茶盒',
//     content: '？？？？？？？？？？',
//     imgUrl: '/img/rmd03.jpg',
//     price: 999999
//   },
//   {
//     id: 4,
//     title: '浅尝-灰芽金骏眉',
//     content: '风味升级的金骏眉新贵品种',
//     imgUrl: '/img/rmd04.jpeg',
//     price: 128
//   },
//   {
//     id: 5,
//     title: '2014古法传承普洱熟茶砖',
//     content: '古法制作熟茶砖，回甘明显，经久耐泡，伴有丝丝枣香。',
//     imgUrl: '/img/rmd05.jpeg',
//     price: 68
//   },
//   {
//     id: 6,
//     title: '黄山谷雨前六安瓜片',
//     content: '外形鲜美，茶味比较浓厚，耐泡且回甘快',
//     imgUrl: '/img/rmd06.jpeg',
//     price: 58
//   }
// ]
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
.rmd-goods {
  width: 100%;
  li {
    display: flex;
    height: 3.7333rem;
    width: 9.36rem;
    margin: 0 auto 0.32rem;
    background-color: #fff;
    img {
      width: 3.7333rem;
      height: 3.7333rem;
    }
    .rmd-msg {
      width: 5.6267rem;
      padding: 0.2667rem;
      .msg-title {
        font-size: 0.4267rem;
        height: 0.56rem;
        line-height: 0.56rem;
      }
      .msg-content {
        font-size: 0.3733rem;
        padding: 0.4rem 0;
        color: #999;
      }
      .price {
        font-size: 0.48rem;
        color: #e1251b;
      }
    }
  }
}
</style>