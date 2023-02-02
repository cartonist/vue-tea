import axios from 'axios'
// 引入加载提示插件
import { closeToast,showLoadingToast } from 'vant'
import { showToast } from 'vant'
import 'vant/es/toast/style'
// import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
// const router = useRouter()
// const store = useStore()
import router from '@/router'
import store from '@/store'

const common = {
    method: 'GET',
    data: {},
    params: {},
    headers: {}
}

// 请求拦截器
axios.interceptors.request.use((req) => {
  const toast = showLoadingToast({
    message: '加载中...',
    duration: 0, //持续展示toast
    forbidClick: true,
    loadingType: 'spinner'
  })
  return req
})

// 响应拦截器
// axios.interceptors.response.use((res) => {
//   closeToast()
//   console.log(res.data.data)
//   return res.data.data

// })

// 请求拦截器和响应拦截器重复发送请求？？？？

const request = (options) => {
  options.method = options.method || common.method
  options.data = options.data || common.data
  options.params = options.params || common.params
  options.headers = options.headers || common.headers

  if(options.headers.token) {
    options.headers.token = store.state.user.token
    if(!options.headers.token) {
      router.push({
        name: 'Login'
      })
    }
  }
  // 充当响应拦截器
  return axios(options).then(v => {
    let data = v.data.data

    //如果token过期了，重新登录
    if(data && data.code == 1000) {
      closeToast()
      store.commit('LOGIN_OUT')
      router.push({name: 'Login'})
      showToast('请重新登录')
      return
    }
    return new Promise((res, rej) => {
      if(!v) return rej()
      closeToast()
      res(data)
    })
  })
}

export default request
