import { createApp } from 'vue'
// import './style.css'
import './assets/css/reset.css'
import './assets/css/common.css'

// 无线适配文件
import '@/assets/js/flexible.js'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局组件
import Tabbar from '@/components/common/Tabbar.vue'
// 引入ly-tab插件
// import LyTab from 'ly-tab'
import { Lazyload } from 'vant'

const app = createApp(App)
app.component('Tabbar',Tabbar)

app.use(router).use(store).use(Lazyload)
app.mount('#app')
