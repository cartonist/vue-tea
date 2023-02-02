<template>
  <div class="recovery-container container">
    <Header>
      <span>找回密码</span>
    </Header>
    <section>
      <van-form class="recovery-form" :show-error-message="false" ref="form">
        <!-- <van-cell-group inset> -->
        <div class="form-content">
          <van-field v-model="password" type="password" name="password" placeholder="请输入新密码" :rules="passwordRules" class="password" @blur="getPasswordCheck" :class="showRedBorderP?'red-border':''" />
        </div>
      </van-form>
      <div class="btn-recovery" @click="submit">
        确定
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Header from '@/components/Login/Header.vue'
import { ref } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showToast, showFailToast } from 'vant'
import 'vant/es/toast/style'
import request from '@/common/api/request.js'
const router = useRouter()
const route = useRoute()
const password = ref('')

const showRedBorderP = ref(false)
const { proxy } = getCurrentInstance()

const submit = () => {
  // 全局表单验证
  proxy.$refs.form
    .validate()
    .then(async () => {
      // 全局验证通过后发送请求
      const res = await request({
        url: '/api/recovery',
        method: 'POST',
        data: {
          username: route.query.username,
          password: password.value
        }
      })
      if (res.success) {
        showSuccessToast(res.msg)
        router.push({
          name: 'Login'
        })
      } else {
        showFailToast(res.msg)
      }
    })
    .catch(() => {
      showFailToast('请正确输入密码')
    })
}

// 密码的表单验证
const passwordRules = [
  {
    required: true,
    message: '密码必须填入'
  },
  {
    validator: val => /^\w{6,12}$/.test(val),
    message: '密码必须是6~12位'
  }
]

// 密码的表单验证函数
const getPasswordCheck = () => {
  proxy.$refs.form
    .validate('password')
    .then(() => {
      showRedBorderP.value = false
    })
    .catch(() => {
      showRedBorderP.value = true
      showToast({
        message: '密码必须是6~12位',
        position: 'top'
      })
    })
}
</script>

<style lang="less" scoped>
.recovery-form {
  margin-top: 0.8rem;
  .form-content {
    padding: 0 0.5333rem;
    &:deep(.van-cell) {
      padding: 0.2667rem 0.2667rem;
      margin-bottom: 0.5333rem;
      border: 1px solid #aaa;
      border-radius: 0.16rem;
      font-size: 0.4267rem;
      input {
        height: 0.64rem;
      }
    }
  }
}
.btn-recovery {
  margin: 0 0.5333rem;
  height: 1.2267rem;
  text-align: center;
  line-height: 1.2267rem;
  background-color: #bc0707;
  color: #fff;
  font-size: 0.4267rem;
  border-radius: 0.16rem;
}
.red-border {
  border: 1px solid red !important;
}
</style>