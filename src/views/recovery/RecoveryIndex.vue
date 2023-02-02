<template>
  <div class="recovery-container container">
    <Header>
      <span>找回密码</span>
    </Header>
    <section>
      <van-form class="recovery-form" :show-error-message="false" ref="form">
        <!-- <van-cell-group inset> -->
        <div class="form-content">
          <van-field v-model="username" name="username" placeholder="请输入手机号" :rules="userRules" class="username" @blur="getPhoneCheck" :class="showRedBorderU?'red-border':''" />
          <div class="msg">
            <van-field v-model="code" type="text" name="code" placeholder="请输入短信验证码" :rules="codeRules" class="code" @blur="getCodeCheck" :class="showRedBorderC?'red-border':''" />
            <button @click="sendCode" :disabled="disable">{{codeMsg}}</button>
          </div>
        </div>
      </van-form>
      <div class="btn-next" @click="next">
        下一步
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Header from '@/components/Login/Header.vue'
import { ref } from '@vue/reactivity'
import { getCurrentInstance } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { showToast, showFailToast, showSuccessToast } from 'vant'
import request from '@/common/api/request.js'
import 'vant/es/toast/style'
const router = useRouter()
const username = ref('')
const code = ref('')
const codeReceived = ref('')
const disable = ref(false)
const codeMsg = ref('获取短信验证码')
const dropDown = ref(6)
const showRedBorderU = ref(false)
const showRedBorderC = ref(false)
const { proxy } = getCurrentInstance()
const goUserLogin = () => {
  router.push({ name: 'UserLogin' })
}
const goRegister = () => {
  router.push({ name: 'Register' })
}
const onFailed = errorInfo => {
  console.log('failed', errorInfo)
}
const next = () => {
  // 全局表单验证
  proxy.$refs.form
    .validate()
    .then(async () => {
      if (code.value == codeReceived.value) {
        // 验证码输入正确
        const res = await request({
          url: 'api/selectUser',
          method: 'POST',
          data: {
            username: username.value
          }
        })
        // 判断用户是否存在
        if (res.success) {
          // 存在则跳转
          router.push({
            name: 'RecoveryBtn',
            query: {
              username: username.value
            }
          })
        } else {
          showFailToast(res.msg)
        }
      } else {
        showFailToast('手机号或验证码有误')
      }
    })
    .catch(() => {
      showFailToast('请正确填写手机号和验证码')
    })
}
const sendCode = () => {
  proxy.$refs.form
    .validate('username')
    .then(async () => {
      disable.value = true
      // 手机号验证通过则发送请求
      const res = await request({
        url: 'api/code',
        method: 'POST',
        data: {
          username: username.value
        }
      })
      if (res.success) {
        console.log(res)
        codeReceived.value = res.data
      }
      // 倒计时计时器
      codeMsg.value = '重新发送6s'
      let timer = setInterval(() => {
        --dropDown.value
        codeMsg.value = `重新发送${dropDown.value}s`
      }, 1000)
      // 判断什么时候停止定时器
      setTimeout(() => {
        clearTimeout(timer)
        disable.value = false
        codeMsg.value = '获取短信验证码'
        dropDown.value = 6
      }, 6000)
    })
    .catch(() => {
      showToast({
        message: '请输入正确的手机号',
        position: 'top'
      })
    })
}
// username的表单验证
const userRules = [
  {
    required: true
  },
  {
    validator: val => {
      return /^1[3456789]\d{9}$/.test(val)
    }
  }
]
// 验证码的表单验证
const codeRules = [
  {
    required: true
  }
]
// username的表单验证函数
const getPhoneCheck = () => {
  proxy.$refs.form
    .validate('username')
    .then(() => {
      showRedBorderU.value = false
    })
    .catch(() => {
      showRedBorderU.value = true
      showToast({
        message: '请输入正确的手机号',
        position: 'top'
      })
    })
}
// 验证码的表单验证函数
const getCodeCheck = () => {
  proxy.$refs.form
    .validate('code')
    .then(() => {
      showRedBorderC.value = false
    })
    .catch(() => {
      showRedBorderC.value = true
      showToast({
        message: '请输入验证码',
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
  .msg {
    display: flex;
    // align-items: center;
    .code {
      width: 65%;
      border-radius: 0.16rem 0 0 0.16rem;
    }
    button {
      width: 35%;
      font-size: 0.3733rem;
      height: 1.2267rem;
      padding: 0;
      border: none;
      color: #fff;
      background-color: #bc0707;
      border-radius: 0 0.16rem 0.16rem 0;
    }
  }
}
.btn-next {
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