<template>
  <view class="homepage">
    <!-- 顶部宣传图 -->
    <view class="header-image">
      <image src="/static/images/logos/logo.png" mode="aspectFill" class="main-image"></image>
      <view class="header-text">
        <text class="main-title">智游地图</text>
        <text class="sub-title">景区智能导览服务</text>
        <text class="details">让旅行更便捷，让体验更丰富</text>
      </view>
    </view>
    
    <!-- 服务菜单 -->
    <view class="service-menu">
      <view class="menu-item" v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.url)">
        <view class="menu-icon">
          <text class="iconfont" :class="item.icon"></text>
        </view>
        <view class="menu-text">
          <text>{{item.title}}</text>
          <text class="eng-text">{{item.engTitle}}</text>
        </view>
      </view>
    </view>
    
    <!-- 预约通道 -->
    <view class="booking-channel" @click="navigateToBooking">
      <image src="/static/images/logos/logo.png" mode="aspectFill" class="booking-bg"></image>
      <view class="booking-text">
        <text class="booking-title">景区门票</text>
        <text class="booking-desc">预约通道 >></text>
      </view>
    </view>
    
    <!-- 热门活动 -->
    <view class="section-title">
      <text class="cn-title">热门活动</text>
      <text class="en-title">Activity</text>
    </view>
    
    <view class="activity-card" @click="navigateToActivity">
      <image src="/static/images/logos/logo.png" mode="aspectFill" class="activity-image"></image>
      <view class="activity-overlay">
        <text class="activity-title">景区特色活动</text>
      </view>
    </view>
    
    <!-- 推荐景点 -->
    <view class="section-title">
      <text class="cn-title">推荐景点</text>
      <text class="en-title">Attraction</text>
    </view>
    
    <!-- 景点卡片 -->
    <view class="attraction-list">
      <view v-for="(item, index) in attractions" :key="index" class="attraction-card" @click="navigateToAttraction(item.id)">
        <image :src="item.image" mode="aspectFill" class="attraction-image"></image>
        <view class="attraction-info">
          <text class="attraction-title">{{item.name}}</text>
          <view class="attraction-desc">
            <text>{{item.desc}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部导览按钮 -->
    <view class="map-button" @click="navigateToMap">
      <text class="button-text">全域导览</text>
      <text class="button-icon">></text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {
          title: '景点导览',
          engTitle: 'Guide',
          icon: 'icon-navigation',
          url: '/pages/map/index'
        },
        {
          title: '预约服务',
          engTitle: 'Booking',
          icon: 'icon-booking',
          url: '/pages/booking/index'
        },
        {
          title: '智能导览',
          engTitle: 'Smart Guide',
          icon: 'icon-smart',
          url: '/pages/map/index'
        },
        {
          title: '个人中心',
          engTitle: 'User',
          icon: 'icon-user',
          url: '/pages/user/index'
        }
      ],
      attractions: [
        {
          id: 1,
          name: '景点一号',
          desc: '精彩景点描述内容',
          image: '/static/images/logos/logo.png'
        },
        {
          id: 2,
          name: '景点二号',
          desc: '精彩景点描述内容',
          image: '/static/images/logos/logo.png'
        },
        {
          id: 3,
          name: '景点三号',
          desc: '精彩景点描述内容',
          image: '/static/images/logos/logo.png'
        }
      ]
    }
  },
  onLoad() {
    // 页面加载时的逻辑
    console.log('首页加载');
    this.loadPageData();
  },
  methods: {
    // 加载页面数据
    loadPageData() {
      // 此处可以从API获取数据
      console.log('加载首页数据');
    },
    // 导航到指定页面
    navigateTo(url) {
      uni.navigateTo({
        url: url
      });
    },
    // 导航到预约页面
    navigateToBooking() {
      uni.navigateTo({
        url: '/pages/booking/index'
      });
    },
    // 导航到活动详情页
    navigateToActivity() {
      uni.navigateTo({
        url: '/pages/activity/detail'
      });
    },
    // 导航到景点详情页
    navigateToAttraction(id) {
      uni.navigateTo({
        url: `/pages/attraction/detail?id=${id}`
      });
    },
    // 导航到地图页面
    navigateToMap() {
      uni.switchTab({
        url: '/pages/map/index'
      });
    }
  }
}
</script>

<style lang="scss">
.homepage {
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-image {
  position: relative;
  height: 450rpx;
  overflow: hidden;
  
  .main-image {
    width: 100%;
    height: 100%;
  }
  
  .header-text {
    position: absolute;
    top: 80rpx;
    left: 40rpx;
    color: #fff;
    display: flex;
    flex-direction: column;
    
    .main-title {
      font-size: 48rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .sub-title, .details {
      font-size: 28rpx;
    }
  }
}

.service-menu {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  margin: -40rpx 20rpx 20rpx;
  position: relative;
  z-index: 2;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
  
  .menu-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
    
    .menu-icon {
      width: 80rpx;
      height: 80rpx;
      background-color: rgba(188, 143, 86, 0.2);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10rpx;
      
      .iconfont {
        color: #bc8f56;
        font-size: 40rpx;
      }
    }
    
    .menu-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      text {
        font-size: 24rpx;
        color: #333;
      }
      
      .eng-text {
        font-size: 20rpx;
        color: #999;
      }
    }
  }
}

.booking-channel {
  position: relative;
  height: 160rpx;
  margin: 0 20rpx 30rpx;
  border-radius: 16rpx;
  overflow: hidden;
  
  .booking-bg {
    width: 100%;
    height: 100%;
  }
  
  .booking-text {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding: 0 40rpx;
    
    .booking-title {
      font-size: 36rpx;
      color: #fff;
      font-weight: bold;
    }
    
    .booking-desc {
      font-size: 28rpx;
      color: #fff;
      background-color: rgba(255,255,255,0.3);
      padding: 6rpx 16rpx;
      border-radius: 30rpx;
      margin-top: 10rpx;
    }
  }
}

.section-title {
  display: flex;
  align-items: center;
  margin: 30rpx 20rpx 20rpx;
  
  .cn-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .en-title {
    font-size: 24rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

.activity-card {
  position: relative;
  height: 300rpx;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  
  .activity-image {
    width: 100%;
    height: 100%;
  }
  
  .activity-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    
    .activity-title {
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.attraction-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20rpx;
  
  .attraction-card {
    width: 48%;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.1);
    margin-bottom: 20rpx;
    
    .attraction-image {
      width: 100%;
      height: 200rpx;
    }
    
    .attraction-info {
      padding: 16rpx;
      
      .attraction-title {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 8rpx;
      }
      
      .attraction-desc {
        font-size: 22rpx;
        color: #666;
        line-height: 1.4;
      }
    }
  }
}

.map-button {
  width: 710rpx;
  height: 80rpx;
  margin: 30rpx auto;
  background-color: #bc8f56;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  
  .button-text {
    font-size: 28rpx;
    font-weight: bold;
    margin-right: 10rpx;
  }
  
  .button-icon {
    font-size: 24rpx;
  }
}
</style>
