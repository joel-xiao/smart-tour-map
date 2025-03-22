<template>
  <view class="booking-page">
    <view class="nav-bar">
      <view class="left-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">预约通道</view>
    </view>
    
    <view class="content">
      <image src="/static/images/backgrounds/bg.jpg" mode="aspectFit" class="placeholder-image"></image>
      <view class="message">预约页面开发中，敬请期待</view>
      <button class="back-btn" @click="goToHome">返回首页</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
}
</script>

<style lang="scss">
.booking-page {
  min-height: 100vh;
  
  .nav-bar {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 20rpx;
    padding-top: var(--status-bar-height);
    background-color: #bc8f56;
    
    .left-btn {
      padding: 16rpx;
      
      .iconfont {
        font-size: 36rpx;
        color: #fff;
      }
    }
    
    .title {
      flex: 1;
      text-align: center;
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
    
    .back-btn {
      background-color: #bc8f56;
      color: #fff;
      font-size: 30rpx;
      padding: 20rpx 60rpx;
      border-radius: 40rpx;
    }
  }
}
</style> 