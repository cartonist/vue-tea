<template>
  <header>
    <div class="search-return">
      <i>
        <van-icon name="arrow-left" size="0.64rem" @click="goBack" />
      </i>
    </div>
    <div class="search-main">
      <i>
        <van-icon name="search" size="0.64rem" color="#aaa" />
      </i>
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <input type="search" placeholder="搜索你喜欢的商品" v-model.trim="searchVal" autofocus ref="myInput">
      </form>
    </div>
    <div class="search-btn" @click="goSearchList">搜索</div>
  </header>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { getCurrentInstance, onBeforeMount, onMounted } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
const searchVal = ref('')
const searchArr = ref([])
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
onBeforeMount(() => {
  // 获取路由参数
  searchVal.value = route.query.key || ''
})
// onMounted(() => {
//   window.addEventListener('touchmove', touchMove, true)
// })
// const touchMove = () => {
//   // 失去焦点
//   proxy.$refs.myInput.blur()
// }

const goBack = () => {
  // if (route.path == '/search/list') router.push({ name: 'Search' })
  // else if (route.path == '/search/index') router.push({ name: 'Home' })
  router.back()
}
const goSearchList = () => {
  // 判断是否时空字符串
  if (!searchVal.value) return
  // 判断有没有搜索历史的本地存储
  if (!localStorage.getItem('searchList')) {
    // 没有则设置，（JSON格式的字符串）
    localStorage.setItem('searchList', '[]')
  } else {
    searchArr.value = JSON.parse(localStorage.getItem('searchList'))
  }
  // 增加数据
  searchArr.value.unshift(searchVal.value)
  // ES6去重,去除后一个相同的元素，并返回对象
  let newObj = new Set(searchArr.value)
  // 覆盖本地存储
  localStorage.setItem('searchList', JSON.stringify(Array.from(newObj)))
  if (route.path == '/search/list') {
    router.replace({
      name: 'Search-list',
      // 使用路由串传参，来组件通信
      query: {
        key: searchVal.value
      }
    })
  } else if (route.path == '/search/index') {
    router.push({
      name: 'Search-list',
      // 使用路由串传参，来组件通信
      query: {
        key: searchVal.value
      }
    })
  }
}
</script>

<style lang="less" scoped>
header {
  width: 100%;
  height: 1.1733rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e1251b;
  color: #fff;
  .search-return {
    padding: 0 0.2667rem;
  }
  .search-btn {
    font-size: 0.4267rem;
    padding: 0 0.2667rem;
  }
  .search-main {
    background-color: #fff;
    display: flex;
    align-items: center;
    width: 6.6667rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    i {
      margin: 0 0.1333rem;
    }
    form {
      width: 75%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    input {
      width: 100%;
      background-color: none;
      outline: none;
      border: none;
      &:focus {
        border: none;
      }
      color: #000;
      font-size: 0.3733rem;
    }
  }
}
</style>