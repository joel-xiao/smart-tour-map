<template>
  <view class="booking-page">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
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
  data() {
    return {
      statusBarHeight: 20
    }
  },
  onLoad() {
    this.computeStatusBarHeight();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    // 计算状态栏高度
    computeStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo);
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        console.log('状态栏高度:', this.statusBarHeight);
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    }
  }
}
</script>

<style lang="scss">
.booking-page {
  min-height: 100vh;
  
  /* 状态栏背景 */
  .status-bar {
    background-color: #bc8f56;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  
  .nav-bar {
    display: flex;
    align-items: center;
    height: 80rpx;
    padding: 0;
    background-color: #bc8f56;
    position: relative;
    
    .left-btn {
      padding: 16rpx;
      z-index: 2;
      
      .iconfont {
        font-size: 36rpx;
        color: #fff;
      }
    }
    
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      text-align: center;
      top: -5rpx;
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