<template>
  <div v-if="payStatus" class="container">
    <header>
      <div class="header">
        <div class="header-title">支付成功</div>
      </div>
    </header>
    <section>
      <div class="pay-msg">
        <van-icon name="passed" size="2.6667rem" color="#3EC133" />
        <div class="pay-status">恭喜您的订单支付成功</div>
        <div class="pay-remark">已通知商家发货</div>
      </div>
      <div class="pay-detail">
        <div>
          <span class="detail-title">支付金额</span>
          <span>￥{{price}}</span>
        </div>
        <div>
          <span class="detail-title">支付方式</span>
          <span>支付宝支付</span>
        </div>
        <div>
          <span class="detail-title">宝贝状态</span>
          <span>已支付</span>
        </div>
      </div>
      <div class="home-btn" @click="router.push({ name: 'Home'})">
        返回首页
      </div>
    </section>
  </div>
  <div v-else class="container">支付失败</div>
</template>

<script setup>
import request from '@/common/api/request.js'
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import qs from 'qs'
const route = useRoute()
const router = useRouter()
const payStatus = ref(false)
const price = ref(route.query.total_amount)
onBeforeMount(async () => {
  const data = {
    out_trade_no: route.query.out_trade_no,
    trade_no: route.query.trade_no
  }
  // 查询交易的状态
  const res = await request({
    url: '/api/successPayment',
    method: 'POST',
    headers: {
      token: true,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // qs是增加安全性的序列化,序列化成为URL的形式
    data: qs.stringify(data)
  })
  if (res && (res.code == 1 || res.code == 2)) {
    payStatus.value = true
  }
})
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.48rem;
  height: 1.1733rem;
  background-color: #e1251b;
}
.pay-msg {
  display: flex;
  flex-direction: column;
  height: 6.9333rem;
  align-items: center;
  justify-content: center;
  .pay-status {
    margin-top: 0.8rem;
    font-size: 0.5333rem;
  }
  .pay-remark {
    font-size: 0.3733rem;
    margin-top: 0.2667rem;
    color: #999;
  }
}
.pay-detail {
  background-color: #fff;
  margin: 0 0.2667rem;
  padding: 0.5333rem 0.5333rem 0;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  & > div {
    display: flex;
    justify-content: space-between;
    font-size: 0.3733rem;
    padding-bottom: 0.5333rem;
  }
  .detail-title {
    color: gray;
  }
}
.home-btn {
  height: 1.2rem;
  margin: 0.5333rem 0.2667rem 0;
  background-color: #e1251b;
  border-radius: 0.2667rem;
  font-size: 0.48rem;
  color: #fff;
  line-height: 1.2rem;
  text-align: center;
}
</style>