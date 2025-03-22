<template>
  <view class="user-page">
    <view class="nav-bar">
      <view class="title">我的</view>
    </view>
    
    <view class="content">
      <image src="/static/images/backgrounds/bg.jpg" mode="aspectFit" class="placeholder-image"></image>
      <view class="message">个人中心页面开发中，敬请期待</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.user-page {
  min-height: 100vh;
  
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    padding: 0 20rpx;
    padding-top: var(--status-bar-height);
    background-color: #bc8f56;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
    }
  }
  
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 40rpx;
    
    .placeholder-image {
      width: 300rpx;
      height: 300rpx;
      margin-bottom: 60rpx;
    }
    
    .message {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 80rpx;
    }
  }
}
</style> 