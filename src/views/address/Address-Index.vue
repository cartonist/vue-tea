<template>
  <div class="address-index-container container">
    <Header>
      <span>地址管理</span>
    </Header>
    <section ref="wrapper">
      <div>
        <ul class="address" v-if="addrList.length">
          <li @click="goAddressList(item)" v-for="item in addrList" :key="item.id">
            <div class="add-radio" v-if="addrStatus">
              <van-radio-group v-model="checked">
                <van-radio :name="item.id" icon-size="0.5333rem"></van-radio>
              </van-radio-group>
            </div>
            <div class="addr-msg">
              <div class="basic-msg">
                <span class="name">{{item.name}}</span>
                <span>{{item.tel}}</span>
              </div>
              <div class="main-msg">
                <span class="default active" v-if="item.isDefault == '1'">[默认]</span>
                <span>{{item.province}} &nbsp;</span>
                <span>{{item.city}} &nbsp;</span>
                <span>{{item.county}} &nbsp;</span>
                <span>{{item.addressDetail}}</span>
              </div>
            </div>
            <div class="addr-arrow">
              <van-icon name="arrow" color="#999" size="0.64rem" />
            </div>
          </li>
        </ul>
        <div v-else>
          <van-empty description="暂无地址，请添加" image-size="5.333rem" />
        </div>
        <div class="add-addr" @click="goAddressList('add')">添加地址</div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup>
import Header from '@/components/address/Header.vue'
import { getCurrentInstance, onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import request from '@/common/api/request.js'
import { useStore } from 'vuex'
import BScroll from 'better-scroll'
import bus from '@/common/bus.js'
const store = useStore()
const router = useRouter()
const route = useRoute()
const addrList = ref([])
const checked = ref(1)
// 是否是选择状态，即是否是从订单页跳转来的
const addrStatus = ref(false)
const { proxy } = getCurrentInstance()

const goAddressList = option => {
  // 选择状态下点击地址项，直接返回到订单页
  if (addrStatus.value && option != 'add') {
    checked.value = option.id
    setTimeout(() => {
      bus.emit('selectPath', JSON.stringify(option))
      router.back()
    }, 200)
    return
  }
  router.push({
    name: 'AddressList',
    query: {
      key: JSON.stringify(option)
    }
  })
}
const getAddress = async () => {
  const res = await request({
    url: '/api/getAddr',
    method: 'POST',
    headers: {
      token: true
    }
  })
  store.commit('INIT_ADDR', res.data)
  addrList.value = store.state.address.addrList

  proxy.$nextTick(() => {
    new BScroll(proxy.$refs.wrapper, {
      pullUpLoad: true, // 上拉加载
      scrollbar: false, //滚动条
      pullDownRefresh: false, //下拉加载
      mouseWheel: true,
      disableTouch: false,
      click: true,
      probeType: 3
      // bounce: false
      // and so on
    })
  })
}
onBeforeMount(() => {
  getAddress()
  // 从订单页面来的
  if (route.query.type == 'select') {
    addrStatus.value = true
  }
})
</script>

<style lang="less" scoped>
section {
  margin-bottom: 1.4933rem;
  .address {
    li {
      display: flex;
      justify-content: space-between;
      height: 2.6667rem;
      border: 1px solid #efefef;
      margin-bottom: 0.2667rem;
      background-color: #fff;
      .add-radio {
        width: 10%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .addr-msg {
        box-sizing: border-box;
        height: 100%;
        width: 80%;
        padding: 0.4rem;
        font-size: 0.4267rem;
        .basic-msg {
          margin-bottom: 0.5333rem;
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          .name {
            // span是行内元素，宽高属性不生效，margin和padding只有left和right生效

            padding-right: 0.5333rem;
          }
          span {
            font-weight: 700;
          }
        }
        .main-msg {
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          .default {
            padding-right: 0.2667rem;
          }
          .active {
            color: #e1251b;
          }
        }
      }
      .addr-arrow {
        height: 100%;
        width: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .add-addr {
    width: 3.2rem;
    height: 1.0667rem;
    font-size: 0.4267rem;
    color: #fff;
    border-radius: 0.16rem;
    background-color: #bc0707;
    text-align: center;
    line-height: 1.0667rem;
    margin: 1.0667rem auto 0;
  }
}
.van-empty {
  &:deep(p) {
    font-size: 0.4267rem !important;
  }
}
</style>