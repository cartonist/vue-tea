<template>
  <div id="app">
    <!-- 这里需要带上:key才能缓存多个不同的页面 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.fullPath" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
    </router-view>
  </div>
</template>

<script setup>
import { onBeforeMount } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
onBeforeMount(() => {
  store.commit('INIT_USER')
})
</script>
<style lang="less">
body {
  background-color: #f6f6f6;
}
</style>

