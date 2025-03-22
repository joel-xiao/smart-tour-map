<template>
  <view class="webview-container">
    <web-view :src="url" @message="handleMessage" @error="handleWebViewError"></web-view>
    
    <!-- 加载中提示 -->
    <view class="loading" v-if="isLoading">
      <view class="loading-content">
        <view class="loading-icon"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
    
    <!-- 错误提示 -->
    <view class="error-container" v-if="hasError">
      <view class="error-content">
        <text class="error-title">加载失败</text>
        <text class="error-desc">{{errorMsg}}</text>
        <view class="error-btn" @click="reload">重新加载</view>
        <view class="error-btn error-back" @click="goBack">返回</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      isLoading: true,
      hasError: false,
      errorMsg: '连接服务器超时，请检查网络',
      retryCount: 0,
      maxRetryCount: 3
    };
  },
  onLoad(options) {
    if (options.url) {
      // 解码URL
      this.url = decodeURIComponent(options.url);
      
      // 设置导航栏标题
      if (options.title) {
        uni.setNavigationBarTitle({
          title: decodeURIComponent(options.title)
        });
      }
      
      // 监控加载状态
      this.startLoadingTimeout();
    } else {
      this.hasError = true;
      this.errorMsg = '链接无效';
      this.isLoading = false;
    }
  },
  methods: {
    handleMessage(event) {
      console.log('来自网页的消息:', event.detail);
      // 收到消息表示页面已加载
      this.isLoading = false;
    },
    
    // 处理WebView加载错误
    handleWebViewError(err) {
      console.error('WebView加载错误:', err);
      this.hasError = true;
      this.isLoading = false;
      this.errorMsg = '加载失败，请检查网络后重试';
    },
    
    // 设置加载超时
    startLoadingTimeout() {
      // 15秒后如果还在加载中，则认为超时
      setTimeout(() => {
        if (this.isLoading) {
          this.hasError = true;
          this.errorMsg = '连接服务器超时，请检查网络';
        }
      }, 15000);
    },
    
    // 重新加载
    reload() {
      if (this.retryCount >= this.maxRetryCount) {
        uni.showToast({
          title: '多次加载失败，请稍后再试',
          icon: 'none'
        });
        return;
      }
      
      this.retryCount++;
      this.hasError = false;
      this.isLoading = true;
      
      // 重新加载同一URL
      const currentUrl = this.url;
      this.url = '';
      
      setTimeout(() => {
        this.url = currentUrl;
        this.startLoadingTimeout();
      }, 500);
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style>
.webview-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 6rpx solid #f1f1f1;
  border-top: 6rpx solid #bc8f56;
  animation: spin 1s linear infinite;
  margin-bottom: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 32rpx;
  color: #666;
}

.error-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.error-content {
  width: 80%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.error-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.error-desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 40rpx;
}

.error-btn {
  width: 80%;
  height: 80rpx;
  background-color: #bc8f56;
  color: #fff;
  font-size: 30rpx;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}

.error-back {
  background-color: #f5f5f5;
  color: #666;
}
</style> 