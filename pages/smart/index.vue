<template>
  <view class="smart-page">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="title">智享夏都</view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content">
      <image src="/static/images/backgrounds/bg.jpg" mode="aspectFit" class="placeholder-image"></image>
      <view class="message">智享夏都页面开发中，敬请期待</view>
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
.smart-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  
  /* 状态栏背景 */
  .status-bar {
    background-color: #bc8f56;
    width: 100%;
  }
  
  /* 导航栏 */
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    padding: 0 20rpx;
    background-color: #bc8f56;
    width: 100%;
    position: relative;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
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
  }
}
</style> 