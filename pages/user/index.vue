<template>
  <view class="user-page">
    <view class="safe-area">
      <view class="nav-bar">
        <view class="title">我的</view>
      </view>
      
      <view class="content">
        <image src="/static/images/backgrounds/bg.jpg" mode="aspectFit" class="placeholder-image"></image>
        <view class="message">个人中心页面开发中，敬请期待</view>
      </view>
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
    // 获取状态栏高度
    this.computeStatusBarHeight();
  },
  methods: {
    // 计算状态栏高度
    computeStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo);
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        
        // 设置css变量
        // #ifdef H5
        document.documentElement.style.setProperty('--status-bar-height', `${this.statusBarHeight}px`);
        // #endif
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    }
  }
}
</script>

<style lang="scss">
.user-page {
  min-height: 100vh;
  
  .safe-area {
    padding-top: var(--status-bar-height, 44px); /* 默认安全区域 */
  }
  
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    padding: 0 20rpx;
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