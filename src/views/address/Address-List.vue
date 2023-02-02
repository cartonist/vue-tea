<template>
  <div class="address-index-container container">
    <Header>
      <span v-if="pathStatus">添加地址</span>
      <span v-else>编辑地址</span>
    </Header>
    <section>
      <!-- 地址编辑UI -->
      <van-address-edit v-if="pathStatus" :area-list="areaList" show-set-default show-search-result :search-result="searchResult" :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onAdd" />
      <van-address-edit v-else :area-list="areaList" :address-info="addressInfo" show-set-default show-delete show-search-result :search-result="searchResult" @save="onUpdate" @delete="onDel" />
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Header from '@/components/address/Header.vue'
// 导入默认中国省市区的数据
import { areaList } from '@vant/area-data'
import { ref } from '@vue/reactivity'
import { showToast, showFailToast, showSuccessToast, showConfirmDialog } from 'vant'
import request from '@/common/api/request.js'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount } from '@vue/runtime-core'
const router = useRouter()
const route = useRoute()
const pathStatus = ref(false)
const searchResult = ref([])
// 地址初始化信息
let addressInfo = ref({})
onBeforeMount(() => {
  // 解析路由参数
  let key = JSON.parse(route.query.key)

  // 增加地址
  if (key == 'add') {
    pathStatus.value = true
  } else {
    // 编辑地址
    key.isDefault = key.isDefault == '1' ? true : false
    addressInfo.value = key
  }
})
// 点击保存触发，添加地址
const onAdd = async info => {
  info.isDefault = info.isDefault ? 1 : 0
  const res = await request({
    url: '/api/addAddr',
    method: 'POST',
    headers: {
      token: true
    },
    data: {
      ...info
    }
  })
  if (res.success) {
    router.back()
    // router.push({
    //   name: 'Address'
    // })
  }
}
// 点击保存触发，修改地址
const onUpdate = async info => {
  info.isDefault = info.isDefault ? 1 : 0
  const res = await request({
    url: '/api/editAddr',
    method: 'POST',
    headers: {
      token: true
    },
    data: {
      ...info
    }
  })
  if (res.success) {
    router.back()
    // router.push({
    //   name: 'Address'
    // })
  }
}
const onDel = info => {
  showConfirmDialog({
    message: '是否确认删除？',
    confirmButtonColor: '#bc0707'
  })
    .then(async () => {
      const res = await request({
        url: '/api/delAddr',
        method: 'POST',
        data: {
          id: info.id
        }
      })
      router.back()
      // router.push({
      //   name: 'Address'
      // })
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<style lang="less" scoped>
section {
  margin-bottom: 1.4933rem;
  .van-address-edit {
    padding: 0;
  }
  &:deep(.van-address-edit__buttons) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .van-button {
      width: 8rem;
      height: 1.0667rem;
      font-size: 0.3733rem;
    }
    .van-button--primary {
      background-color: #bc0707;
      border: #bc0707;
    }
    .van-button--default {
      color: #bc0707;
    }
  }
}
</style>