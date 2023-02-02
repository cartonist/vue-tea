<template>
  <div class="list-container">
    <header v-if="isShow">
      <div class="header-container">
        <ul class="header">
          <li>
            <i>
              <van-icon name="arrow-left" size="0.64rem" color="#fff" @click="goBack" />
            </i>
          </li>
          <li class="search" @click="goSearch">
            <van-icon name="search" size="0.64rem" color="#aaa" />
            <span>搜索您喜欢的...</span>
          </li>
          <li class="home-icon">
            <van-icon name="home-o" color="#fff" size="0.64rem" @click="goHome" />
          </li>
        </ul>
      </div>
    </header>
    <section>
      <div class="list-l" ref="left">
        <ul>
          <li v-for="(item,index) in leftData" :key="index" @click="goScroll(item.id)" :class="currentIndex == index?'active':''">{{item.name}}</li>
        </ul>
      </div>
      <div class="list-r" ref="right">
        <div>
          <div class="top-img">
            <img src="/img/swiper05.jpeg" alt="">
          </div>
          <ul>
            <li class="shop-list" v-for="item in rightData" :key="item.id">
              <h2>
                <span>{{item.name}}</span>
              </h2>
              <ul class="r-content">
                <li v-for="value in item.data" :key="value.id">
                  <img :src="value.imgUrl" alt="">
                  <span>{{value.name}}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onBeforeMount, ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import BScroll from 'better-scroll'
import request from '@/common/api/request.js'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const store = useStore()
const router = useRouter()
const leftData = ref([])
const rightData = ref([])
const isShow = ref(true)
// 所有右侧分类数据的高度
const allHeight = ref([])
// rightBS滚动的距离
let scrollY = ref(0)
let rightBS = null
const goBack = () => {
  router.back()
}
const goSearch = () => {
  router.push({ name: 'Search' })
}
const goHome = () => {
  router.push({ name: 'Home' })
}
const goScroll = id => {
  rightBS.scrollTo(0, -allHeight.value[id], 0)
}
// 计算滚动的范围对应的左侧index
let currentIndex = computed(() => {
  return allHeight.value.findIndex((item, index) => {
    // 返回第一个满足条件的数组下标，函数不会再调用
    return scrollY.value >= item && scrollY.value < allHeight.value[index + 1]
  })
})
onBeforeMount(async () => {
  const res = await request({
    url: '/api/goods/typeList'
  })
  rightData.value = res
  res.forEach(item => {
    leftData.value.push({
      id: item.id,
      name: item.name
    })
  })
  proxy.$nextTick(() => {
    // 左侧滑动
    new BScroll(proxy.$refs.left, {
      pullUpLoad: true,
      scrollbar: false,
      pullDownRefresh: false,
      mouseWheel: true,
      disableTouch: false,
      click: true
      // and so on
    })
    // 右侧滑动
    rightBS = new BScroll(proxy.$refs.right, {
      pullUpLoad: true,
      scrollbar: false,
      pullDownRefresh: false,
      mouseWheel: true,
      disableTouch: false,
      click: true,
      probeType: 3
      // and so on
    })
    let topImg = proxy.$refs.right.getElementsByClassName('top-img')
    // 右侧顶部图片的高度
    let height = topImg[0].clientHeight
    allHeight.value.push(height)
    // 获取右侧分类的dom对象
    let uls = proxy.$refs.right.getElementsByClassName('shop-list')
    // 将dom对象转换为数组
    Array.from(uls).forEach(item => {
      height += item.clientHeight
      allHeight.value.push(height)
    })
    allHeight.value.push(10000)
    // 滑动结束时触发
    rightBS.on('scroll', pos => {
      scrollY.value = Math.abs(pos.y)
      // if (scrollY.value > 100) {
      //   isShow.value = false
      // } else {
      //   isShow.value = true
      // }
    })
  })
})
</script>

<style lang="less" scoped>
.list-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
  section {
    display: flex;
    margin-bottom: 1.4933rem;
    flex: 1;
    overflow: hidden;
    .top-img {
      width: 6.96rem;
      height: 3.4133rem;
      margin: 0 auto;
      padding: 0.2667rem 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .list-l {
      width: 2.48rem;
      background-color: #fff;
      overflow: hidden;
      border-right: 1px solid #efefef;
      ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        li {
          width: 100%;
          text-align: center;
          font-size: 0.3733rem;
          line-height: 0.8rem;
          height: 0.8rem;
          margin: 0.4rem 0;
          position: relative;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            vertical-align: middle;
            content: '';
            display: inline-block;
            width: 0.0533rem;
            height: 0.8rem;
            // background-color: #e1251b;
          }
        }
      }
    }
    .list-r {
      flex: 1;
      height: 100%;
      overflow: hidden;
      .shop-list {
        padding-bottom: 0.5333rem;
        text-align: center;
        h2 {
          font-size: 0.48rem;
          font-weight: 400;
          padding: 0.5333rem 0 0.2667rem 0;
          span {
            position: relative;

            &::before,
            &::after {
              position: absolute;
              content: '';
              top: 0;
              bottom: 0;
              margin: auto;
              height: 1px;
              width: 0.53333rem;
              background-color: #d9d9d9;
              -webkit-transform-origin: 50% 100% 0;
              transform-origin: 50% 100% 0;
            }
            &::before {
              left: -0.74667rem;
            }
            &::after {
              right: -0.74667rem;
            }
          }
        }
        .r-content {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          li {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 33.3%;
            padding: 0.2667rem 0;
            img {
              width: 1.4133rem;
              height: 1.4133rem;
            }
            span {
              font-size: 0.4267rem;
            }
          }
        }
      }
    }
  }
}
.active {
  border-left: 0.16rem solid #e1251b;
  color: #e1251b;
}
// .header-container {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: 99;
// }
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
    width: 7.4667rem;
    height: 0.8rem;
    // margin-left: 0.2667rem;
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
  .home-icon {
    margin-right: 0.2667rem;
  }
}
</style>