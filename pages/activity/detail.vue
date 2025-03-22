<template>
  <view class="activity-page">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <view class="nav-bar">
      <view class="left-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">活动详情</view>
    </view>
    
    <view class="content">
      <image src="/static/images/backgrounds/bg.jpg" mode="aspectFit" class="activity-banner"></image>
      <view class="activity-title">八达岭少年使者</view>
      <view class="activity-desc">
        <view class="desc-item">
          <text class="label">活动时间：</text>
          <text class="value">2025年3月1日 - 2025年4月30日</text>
        </view>
        <view class="desc-item">
          <text class="label">活动地点：</text>
          <text class="value">八达岭长城景区</text>
        </view>
        <view class="desc-item">
          <text class="label">活动对象：</text>
          <text class="value">6-15岁青少年</text>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">活动介绍</view>
        <view class="section-content">
          <text class="paragraph">
            "八达岭少年使者"是一项针对青少年的爱国主义教育活动，旨在让青少年在游览八达岭长城的过程中，了解长城文化，感受中华文明的伟大，增强爱国主义情怀。
          </text>
          <text class="paragraph">
            活动内容包括：长城文化讲解、历史知识问答、少年使者授牌仪式、合影留念等环节。参与活动的少年将获得"八达岭少年使者"徽章一枚，证书一份。
          </text>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">活动流程</view>
        <view class="section-content">
          <view class="step-item">
            <text class="step-num">01</text>
            <view class="step-info">
              <text class="step-title">报名登记</text>
              <text class="step-desc">在八达岭长城游客中心报名登记</text>
            </view>
          </view>
          <view class="step-item">
            <text class="step-num">02</text>
            <view class="step-info">
              <text class="step-title">文化讲解</text>
              <text class="step-desc">专业讲解员进行长城文化讲解</text>
            </view>
          </view>
          <view class="step-item">
            <text class="step-num">03</text>
            <view class="step-info">
              <text class="step-title">互动体验</text>
              <text class="step-desc">参与历史知识问答和互动游戏</text>
            </view>
          </view>
          <view class="step-item">
            <text class="step-num">04</text>
            <view class="step-info">
              <text class="step-title">授牌仪式</text>
              <text class="step-desc">颁发"八达岭少年使者"徽章和证书</text>
            </view>
          </view>
        </view>
      </view>
      
      <button class="join-btn" @click="signUp">立即报名</button>
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
    signUp() {
      uni.showToast({
        title: '报名成功',
        icon: 'success'
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
.activity-page {
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
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      top: -5rpx;
    }
  }
  
  .content {
    padding: 30rpx;
    padding-bottom: 60rpx;
    
    .activity-banner {
      width: 100%;
      height: 400rpx;
      border-radius: 16rpx;
      margin-bottom: 30rpx;
    }
    
    .activity-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .activity-desc {
      background-color: #f8f8f8;
      padding: 20rpx;
      border-radius: 12rpx;
      margin-bottom: 30rpx;
      
      .desc-item {
        margin-bottom: 10rpx;
        font-size: 28rpx;
        
        .label {
          color: #666;
        }
        
        .value {
          color: #333;
        }
      }
    }
    
    .section {
      margin-bottom: 30rpx;
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        position: relative;
        padding-left: 20rpx;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8rpx;
          width: 8rpx;
          height: 30rpx;
          background-color: #bc8f56;
          border-radius: 4rpx;
        }
      }
      
      .section-content {
        color: #333;
        
        .paragraph {
          font-size: 28rpx;
          line-height: 1.8;
          margin-bottom: 20rpx;
          text-align: justify;
          display: block;
        }
      }
      
      .step-item {
        display: flex;
        margin-bottom: 20rpx;
        align-items: center;
        
        .step-num {
          width: 60rpx;
          height: 60rpx;
          background-color: #bc8f56;
          color: #fff;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26rpx;
          font-weight: bold;
          margin-right: 20rpx;
        }
        
        .step-info {
          flex: 1;
          
          .step-title {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 6rpx;
            display: block;
          }
          
          .step-desc {
            font-size: 26rpx;
            color: #666;
            display: block;
          }
        }
      }
    }
    
    .join-btn {
      width: 90%;
      height: 90rpx;
      line-height: 90rpx;
      background-color: #bc8f56;
      color: #fff;
      font-size: 32rpx;
      border-radius: 45rpx;
      margin-top: 40rpx;
    }
  }
}
</style> 