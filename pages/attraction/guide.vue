<template>
  <view class="guide-container">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导览头部 -->
    <view class="guide-header" :style="{height: '280rpx'}" v-if="currentSpot">
      <image 
        class="spot-banner" 
        :src="currentSpot && currentSpot.banner ? currentSpot.banner : '/static/images/backgrounds/bg.jpg'" 
        mode="aspectFill" 
        @error="() => { currentSpot.banner = '/static/images/backgrounds/bg.jpg' }"
      >
      </image>
      
      <view class="header-mask"></view>
      
      <view class="header-controls">
        <view class="back-btn" @click="goBack">
          <text class="iconfont icon-back"></text>
        </view>
        <view class="action-btn collect-btn" @click="collectSpot">
          <text class="iconfont" :class="isCollected ? 'icon-star-filled' : 'icon-star'"></text>
        </view>
      </view>
      
      <view class="header-info">
        <view class="spot-info">
          <text class="spot-name">{{currentSpot && currentSpot.name ? currentSpot.name : '景点'}}</text>
          <text class="spot-tag">{{currentSpot && currentSpot.tag ? currentSpot.tag : '景点'}}</text>
        </view>
        <view class="spot-location">
          <text class="location-text">{{currentSpot && currentSpot.location ? currentSpot.location : '景区'}}</text>
          <view class="location-btn" @click="showMapView">
            <text class="location-icon iconfont icon-map"></text>
            <text class="location-label">导航</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 导览功能 -->
    <view class="guide-features" v-if="currentSpot">
      <view class="feature-card" @click="togglePlay">
        <view class="feature-icon">
          <text class="iconfont icon-voice"></text>
        </view>
        <text class="feature-name">语音讲解</text>
      </view>
      <view class="feature-card" @click="togglePanorama">
        <view class="feature-icon">
          <text class="iconfont icon-3d"></text>
        </view>
        <text class="feature-name">全景查看</text>
      </view>
      <view class="feature-card" @click="showIntroduction">
        <view class="feature-icon">
          <text class="iconfont icon-info"></text>
        </view>
        <text class="feature-name">详细介绍</text>
      </view>
      <view class="feature-card" @click="showNearbySpots">
        <view class="feature-icon">
          <text class="iconfont icon-nearby"></text>
        </view>
        <text class="feature-name">周边景点</text>
      </view>
    </view>
    
    <!-- 音频控制 -->
    <view class="audio-control" v-if="isPlaying && currentSpot">
      <view class="audio-progress">
        <view class="progress-bar">
          <view class="progress-filled" :style="{width: audioProgress + '%'}"></view>
        </view>
        <slider 
          class="progress-slider" 
          :value="audioProgress" 
          @change="seekAudio" 
          min="0" 
          max="100" 
          show-value
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
    
    <!-- 导览内容区域 -->
    <scroll-view class="guide-content" scroll-y enable-flex="true" :scroll-anchoring="true" enhanced="true" show-scrollbar="false" v-if="currentSpot">
      <!-- 内容区域容器 -->
      <view class="content-container">
        <!-- 景点介绍区 -->
        <view class="info-card">
          <view class="info-header">
            <text class="info-title">景点介绍</text>
          </view>
          <view class="info-body">
            <text class="info-text">{{currentSpot.description || '暂无描述'}}</text>
          </view>
        </view>
        
        <!-- 景点图片 -->
        <scroll-view class="photos-scroll" scroll-x enhanced="true" show-scrollbar="false" :scroll-x="true" v-if="currentSpot.photos && currentSpot.photos.length > 0">
          <view class="photos-container">
            <view class="photo-item" v-for="(photo, index) in currentSpot.photos" :key="index" @click="previewImage(index)">
              <image :src="photo" mode="aspectFill" class="spot-photo" @error="photoLoadError(index)"></image>
            </view>
          </view>
        </scroll-view>
        
        <!-- 历史文化区 -->
        <view class="info-card" v-if="currentSpot">
          <view class="info-header">
            <text class="info-title">历史文化</text>
          </view>
          <view class="info-body">
            <text class="info-text">{{currentSpot.history || '暂无历史信息'}}</text>
          </view>
        </view>
        
        <!-- 参观提示区 -->
        <view class="info-card" v-if="currentSpot && currentSpot.tips && currentSpot.tips.length > 0">
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
        <view class="info-card" v-if="currentSpot">
          <view class="info-header">
            <text class="info-title">开放信息</text>
          </view>
          <view class="info-body">
            <view class="info-row">
              <text class="row-label">开放时间：</text>
              <text class="row-value">{{currentSpot.openTime || '暂无开放时间信息'}}</text>
            </view>
            <view class="info-row">
              <text class="row-label">门票信息：</text>
              <text class="row-value">{{currentSpot.ticketInfo || '暂无票价信息'}}</text>
            </view>
            <view class="info-row">
              <text class="row-label">交通路线：</text>
              <text class="row-value">{{currentSpot.transport || '暂无交通信息'}}</text>
            </view>
          </view>
        </view>
        
        <!-- 底部关联景点 -->
        <view class="related-spots" v-if="relatedSpots && relatedSpots.length > 0">
          <view class="related-header">
            <text class="related-title">相关景点</text>
            <text class="view-more">查看更多</text>
          </view>
          <scroll-view class="related-scroll" scroll-x enhanced="true" show-scrollbar="false">
            <view 
              class="related-item" 
              v-for="(item, index) in relatedSpots" 
              :key="index"
              @click="switchSpot(item.id)"
            >
              <image :src="item.image || '/static/images/backgrounds/bg.jpg'" mode="aspectFill" class="related-image" @error="relatedImageError(index)"></image>
              <text class="related-name">{{item.name || '未知景点'}}</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </scroll-view>
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
      statusBarHeight: 80, // 添加状态栏高度默认值
      
      // 当前景点信息 - 添加默认值防止空指针
      currentSpot: {
        id: 1,
        name: '景点',
        tag: '景点',
        longitude: 115.980,
        latitude: 40.360,
        location: '景区',
        openTime: '暂无开放时间信息',
        banner: '/static/images/backgrounds/bg.jpg',
        description: '暂无描述',
        history: '暂无历史信息',
        ticketInfo: '暂无票价信息',
        transport: '暂无交通信息',
        photos: ['/static/images/backgrounds/bg.jpg'],
        tips: ['暂无参观提示'],
        audio: '',
        panoramaId: ''
      },
      
      // 地图标记
      mapMarkers: [],
      
      // 相关景点
      relatedSpots: []
    }
  },
  onLoad(options) {
    // 错误处理
    try {
      console.log('页面加载参数:', options);
      
      // 获取状态栏高度
      this.getStatusBarHeight();
      
      // 初始化音频上下文
      this.initAudioContext();
      
      // 提前初始化地图标记，防止空指针
      this.initMapMarkers();
      
      // 确保currentSpot有默认值
      if (!this.currentSpot) {
        this.currentSpot = {
          id: 1,
          name: '景点',
          tag: '景点',
          longitude: 115.980,
          latitude: 40.360,
          location: '景区',
          openTime: '暂无开放时间信息',
          banner: '/static/images/backgrounds/bg.jpg',
          description: '暂无描述',
          history: '暂无历史信息',
          ticketInfo: '暂无票价信息',
          transport: '暂无交通信息',
          photos: ['/static/images/backgrounds/bg.jpg'],
          tips: ['暂无参观提示'],
          audio: '',
          panoramaId: ''
        };
      }
      
      // 加载景点数据
      if (options && options.id) {
        // 确保options.id是有效的数值
        const id = parseInt(options.id);
        if (!isNaN(id) && id > 0) {
          this.spotId = id;
          this.loadSpotData(this.spotId);
        } else {
          console.warn('无效的景点ID:', options.id);
          this.loadSpotData(1); // 加载默认景点
        }
      } else {
        console.log('未提供景点ID，加载默认景点');
        // 默认加载景点
        this.loadSpotData(1);
      }
    } catch (error) {
      console.error('页面加载错误:', error);
      this.handleError('页面加载失败，请重试');
    }
  },
  methods: {
    goBack() {
      console.log('点击返回按钮');
      try {
        uni.navigateBack({
          success: () => {
            console.log('返回上一页成功');
          },
          fail: (err) => {
            console.error('返回上一页失败:', err);
            // 备用方法 - 如果返回失败，尝试导航到地图页
            uni.switchTab({
              url: '/pages/map/index',
              success: () => {
                console.log('导航到地图页成功');
              },
              fail: (navErr) => {
                console.error('导航到地图页失败:', navErr);
                // 最后的备用方案
                uni.reLaunch({
                  url: '/pages/index/index'
                });
              }
            });
          }
        });
      } catch (error) {
        console.error('返回操作异常:', error);
        // 捕获到异常时，尝试重定向到首页
        uni.reLaunch({
          url: '/pages/index/index'
        });
      }
    },
    
    // 加载景点数据
    loadSpotData(id) {
      try {
        // 增强参数验证
        if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
          console.error('loadSpotData: id参数无效:', id);
          // 显示错误提示
          uni.showToast({
            title: '景点ID无效',
            icon: 'none'
          });
          // 使用默认ID
          id = 1;
          console.log('使用默认景点ID:', id);
        }
        
        // 确保id是数字类型
        id = parseInt(id);
        
        console.log('开始加载景点数据, id:', id);
        // 显示加载中
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        
        // 从数据源中查找景点
        let spot = null;
        
        // 在所有分类中查找该景点
        if (Array.isArray(markersData)) {
          for (const category of markersData) {
            if (category && Array.isArray(category.data)) {
              const found = category.data.find(item => item && item.id === id);
              if (found) {
                spot = found;
                break;
              }
            }
          }
        } else {
          console.error('markersData 不是数组或为空');
        }
        
        if (!spot) {
          uni.hideLoading();
          console.warn('未找到景点数据, id:', id);
          uni.showToast({
            title: '未找到景点数据',
            icon: 'none'
          });
          
          // 保持当前景点不变，或尝试加载默认景点
          if (id !== 1 && !this.currentSpot.id) {
            console.log('尝试加载默认景点');
            setTimeout(() => {
              this.loadSpotData(1);
            }, 1000);
          }
          return;
        }
        
        // 设置当前景点
        this.currentSpot = {
          id: spot.id || 1,
          name: spot.name || '未知景点',
          tag: spot.category || '景点',
          longitude: spot.longitude || 115.980,
          latitude: spot.latitude || 40.360,
          location: spot.location || '景区',
          openTime: spot.open_time || '暂无开放时间信息',
          banner: (spot.images && spot.images.length > 0) ? spot.images[0] : '/static/images/backgrounds/bg.jpg',
          description: spot.desc || '暂无描述',
          history: spot.history || '暂无历史信息',
          ticketInfo: spot.ticket_info || '暂无票价信息',
          transport: spot.transport || '暂无交通信息',
          photos: (spot.images && spot.images.length > 0) ? spot.images : ['/static/images/backgrounds/bg.jpg'],
          tips: spot.tips || ['暂无参观提示'],
          audio: spot.audio || '',
          panoramaId: spot.panorama_id || ''
        };
        
        console.log('景点数据加载成功:', this.currentSpot.name);
        
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
      try {
        if (!this.currentSpot) {
          console.warn('初始化地图标记时currentSpot为空');
          this.mapMarkers = [{
            id: 1,
            longitude: 115.980,
            latitude: 40.360,
            title: "景点",
            iconPath: '/static/images/backgrounds/bg.jpg',
            width: 32,
            height: 40,
            callout: {
              content: "景点",
              display: 'ALWAYS',
              bgColor: "#ffffff",
              color: "#333333",
              borderRadius: 3,
              fontSize: 12,
              padding: 8
            }
          }];
          return;
        }
        
        this.mapMarkers = [
          {
            id: this.currentSpot.id,
            longitude: this.currentSpot.longitude,
            latitude: this.currentSpot.latitude,
            title: this.currentSpot.name,
            iconPath: '/static/images/backgrounds/bg.jpg',
            width: mapConfig.markerStyle ? mapConfig.markerStyle.width : 32,
            height: mapConfig.markerStyle ? mapConfig.markerStyle.height : 40,
            callout: {
              content: this.currentSpot.name,
              display: 'ALWAYS',
              bgColor: "#ffffff",
              color: "#333333",
              borderRadius: 3,
              fontSize: 12,
              padding: 8,
              ...(mapConfig.markerStyle ? mapConfig.markerStyle.calloutStyle : {})
            }
          }
        ];
        console.log('地图标记已初始化:', this.mapMarkers);
      } catch (error) {
        console.error('初始化地图标记错误:', error);
        // 设置默认标记
        this.mapMarkers = [{
          id: 1,
          longitude: 115.980,
          latitude: 40.360,
          title: "景点",
          iconPath: '/static/images/backgrounds/bg.jpg',
          width: 32,
          height: 40,
          callout: {
            content: "景点",
            display: 'ALWAYS',
            bgColor: "#ffffff",
            color: "#333333",
            borderRadius: 3,
            fontSize: 12,
            padding: 8
          }
        }];
      }
    },
    
    // 加载相关景点
    loadRelatedSpots() {
      try {
        this.relatedSpots = [];
        
        if (!this.currentSpot || !this.currentSpot.id) {
          console.warn('加载相关景点时currentSpot为空或id不存在');
          return;
        }
        
        // 找到当前景点所在的分类
        let category = null;
        if (Array.isArray(markersData)) {
          for (const cat of markersData) {
            if (cat && Array.isArray(cat.data) && cat.data.some(item => item && item.id === this.currentSpot.id)) {
              category = cat;
              break;
            }
          }
        }
        
        if (category && Array.isArray(category.data)) {
          // 从同类别中找出4个其他景点
          this.relatedSpots = category.data
            .filter(item => item && item.id !== this.currentSpot.id)
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              name: item.name || '未知景点',
              image: (item.images && item.images.length > 0) ? item.images[0] : '/static/images/backgrounds/bg.jpg'
            }));
          console.log('已加载相关景点:', this.relatedSpots.length);
        } else {
          console.warn('未找到当前景点所在分类或分类中没有其他景点');
        }
      } catch (error) {
        console.error('加载相关景点错误:', error);
      }
    },
    
    // 处理相关景点图片加载错误
    relatedImageError(index) {
      console.warn('相关景点图片加载失败, 索引:', index);
      if (this.relatedSpots && this.relatedSpots[index]) {
        this.$set(this.relatedSpots[index], 'image', '/static/images/backgrounds/bg.jpg');
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
        // 检查currentSpot是否存在
        if (!this.currentSpot) {
          uni.showToast({
            title: '景点数据加载中，请稍后再试',
            icon: 'none'
          });
          return;
        }
        
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
      try {
        if (!this.currentSpot) {
          return;
        }
        
        const value = e.detail.value;
        const time = (value / 100) * this.totalTime;
        // 移除对audioContext.seek的调用，因为我们使用的是模拟方式
        this.currentTime = time;
        this.audioProgress = value;
      } catch (error) {
        console.error('进度条调整错误:', error);
      }
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
      
      // 重置音频播放状态
      if (this.isPlaying) {
        if (this.audioPlayTimer) {
          clearInterval(this.audioPlayTimer);
        }
        this.isPlaying = false;
      }
      this.audioProgress = 0;
      this.currentTime = 0;
      
      // 加载新景点数据
      this.loadSpotData(id);
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
    },
    
    // 处理图片加载错误
    photoLoadError(index) {
      console.warn('图片加载失败, 索引:', index);
      // 替换为默认图片
      if (this.currentSpot && this.currentSpot.photos) {
        this.$set(this.currentSpot.photos, index, '/static/images/backgrounds/bg.jpg');
      }
    },
    
    // 获取状态栏高度
    getStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo);
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        console.log('状态栏高度:', this.statusBarHeight);
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    },
    
    // 显示详细介绍
    showIntroduction() {
      try {
        uni.showToast({
          title: '查看详细介绍',
          icon: 'none'
        });
        // 可以滚动到介绍部分或者创建一个模态框显示详细信息
      } catch (error) {
        console.error('显示介绍错误:', error);
      }
    },
    
    // 显示周边景点
    showNearbySpots() {
      try {
        if (this.relatedSpots && this.relatedSpots.length > 0) {
          uni.showToast({
            title: '查看周边景点',
            icon: 'none'
          });
          // 滚动到底部的相关景点部分
          uni.createSelectorQuery()
            .select('.related-spots')
            .boundingClientRect(rect => {
              if (rect) {
                uni.pageScrollTo({
                  scrollTop: rect.top,
                  duration: 300
                });
              }
            })
            .exec();
        } else {
          uni.showToast({
            title: '暂无周边景点',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('显示周边景点错误:', error);
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
/* 页面变量 */
:root {
  --primary-color: #bc8f56;
  --secondary-color: #f0f0f0;
  --text-color: #333;
  --text-light: #999;
  --border-radius: 12rpx;
}

.guide-container {
  position: relative;
  min-height: 100vh;
  background-color: #f5f5f5;
  
  /* 状态栏背景 */
  .status-bar {
    background-color: #bc8f56;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  
  .guide-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    
    .spot-banner {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }
    
    .header-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.2));
      z-index: 2;
    }
    
    .header-controls {
      position: absolute;
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 20rpx;
      box-sizing: border-box;
      z-index: 3;
      margin-top: 10rpx;
      
      .back-btn {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .iconfont {
          color: #fff;
          font-size: 40rpx;
        }
      }
      
      .action-btn {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .iconfont {
          color: #fff;
          font-size: 36rpx;
        }
      }
    }
    
    .header-info {
      position: absolute;
      bottom: 20rpx;
      left: 20rpx;
      right: 20rpx;
      z-index: 3;
      
      .spot-info {
        margin-bottom: 10rpx;
        
        .spot-name {
          font-size: 40rpx;
          color: #fff;
          font-weight: bold;
          text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
          margin-right: 16rpx;
        }
        
        .spot-tag {
          font-size: 24rpx;
          color: #fff;
          background-color: rgba(188,143,86,0.8);
          padding: 4rpx 10rpx;
          border-radius: 20rpx;
        }
      }
      
      .spot-location {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .location-text {
          font-size: 26rpx;
          color: #fff;
          text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
        }
        
        .location-btn {
          display: flex;
          align-items: center;
          background-color: rgba(255,255,255,0.2);
          padding: 6rpx 16rpx;
          border-radius: 30rpx;
          
          .location-icon {
            font-size: 24rpx;
            color: #fff;
            margin-right: 6rpx;
          }
          
          .location-label {
            font-size: 24rpx;
            color: #fff;
          }
        }
      }
    }
  }
}

.guide-features {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background-color: #fff;
  margin-bottom: 20rpx;
  
  .feature-card {
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
      
      .iconfont {
        font-size: 36rpx;
        color: #666;
      }
    }
    
    .feature-name {
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
  
  .audio-progress {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .progress-bar {
      width: 100%;
      height: 20rpx;
      background-color: #f5f5f5;
      border-radius: 10rpx;
      overflow: hidden;
      
      .progress-filled {
        height: 100%;
        background-color: var(--primary-color);
      }
    }
    
    .progress-slider {
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
  height: 100%;
  box-sizing: border-box;
}

.content-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 30rpx;
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
    height: 100%;
    
    .photo-item {
      width: 280rpx;
      height: 180rpx;
      margin: 0 10rpx;
      border-radius: 12rpx;
      overflow: hidden;
      flex-shrink: 0;
      
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
  margin-bottom: 30rpx;
  border-radius: 16rpx;
  
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
      flex-shrink: 0;
      
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