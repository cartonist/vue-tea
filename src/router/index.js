import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/home',
    meta: {
      keepAlive: false //设置页面是否需要使用缓存
    },
    // 同级之间的重定向,另一种是父子间的重定向
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/list',
    name: 'List',
    meta: {
      keepAlive: false 
    },
    component: () => import('../views/List.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    meta: {
      keepAlive: false 
    },
    component: () => import('../views/Cart.vue'),
  },
  {
    path: '/my',
    name: 'My',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/My.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Search.vue'),
    redirect: '/search/index',
    children: [
      {
        path: 'index',
        name: 'Search-index',
        component: () => import ('@/views/search/Search-index.vue')
      },
      {
        path: 'list',
        name: 'Search-list',
        component: () => import ('@/views/search/Search-list.vue')
      },
    ],
  },
  {
    path: '/detail',
    name: 'Detail',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/Detail.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Login.vue'),
    redirect: '/login/PhoneLogin',
    children: [
      {
        path: 'UserLogin',
        name: 'UserLogin',
        component: () => import('../views/Login/UserLogin.vue')
      },
      {
        path: 'PhoneLogin',
        name: 'PhoneLogin',
        component: () => import('../views/Login/PhoneLogin.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/Login/Register.vue')
      }
    ]
  },
  {
    path: '/recovery',
    name: 'Recovery',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Recovery.vue'),
    redirect: '/recovery/index',
    children: [
      {
        path: 'index',
        name: 'RecoveryIndex',
        component: () => import('../views/recovery/RecoveryIndex.vue')
      },
      {
        path: 'btn',
        name: 'RecoveryBtn',
        component: () => import('../views/recovery/RecoveryBtn.vue')
      }
    ]
  },
  {
    path: '/address',
    name: 'Address',
    meta: {
      keepAlive: false
    },
    component: () => import('../views/Address.vue'),
    redirect: '/address/index',
    children: [
      {
        path: 'index',
        name: 'AddressIndex',
        component: () => import('../views/address/Address-Index.vue')
      },
      {
        path: 'list',
        name: 'AddressList',
        component: () => import('../views/address/Address-List.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'Order', 
    meta: {
      keepAlive: true
    },
    component: () => import('../views/Order.vue'),
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/Payment.vue'),
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  let nextRoute = ['Payment','Address','Order','AddressIndex','AddressList']
  let userInfo = JSON.parse(localStorage.getItem('teaUserInfo'))
  // 先判断需要跳转的页面是否是需要登录验证的页面
  if( nextRoute.indexOf( to.name ) >= 0) {
    // 再判断有无登录
    if( !userInfo ) {
      router.push({ name: 'Login' })
    }
  }
  next()
})

export default router