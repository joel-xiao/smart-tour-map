<template>
  <view class="guide-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <text class="title">景点导览</text>
    </view>
    
    <!-- 景点大图 -->
    <view class="spot-banner">
      <image :src="currentSpot.banner" mode="aspectFill" class="banner-image"></image>
      <view class="banner-info">
        <text class="banner-title">{{currentSpot.name}}</text>
        <text class="banner-tag">{{currentSpot.tag}}</text>
      </view>
    </view>
    
    <!-- 导览功能区 -->
    <view class="guide-features">
      <view class="feature-item" @click="showMapView">
        <view class="feature-icon">
          <text class="iconfont icon-location"></text>
        </view>
        <text class="feature-text">位置导航</text>
      </view>
      <view class="feature-item" @click="toggle3DView">
        <view class="feature-icon">
          <text class="iconfont" :class="is3DView ? 'icon-3d' : 'icon-2d'"></text>
        </view>
        <text class="feature-text">{{is3DView ? '3D景观' : '2D导览'}}</text>
      </view>
      <view class="feature-item" @click="togglePanorama">
        <view class="feature-icon">
          <text class="iconfont icon-panorama"></text>
        </view>
        <text class="feature-text">全景体验</text>
      </view>
      <view class="feature-item" @click="collectSpot">
        <view class="feature-icon" :class="{active: isCollected}">
          <text class="iconfont icon-collect"></text>
        </view>
        <text class="feature-text">收藏</text>
      </view>
    </view>
    
    <!-- 语音导览控制栏 -->
    <view class="audio-control">
      <view class="audio-btn" @click="togglePlay">
        <text class="iconfont" :class="isPlaying ? 'icon-close' : 'icon-right'"></text>
      </view>
      <view class="audio-info">
        <text class="audio-title">{{currentSpot.name}}景点语音导览</text>
        <slider 
          class="audio-progress" 
          :value="audioProgress" 
          :max="100"
          @change="onSliderChange"
          activeColor="#bc8f56"
          backgroundColor="#e0e0e0"
          block-size="20"
        />
      </view>
      <text class="audio-time">{{formatTime(currentTime)}}/{{formatTime(totalTime)}}</text>
    </view>
    
    <!-- 地图弹窗 -->
    <view class="map-popup" v-if="showMap">
      <view class="map-header">
        <text class="map-title">位置导航</text>
        <text class="close-btn iconfont icon-close" @click="showMap = false"></text>
      </view>
      <view class="map-container">
        <map
          id="guideMap"
          style="width: 100%; height: 100%;"
          :longitude="currentSpot.longitude || 115.980"
          :latitude="currentSpot.latitude || 40.360"
          :scale="16"
          :markers="mapMarkers"
          :show-location="true"
          :enable-zoom="true"
          :enable-scroll="true"
        ></map>
      </view>
    </view>
    
    <!-- 导览内容 -->
    <scroll-view class="guide-content" scroll-y>
      <!-- 景点介绍区 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-title">景点介绍</text>
        </view>
        <view class="info-body">
          <text class="info-text">{{currentSpot.description}}</text>
        </view>
      </view>
      
      <!-- 景点图片 -->
      <scroll-view class="photos-scroll" scroll-x>
        <view class="photos-container">
          <view class="photo-item" v-for="(photo, index) in currentSpot.photos" :key="index" @click="previewImage(index)">
            <image :src="photo" mode="aspectFill" class="spot-photo"></image>
          </view>
        </view>
      </scroll-view>
      
      <!-- 历史文化区 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-title">历史文化</text>
        </view>
        <view class="info-body">
          <text class="info-text">{{currentSpot.history}}</text>
        </view>
      </view>
      
      <!-- 参观提示区 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-title">参观提示</text>
        </view>
        <view class="info-body">
          <view class="info-item" v-for="(tip, index) in currentSpot.tips" :key="index">
            <text class="item-bullet">•</text>
            <text class="item-text">{{tip}}</text>
          </view>
        </view>
      </view>
      
      <!-- 开放信息区 -->
      <view class="info-card">
        <view class="info-header">
          <text class="info-title">开放信息</text>
        </view>
        <view class="info-body">
          <view class="info-row">
            <text class="row-label">开放时间：</text>
            <text class="row-value">{{currentSpot.openTime}}</text>
          </view>
          <view class="info-row">
            <text class="row-label">门票信息：</text>
            <text class="row-value">{{currentSpot.ticketInfo}}</text>
          </view>
          <view class="info-row">
            <text class="row-label">交通路线：</text>
            <text class="row-value">{{currentSpot.transport}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部关联景点 -->
    <view class="related-spots">
      <view class="related-header">
        <text class="related-title">相关景点</text>
        <text class="view-more">查看更多</text>
      </view>
      <scroll-view class="related-scroll" scroll-x>
        <view 
          class="related-item" 
          v-for="(item, index) in relatedSpots" 
          :key="index"
          @click="switchSpot(item.id)"
        >
          <image :src="item.image" mode="aspectFill" class="related-image"></image>
          <text class="related-name">{{item.name}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import mapConfig from '@/static/config/mapConfig.js';
import markersData from '@/static/data/markers.js';

export default {
  data() {
    return {
      spotId: null,
      isPlaying: false,
      audioProgress: 0,
      currentTime: 0,
      totalTime: 180, // 默认3分钟
      audioContext: null,
      showMap: false,
      is3DView: false,
      isCollected: false,
      
      // 当前景点信息
      currentSpot: null,
      
      // 地图标记
      mapMarkers: [],
      
      // 相关景点
      relatedSpots: []
    }
  },
  onLoad(options) {
    // 错误处理
    try {
      if (options.id) {
        this.spotId = parseInt(options.id);
        this.loadSpotData(this.spotId);
      } else {
        // 默认加载八达岭长城
        this.loadSpotData(1);
      }
      
      // 初始化音频上下文
      this.initAudioContext();
      
      // 提前初始化地图标记，防止空指针
      this.mapMarkers = [{
        id: 1,
        longitude: 115.980,
        latitude: 40.360,
        title: "八达岭长城",
        iconPath: '/static/images/logos/logo.png',
        width: 32,
        height: 40,
        callout: {
          content: "八达岭长城",
          display: 'ALWAYS',
          bgColor: "#ffffff",
          color: "#333333",
          borderRadius: 3,
          fontSize: 12,
          padding: 8
        }
      }];
    } catch (error) {
      console.error('页面加载错误:', error);
      this.handleError('页面加载失败，请重试');
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    // 加载景点数据
    loadSpotData(id) {
      try {
        // 显示加载中
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        
        // 从数据源中查找景点
        let spot = null;
        
        // 在所有分类中查找该景点
        for (const category of markersData) {
          const found = category.data.find(item => item.id === id);
          if (found) {
            spot = found;
            break;
          }
        }
        
        if (!spot) {
          uni.hideLoading();
          uni.showToast({
            title: '未找到景点数据',
            icon: 'none'
          });
          
          // 尝试回退到默认景点
          if (id !== 1) {
            setTimeout(() => {
              this.loadSpotData(1);
            }, 1500);
          }
          return;
        }
        
        // 设置当前景点
        this.currentSpot = {
          id: spot.id,
          name: spot.name,
          tag: spot.category || '景点',
          longitude: spot.longitude,
          latitude: spot.latitude,
          location: spot.location || '八达岭景区',
          openTime: spot.open_time || '暂无开放时间信息',
          banner: spot.images && spot.images.length > 0 ? spot.images[0] : '/static/images/logos/logo.png',
          description: spot.desc || '暂无描述',
          history: spot.history || '暂无历史信息',
          ticketInfo: spot.ticket_info || '暂无票价信息',
          transport: spot.transport || '暂无交通信息',
          photos: spot.images || ['/static/images/logos/logo.png', '/static/images/logos/logo.png', '/static/images/logos/logo.png'],
          tips: spot.tips || ['暂无参观提示'],
          audio: spot.audio || '',
          panoramaId: spot.panorama_id || ''
        };
        
        // 初始化地图标记
        this.initMapMarkers();
        
        // 查找相关景点
        this.loadRelatedSpots();
        
        // 隐藏加载中
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();
        console.error('加载景点数据错误:', error);
        this.handleError('加载景点数据失败，请重试');
      }
    },
    
    // 初始化地图标记
    initMapMarkers() {
      this.mapMarkers = [
        {
          id: this.currentSpot.id,
          longitude: this.currentSpot.longitude,
          latitude: this.currentSpot.latitude,
          title: this.currentSpot.name,
          iconPath: '/static/images/logos/logo.png',
          width: mapConfig.markerStyle.width,
          height: mapConfig.markerStyle.height,
          callout: {
            content: this.currentSpot.name,
            ...mapConfig.markerStyle.calloutStyle,
            display: 'ALWAYS'
          }
        }
      ];
    },
    
    // 加载相关景点
    loadRelatedSpots() {
      this.relatedSpots = [];
      
      // 找到当前景点所在的分类
      let category = null;
      for (const cat of markersData) {
        if (cat.data.some(item => item.id === this.currentSpot.id)) {
          category = cat;
          break;
        }
      }
      
      if (category) {
        // 从同类别中找出4个其他景点
        this.relatedSpots = category.data
          .filter(item => item.id !== this.currentSpot.id)
          .slice(0, 4)
          .map(item => ({
            id: item.id,
            name: item.name,
            image: item.images && item.images.length > 0 ? item.images[0] : '/static/images/logos/logo.png'
          }));
      }
    },
    
    // 初始化音频上下文
    initAudioContext() {
      // 使用模拟方式播放音频
      this.currentTime = 0;
      this.totalTime = 180; // 3分钟
      this.audioProgress = 0;
      this.audioPlayTimer = null;
    },
    
    // 播放/暂停音频
    togglePlay() {
      try {
        // 模拟音频播放
        this.isPlaying = !this.isPlaying;
        
        uni.showToast({
          title: this.isPlaying ? '开始播放导览' : '已暂停播放',
          icon: 'none'
        });
        
        if (this.isPlaying) {
          // 模拟播放进度
          this.audioPlayTimer = setInterval(() => {
            this.currentTime += 1;
            if (this.currentTime >= this.totalTime) {
              this.currentTime = 0;
              this.isPlaying = false;
              clearInterval(this.audioPlayTimer);
            }
            this.audioProgress = (this.currentTime / this.totalTime) * 100;
          }, 1000);
        } else {
          // 暂停播放
          if (this.audioPlayTimer) {
            clearInterval(this.audioPlayTimer);
          }
        }
      } catch (error) {
        console.error('音频控制错误:', error);
        uni.showToast({
          title: '音频播放失败',
          icon: 'none'
        });
      }
    },
    
    // 进度条改变
    onSliderChange(e) {
      const value = e.detail.value;
      const time = (value / 100) * this.totalTime;
      this.audioContext.seek(time);
      this.currentTime = time;
    },
    
    // 格式化时间
    formatTime(seconds) {
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    },
    
    // 切换景点
    switchSpot(id) {
      this.spotId = id;
      this.loadSpotData(id);
      
      // 重置音频
      if (this.isPlaying) {
        this.audioContext.pause();
      }
      this.audioProgress = 0;
      this.currentTime = 0;
      this.isPlaying = false;
    },
    
    // 切换3D视图
    toggle3DView() {
      this.is3DView = !this.is3DView;
      // 实际项目中可能需要加载不同的模型或切换视图
    },
    
    // 切换全景
    togglePanorama() {
      if (!mapConfig.panorama.active) {
        uni.showToast({
          title: '全景功能未启用',
          icon: 'none'
        });
        return;
      }
      
      if (!this.currentSpot.panoramaId) {
        uni.showToast({
          title: '该景点暂无全景',
          icon: 'none'
        });
        return;
      }
      
      // 打开全景页面
      const url = mapConfig.panorama.rootUrl + this.currentSpot.panoramaId;
      uni.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(url)}`
      });
    },
    
    // 收藏景点
    collectSpot() {
      this.isCollected = !this.isCollected;
      uni.showToast({
        title: this.isCollected ? '已收藏' : '已取消收藏',
        icon: 'none'
      });
      
      // 实际项目中可以将收藏信息保存到本地或云端
    },
    
    // 预览图片
    previewImage(index) {
      if (!this.currentSpot.photos || this.currentSpot.photos.length === 0) {
        return;
      }
      
      uni.previewImage({
        urls: this.currentSpot.photos,
        current: this.currentSpot.photos[index]
      });
    },
    
    // 显示地图
    showMapView() {
      try {
        this.showMap = true;
        
        // 确保地图加载完成后再设置视野
        setTimeout(() => {
          console.log('初始化地图视野');
          const mapContext = uni.createMapContext('guideMap', this);
          
          // 打印当前点信息，以便调试
          console.log('当前点坐标:', {
            latitude: this.currentSpot.latitude,
            longitude: this.currentSpot.longitude
          });
          
          if (mapContext) {
            mapContext.includePoints({
              points: [{
                latitude: this.currentSpot.latitude,
                longitude: this.currentSpot.longitude
              }],
              padding: [50, 50, 50, 50],
              success: () => {
                console.log('地图视野更新成功');
              },
              fail: (err) => {
                console.error('地图视野更新失败:', err);
                // 重试
                setTimeout(() => {
                  if (this.showMap) {
                    const retryMapContext = uni.createMapContext('guideMap', this);
                    if (retryMapContext) {
                      retryMapContext.includePoints({
                        points: [{
                          latitude: this.currentSpot.latitude,
                          longitude: this.currentSpot.longitude
                        }],
                        padding: [50, 50, 50, 50]
                      });
                    }
                  }
                }, 1000);
              }
            });
          } else {
            console.error('无法获取地图上下文');
          }
        }, 500);
      } catch (error) {
        console.error('显示地图错误:', error);
        uni.showToast({
          title: '地图加载失败，请重试',
          icon: 'none'
        });
      }
    },
    
    // 错误处理方法
    handleError(message) {
      uni.showToast({
        title: message || '操作失败，请重试',
        icon: 'none',
        duration: 2000
      });
    },
    
    // 重新加载数据
    reloadData() {
      if (this.spotId) {
        this.loadSpotData(this.spotId);
      } else {
        this.loadSpotData(1);
      }
    }
  },
  onUnload() {
    // 页面卸载时清理资源
    if (this.audioPlayTimer) {
      clearInterval(this.audioPlayTimer);
      this.audioPlayTimer = null;
    }
  }
}
</script>

<style lang="scss">
.guide-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
}

.nav-bar {
  height: 90rpx;
  background-color: var(--primary-color);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  position: relative;
  z-index: 100;
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 40rpx;
    }
  }
  
  .title {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
  }
}

.spot-banner {
  position: relative;
  height: 380rpx;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
  
  .banner-info {
    position: absolute;
    left: 30rpx;
    bottom: 30rpx;
    display: flex;
    flex-direction: column;
    
    .banner-title {
      font-size: 40rpx;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
      margin-bottom: 10rpx;
    }
    
    .banner-tag {
      font-size: 24rpx;
      color: #fff;
      background-color: rgba(188, 143, 86, 0.8);
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      width: fit-content;
    }
  }
}

.guide-features {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .feature-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10rpx;
      
      &.active {
        background-color: var(--primary-color);
        
        .iconfont {
          color: #fff;
        }
      }
      
      .iconfont {
        font-size: 36rpx;
        color: #666;
      }
    }
    
    .feature-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.audio-control {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .audio-btn {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background-color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    
    .iconfont {
      color: #fff;
      font-size: 32rpx;
    }
  }
  
  .audio-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .audio-title {
      font-size: 26rpx;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .audio-progress {
      width: 100%;
    }
  }
  
  .audio-time {
    font-size: 24rpx;
    color: #999;
    margin-left: 20rpx;
  }
}

.map-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 101;
  display: flex;
  flex-direction: column;
  
  .map-header {
    height: 90rpx;
    background-color: var(--primary-color);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .map-title {
      font-size: 32rpx;
      font-weight: bold;
    }
    
    .close-btn {
      position: absolute;
      right: 20rpx;
      font-size: 40rpx;
    }
  }
  
  .map-container {
    flex: 1;
    width: 100%;
    height: calc(100% - 90rpx);
    position: relative;
  }
}

.guide-content {
  flex: 1;
  padding: 0 20rpx 20rpx;
}

.info-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  
  .info-header {
    padding: 20rpx;
    border-bottom: 2rpx solid #f5f5f5;
    
    .info-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      position: relative;
      padding-left: 20rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 6rpx;
        bottom: 6rpx;
        width: 8rpx;
        background-color: var(--primary-color);
        border-radius: 4rpx;
      }
    }
  }
  
  .info-body {
    padding: 20rpx;
    
    .info-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
    }
    
    .info-item {
      display: flex;
      margin-bottom: 16rpx;
      
      .item-bullet {
        color: var(--primary-color);
        margin-right: 10rpx;
      }
      
      .item-text {
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
        flex: 1;
      }
    }
    
    .info-row {
      display: flex;
      margin-bottom: 16rpx;
      
      .row-label {
        width: 160rpx;
        font-size: 28rpx;
        color: #999;
      }
      
      .row-value {
        flex: 1;
        font-size: 28rpx;
        color: #333;
        line-height: 1.5;
      }
    }
  }
}

.photos-scroll {
  width: 100%;
  height: 200rpx;
  margin-bottom: 20rpx;
  &::-webkit-scrollbar {
    display: none;
  }
  
  .photos-container {
    display: flex;
    padding: 0 10rpx;
    
    .photo-item {
      width: 280rpx;
      height: 180rpx;
      margin: 0 10rpx;
      border-radius: 12rpx;
      overflow: hidden;
      
      .spot-photo {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.related-spots {
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 100rpx;
  
  .related-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .related-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .view-more {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .related-scroll {
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
    
    .related-item {
      display: inline-block;
      width: 200rpx;
      margin-right: 20rpx;
      
      .related-image {
        width: 200rpx;
        height: 150rpx;
        border-radius: 12rpx;
        margin-bottom: 10rpx;
      }
      
      .related-name {
        font-size: 26rpx;
        color: #333;
        display: block;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style> 