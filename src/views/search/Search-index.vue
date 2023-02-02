<template>
  <div class="search-index">
    <Header></Header>
    <section>
      <div class="search-history" v-if="searchArr.length">
        <h2>
          <i>
            <van-icon name="clock-o" size="0.4267rem" />
          </i>
          历史记录
          <i class="del" @click="delSearchList">
            <van-icon name="delete-o" size="0.48rem" />
          </i>
        </h2>
        <ul>
          <li v-for="(item,index) in searchArr" :key="index" @click="goSearchList(item)">{{item}}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/search/Header.vue'
import { ref } from '@vue/reactivity'
import { getCurrentInstance, onBeforeMount } from '@vue/runtime-core'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useRouter } from 'vue-router'
const router = useRouter()
// 搜素历史记录
const searchArr = ref([])
onBeforeMount(() => {
  searchArr.value = JSON.parse(localStorage.getItem('searchList')) || []
})
const delSearchList = () => {
  showConfirmDialog({
    // title: '标题',
    message: '确定要删除历史记录吗？'
  })
    .then(() => {
      localStorage.removeItem('searchList')
      searchArr.value = []
    })
    .catch(() => {
      // on cancel
    })
}

// 点击历史标签触发搜索
const goSearchList = item => {
  // 增加数据
  searchArr.value.unshift(item)
  // ES6去重,去除后一个相同的元素，并返回对象
  let newObj = new Set(searchArr.value)
  // 覆盖本地存储
  localStorage.setItem('searchList', JSON.stringify(Array.from(newObj)))

  router.push({
    name: 'Search-list',
    // 使用路由串传参，来组件通信
    query: {
      key: item
    }
  })
}
</script>

<style lang="less" scoped>
.search-index {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
section {
  flex: 1;
  overflow: hidden;
  .search-history {
    h2 {
      position: relative;
      font-size: 0.4267rem;
      font-weight: 500;
      padding: 0.4rem 0.2667rem;
      color: #666;
      .del {
        position: absolute;
        right: 0.2667rem;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        font-size: 0.3733rem;
        border: 0.0267rem solid #ccc;
        padding: 0.1333rem;
        border-radius: 0.3467rem;
        margin: 0.0533rem 0 0.1333rem 0.2667rem;
        color: #666;
      }
    }
  }
}
</style>