<template>
  <div class="card-container">
    <!-- <slot> -->
    <span class="title">
      <slot>
        热门推荐
      </slot>
    </span>
    <!-- </slot> -->
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.card-container {
  height: 1.3333rem;
  // font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.32rem;
  background-color: #fff;
  .title {
    font-size: 0.48rem;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      width: 0.2133rem;
      height: 0.2133rem;
      border-radius: 50%;
      display: block;
      background: #d4c0a7;
      top: 50%;
      margin-top: -0.1067rem;
      right: -0.5rem;
    }
    &::before {
      content: '';
      position: absolute;
      width: 0.2133rem;
      height: 0.2133rem;
      border-radius: 50%;
      display: block;
      background: #d4c0a7;
      top: 50%;
      margin-top: -0.1067rem;
      left: -0.5rem;
    }
  }
}
</style>