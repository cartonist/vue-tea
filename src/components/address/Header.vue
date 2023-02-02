<template>
  <header>
    <ul class="header">
      <li class="back-icon">
        <van-icon name="arrow-left" size="0.64rem" color="#fff" @click="goBack" />
      </li>
      <li class="login">
        <slot>
          <span>登录</span>
        </slot>
      </li>
      <li class="home-icon">
        <van-icon name="home-o" color="#fff" size="0.64rem" @click="goHome" />
      </li>
    </ul>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const goBack = () => {
  if (route.name == 'AddressIndex') {
    // router.push({
    //   name: 'My'
    // })
  } else {
    // router.push({
    //   name: 'AddressIndex'
    // })
  }
  router.back()
}
const goHome = () => {
  router.push({ name: 'Home' })
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.1733rem;
  background-color: #bc0707;
  li {
    height: 100%;
  }
  .back-icon {
    margin-left: 0.2667rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login {
    font-size: 0.48rem;
    color: #fff;
    line-height: 1.1733rem;
  }
  .home-icon {
    margin-right: 0.2667rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>