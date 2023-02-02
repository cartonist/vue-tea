<template>
  <div class="my-container container">
    <header>
      <div class="userInfo" v-if="loginStatus">
        <img :src="userInfo.imgUrl" alt="">
        <span>{{userInfo.nickName}}</span>
      </div>
      <div class="login" @click="goLogin" v-else>
        登录/注册
      </div>
    </header>
    <section>
      <ul>
        <li @click="goAddress">
          <div class="title">
            <van-icon name="location-o" size="0.48rem" color="#e1251b" />
            地址管理
          </div>
          <div class="arrow">
            <van-icon name="arrow" size="0.48rem" />
          </div>
        </li>
        <li v-if="loginStatus" @click="logout">
          <div>
            <van-icon name="revoke" size="0.48rem" color="#e1251b" />
            退出登录
          </div>
          <div class="arrow">
            <van-icon name="arrow" size="0.48rem" />
          </div>
        </li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import { computed } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const loginStatus = computed(() => store.state.user.loginStatus)
const userInfo = computed(() => store.state.user.userInfo)
const goLogin = () => {
  router.push({ name: 'Login' })
}
const goAddress = () => {
  router.push({ name: 'Address' })
}
const logout = () => {
  store.commit('LOGIN_OUT')
}
</script>

<style lang="less" scoped>
.my-container {
  header {
    width: 100%;
    height: 4.8rem;
    background: url('/img/bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login {
      font-size: 0.48rem;
      background-color: #f8ab07;
      color: #fff;
      padding: 0.2667rem 0.5333rem;
      border-radius: 0.16rem;
    }
    .userInfo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 2.1333rem;
        height: 2.1333rem;
        border-radius: 50%;
      }
      span {
        font-size: 0.48rem;
        padding: 0.2667rem 0;
      }
    }
  }
  section {
    flex: 1;
    overflow: hidden;
    ul {
      li {
        font-size: 0.4267rem;
        padding: 0.2667rem;
        height: 0.8rem;
        // line-height: 0.8rem;
        display: flex;
        justify-content: space-between;
        div {
          height: 100%;
          line-height: 0.8rem;
        }
      }
    }
  }
}
</style>