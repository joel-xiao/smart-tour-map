<template>
  <view class="map-container">
    <!-- 导航栏占位 -->
    <view class="nav-placeholder" :style="{height: statusBarHeight + 44 + 'px'}"></view>
    
    <!-- 地图容器 -->
    <map-container
      ref="mapContainer"
      :markers="markers"
      :route="route"
      :circles="circles"
      :showRoute="showRouteDeck || showRouteDetail"
      @marker-tap="onMarkerTap"
      @map-ready="onMapReady"
    >
      <!-- 侧边菜单 -->
      <view class="sidebar">
        <view class="menu-item" @click="showBoard">
          <image class="icon-image" src="/static/images/icons/board.png"></image>
        </view>
        <category-menu
          :categories="categories"
          :currentCatIndex="currentCatIndex"
          @select="selectCategory"
        />
      </view>
      
      <!-- 定位按钮 -->
      <location-button
        :isLocated="isLocated"
        @locate="locate"
      />
      
      <!-- 手动选择位置按钮 -->
      <view class="location-btn" @click="chooseLocation">
        <image class="icon-image" src="/static/images/icons/location.png"></image>
      </view>
      
      <!-- 路线按钮 -->
      <route-button
        :routes="routes"
        :showRouteDeck="showRouteDeck"
        :showRouteDetail="showRouteDetail"
        @toggle-deck="toggleRoute"
        @select="selectRoute"
        @close-detail="closeRouteDetail"
      />
      
      <!-- 路线详情面板 -->
      <route-detail-panel
        :visible="showRouteDetail"
        :route="currentRoute"
        :points="pointsList"
        :selectedPointIndex="selectedPointIndex"
        @close="closeRouteDetail"
        @select-point="selectPoint"
      />
    </map-container>
  </view>
</template>

<script>
import mapConfig from '@/static/config/mapConfig.js';
import markersData from '@/static/data/markers.js';
import routesData from '@/static/data/routes.js';
import MapService from '@/services/MapService.js';

// 引入组件
import MapContainer from '@/components/map/MapContainer.vue';
import CategoryMenu from '@/components/map/controls/CategoryMenu.vue';
import LocationButton from '@/components/map/controls/LocationButton.vue';
import RouteButton from '@/components/map/controls/RouteButton.vue';
import RouteDetailPanel from '@/components/map/panels/RouteDetailPanel.vue';

// 确保标记点有有效的图标
const ensureValidMarkerIcons = (markers) => {
  return markers.map(marker => {
    if (!marker.iconPath || marker.iconPath.includes('undefined')) {
      return {
        ...marker,
        iconPath: '/static/images/logos/logo.png'
      };
    }
    return marker;
  });
};

export default {
  components: {
    MapContainer,
    CategoryMenu,
    LocationButton,
    RouteButton,
    RouteDetailPanel
  },
  data() {
    return {
      // 地图基本配置
      longitude: mapConfig.initialPosition.longitude,
      latitude: mapConfig.initialPosition.latitude,
      scale: mapConfig.initialPosition.scale,
      
      // 定位状态
      isLocated: false,
      
      // 导航栏高度
      statusBarHeight: 20,
      
      // 导航菜单
      showCats: false,
      currentCatIndex: 0,
      
      // 路线相关
      showRouteDeck: false,
      showRouteDetail: false,
      selectedRouteIndex: -1,
      selectedPointIndex: -1,
      pointsList: [],
      
      // 数据
      categories: [
        { name: '全部', icon: 'attraction', color: '#1aad19' },
        { name: '景点', icon: 'attraction', color: '#bc8f56' },
        { name: '饮食', icon: 'food', color: '#ff6b6b' },
        { name: '住宿', icon: 'hotel', color: '#4080ff' },
        { name: '购物', icon: 'shop', color: '#9c27b0' }
      ],
      
      markers: [],
      allMarkers: [],
      routes: routesData,
      route: [],
      circles: [],
      mapReady: false,
    }
  },
  computed: {
    currentRoute() {
      return this.selectedRouteIndex >= 0 ? this.routes[this.selectedRouteIndex] : {name: '', count: 0};
    },
    // 地图容器组件引用
    mapContainerRef() {
      return this.$refs.mapContainer;
    }
  },
  onLoad() {
    console.log('地图页面加载');
    
    // 初始化地图数据
    this.loadMarkers();
    this.loadRoutes();
    
    // 获取系统信息设置导航栏高度
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
  },
  methods: {
    // 地图准备完成事件
    onMapReady(mapInfo) {
      console.log('地图准备完成');
      this.mapReady = true;
      
      // 更新地图视野
      this.updateMapView();
    },
    
    // 更新地图视野
    updateMapView() {
      if (!this.mapReady || !this.mapContainerRef) return;
      
      setTimeout(() => {
        this.mapContainerRef.includePoints(100);
      }, 500);
    },
    
    // 加载标记点数据
    loadMarkers() {
      try {
        console.log('开始加载标记点数据');
        this.allMarkers = markersData;
        
        // 处理标记点图标
        for (const category of this.allMarkers) {
          for (const marker of category.data) {
            // 根据marker.icon属性选择合适的图标
            switch(marker.icon) {
              case 'attraction':
                marker.iconPath = '/static/images/markers/jd.png';
                break;
              case 'hotel':
                marker.iconPath = '/static/images/markers/jxl.png';
                break;
              case 'food':
                marker.iconPath = '/static/images/markers/shfw.png';
                break;
              case 'entrance':
                marker.iconPath = '/static/images/markers/jt.png';
                break;
              case 'shop':
                marker.iconPath = '/static/images/markers/xsss.png';
                break;
              case 'attraction@1.1':
                marker.iconPath = '/static/images/markers/tycs.png';
                break;
              case 'attraction@1.2':
                marker.iconPath = '/static/images/markers/climb.png';
                break;
              default:
                marker.iconPath = '/static/images/markers/jd.png';
            }
            
            // 设置标记点大小
            marker.width = mapConfig.markerStyle.width;
            marker.height = mapConfig.markerStyle.height;
            
            // 设置标记点气泡
            marker.callout = {
              content: marker.short_name || marker.name,
              ...mapConfig.markerStyle.calloutStyle
            };
          }
        }
        
        // 设置当前分类的标记点
        this.markers = this.allMarkers[this.currentCatIndex].data;
        console.log('标记点数据加载完成');
      } catch (error) {
        console.error('加载标记点数据错误:', error);
        this.handleError('加载标记点失败，请重试');
      }
    },
    
    // 加载路线数据
    loadRoutes() {
      try {
        console.log('开始加载路线数据');
        
        // 为每条路线添加额外信息
        for (let i = 0; i < this.routes.length; i++) {
          const route = this.routes[i];
          
          // 添加ID和shortName如果没有
          if (!route.id) route.id = i;
          if (!route.shortName && route.name) {
            route.shortName = route.name.length > 2 ? route.name.substring(0, 2) : route.name;
          }
          
          // 确保有count属性
          if (!route.count) {
            route.count = route.data.filter(point => point.name || point.id).length;
          }
          
          // 为路线中的点补充完整信息
          for (let j = 0; j < route.data.length; j++) {
            let point = route.data[j];
            
            // 如果只有名称，尝试查找对应的完整标记点
            if (point.name && (!point.latitude || !point.longitude)) {
              const foundPoint = this.findMarkerByName(point.name);
              if (foundPoint) {
                // 合并数据但保留原始属性
                route.data[j] = { ...foundPoint, ...point };
              } else {
                console.warn(`未找到名称为"${point.name}"的标记点`);
              }
            }
            
            // 设置默认图标
            if (!route.data[j].icon) {
              route.data[j].icon = 'attraction';
            }
          }
        }
        
        console.log('路线数据加载完成');
      } catch (error) {
        console.error('加载路线数据错误:', error);
        this.handleError('加载路线失败，请重试');
      }
    },
    
    // 根据名称查找标记点
    findMarkerByName(name) {
      // 在所有类别中查找
      for (const category of this.allMarkers) {
        for (const marker of category.data) {
          if (marker.name === name || marker.short_name === name) {
            return marker;
          }
        }
      }
      return null;
    },
    
    // 显示公告板
    showBoard() {
      uni.showToast({
        title: '公告板功能开发中',
        icon: 'none'
      });
    },
    
    // 选择分类
    selectCategory(index) {
      this.currentCatIndex = index;
      this.markers = this.allMarkers[index].data;
      this.updateMapView();
    },
    
    // 切换路线面板
    toggleRoute() {
      // 如果当前显示路线详情，则关闭路线详情
      if (this.showRouteDetail) {
        this.closeRouteDetail();
        return;
      }
      
      // 切换路线选择面板
      this.showRouteDeck = !this.showRouteDeck;
      
      // 如果关闭路线选择，恢复到默认视图
      if (!this.showRouteDeck) {
        this.markers = this.allMarkers[this.currentCatIndex].data;
        this.route = [];
        this.circles = [];
        this.updateMapView();
      }
    },
    
    // 选择路线
    selectRoute(index) {
      this.selectedRouteIndex = index;
      this.showRouteDeck = false;
      this.showRouteDetail = true;
      this.pointsList = this.routes[index].data;
      
      // 更新地图中的路线标记点
      this.markers = this.routes[index].data.map(point => {
        // 确保标记点有正确的图标
        let iconPath = '/static/images/markers/jd.png';
        
        // 根据point.icon属性选择合适的图标
        switch(point.icon) {
          case 'attraction':
            iconPath = '/static/images/markers/jd.png';
            break;
          case 'hotel':
            iconPath = '/static/images/markers/jxl.png';
            break;
          case 'food':
            iconPath = '/static/images/markers/shfw.png';
            break;
          case 'entrance':
            iconPath = '/static/images/markers/jt.png';
            break;
          case 'shop':
            iconPath = '/static/images/markers/xsss.png';
            break;
          case 'attraction@1.1':
            iconPath = '/static/images/markers/tycs.png';
            break;
          case 'attraction@1.2':
            iconPath = '/static/images/markers/climb.png';
            break;
          default:
            iconPath = '/static/images/markers/jd.png';
        }
        
        return {
          ...point,
          iconPath: iconPath,
          width: mapConfig.markerStyle.width,
          height: mapConfig.markerStyle.height,
          callout: {
            content: point.short_name || point.name,
            ...mapConfig.markerStyle.calloutStyle
          }
        };
      });
      
      // 设置路线
      this.route = [{
        points: this.pointsList.map(point => ({
          longitude: point.longitude,
          latitude: point.latitude
        })),
        color: mapConfig.markerStyle.polylineStyle.color,
        width: mapConfig.markerStyle.polylineStyle.width,
        borderColor: mapConfig.markerStyle.polylineStyle.borderColor,
        borderWidth: mapConfig.markerStyle.polylineStyle.borderWidth,
        arrowLine: mapConfig.markerStyle.polylineStyle.arrowLine,
        dottedLine: mapConfig.markerStyle.polylineStyle.dottedLine
      }];
      
      // 添加圆形区域
      this.circles = [];
      if (this.routes[index].circles) {
        this.circles = this.processCircles(this.routes[index].circles);
      }
      
      // 默认选中第一个点
      if (this.pointsList.length > 0) {
        this.selectPoint(0);
      } else {
        this.updateMapView();
      }
    },
    
    // 选择路线上的点
    selectPoint(index) {
      this.selectedPointIndex = index;
      
      // 移动到这个点
      const point = this.pointsList[index];
      
      if (this.mapContainerRef) {
        this.mapContainerRef.moveToLocation(point.longitude, point.latitude, 18);
      }
    },
    
    // 关闭路线详情
    closeRouteDetail() {
      this.showRouteDetail = false;
      this.selectedPointIndex = -1;
      this.selectedRouteIndex = -1;
      
      // 恢复到分类显示
      this.markers = this.allMarkers[this.currentCatIndex].data;
      this.route = [];
      this.circles = [];
      
      this.updateMapView();
    },
    
    // 标记点点击处理
    onMarkerTap(markerId) {
      const marker = this.findMarkerById(markerId);
      
      if (marker) {
        if (marker.category === 'guide') {
          uni.navigateTo({
            url: `/pages/attraction/guide?id=${marker.id}`
          });
          return;
        }
        
        // 其他类型标记处理
        uni.showToast({
          title: marker.name,
          icon: 'none'
        });
      }
    },
    
    // 根据ID查找标记点
    findMarkerById(id) {
      // 先在当前显示的标记点中查找
      let marker = this.markers.find(item => item.id === id);
      if (marker) return marker;
      
      // 在所有标记点中查找
      for (const category of this.allMarkers) {
        marker = category.data.find(item => item.id === id);
        if (marker) return marker;
      }
      
      return null;
    },
    
    // 错误处理方法
    handleError(message) {
      uni.showToast({
        title: message || '操作失败，请重试',
        icon: 'none',
        duration: 2000
      });
      
      // 如果是网络错误，可以尝试重新加载数据
      setTimeout(() => {
        this.reloadData();
      }, 3000);
    },
    
    // 重新加载数据
    reloadData() {
      uni.showLoading({
        title: '正在重新加载...'
      });
      
      try {
        this.loadMarkers();
        this.loadRoutes();
        
        setTimeout(() => {
          this.updateMapView();
          uni.hideLoading();
        }, 1000);
      } catch (error) {
        uni.hideLoading();
        console.error('重新加载数据失败:', error);
        uni.showToast({
          title: '加载失败，请检查网络后重试',
          icon: 'none'
        });
      }
    },
    
    // 处理圆形区域
    processCircles(circles) {
      if (!circles || !Array.isArray(circles)) return [];
      
      return circles.map(circle => {
        // 确保经纬度格式正确
        let latitude = parseFloat(circle.latitude);
        let longitude = parseFloat(circle.longitude);
        
        // 如果经纬度不是数字，则使用默认值
        if (isNaN(latitude) || isNaN(longitude)) {
          console.error('圆形区域经纬度无效:', circle);
          latitude = mapConfig.initialPosition.latitude;
          longitude = mapConfig.initialPosition.longitude;
        }
        
        return {
          latitude,
          longitude,
          radius: circle.radius || 500,
          color: mapConfig.markerStyle.circleStyle.color,
          fillColor: mapConfig.markerStyle.circleStyle.fillColor,
          strokeWidth: mapConfig.markerStyle.circleStyle.strokeWidth
        };
      });
    },
    
    // 定位
    locate() {
      // 显示加载提示
      uni.showLoading({
        title: '正在获取位置...'
      });
      
      // 获取当前位置
      MapService.getCurrentLocation()
        .then(res => {
          // 更新位置
          this.longitude = res.longitude;
          this.latitude = res.latitude;
          this.isLocated = true; // 标记已成功定位
          
          // 2秒后重置状态，用于视觉反馈
          setTimeout(() => {
            this.isLocated = false;
          }, 2000);
          
          // 移动地图到当前位置
          if (this.mapContainerRef) {
            this.mapContainerRef.moveToLocation(res.longitude, res.latitude, 16);
          }
          
          uni.hideLoading();
          uni.showToast({
            title: '定位成功',
            icon: 'success',
            duration: 1500
          });
        })
        .catch(err => {
          console.error('定位失败:', err);
          uni.hideLoading();
          
          // 获取错误信息
          let errorMsg = '获取位置失败';
          
          if (typeof err === 'object' && err.errMsg) {
            if (err.errMsg.indexOf('auth') > -1) {
              errorMsg = '位置权限被拒绝，请在设置中开启';
            } else if (err.errMsg.indexOf('timeout') > -1) {
              errorMsg = '获取位置超时，请检查网络';
            }
          }
          
          uni.showModal({
            title: '提示',
            content: errorMsg,
            showCancel: false
          });
          
          // 使用默认位置
          this.useDefaultLocation();
        });
    },
    
    // 使用默认位置
    useDefaultLocation() {
      const defaultLoc = mapConfig.initialPosition;
      this.longitude = defaultLoc.longitude;
      this.latitude = defaultLoc.latitude;
      
      // 移动到默认位置
      if (this.mapContainerRef) {
        this.mapContainerRef.moveToLocation(defaultLoc.longitude, defaultLoc.latitude, defaultLoc.scale);
      }
    },
    
    // 手动选择位置
    chooseLocation() {
      MapService.chooseLocation()
        .then(res => {
          console.log('手动选择位置成功:', res);
          // 更新位置
          this.longitude = res.longitude;
          this.latitude = res.latitude;
          
          // 移动到选择的位置
          if (this.mapContainerRef) {
            this.mapContainerRef.moveToLocation(res.longitude, res.latitude, 16);
          }
          
          uni.showToast({
            title: '位置已更新',
            icon: 'success',
            duration: 1500
          });
        })
        .catch(err => {
          // 用户取消选择不提示
          if (err && err.errMsg && err.errMsg.indexOf('cancel') > -1) {
            return;
          }
          
          uni.showToast({
            title: '选择位置失败',
            icon: 'none'
          });
        });
    }
  }
}
</script>

<style>
.map-container {
  width: 750rpx;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 导航栏占位 */
.nav-placeholder {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 50;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

/* 侧边菜单 */
.sidebar {
  position: fixed;
  top: 100rpx;
  right: 20rpx;
  z-index: 10;
}

.menu-item {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  position: relative;
}

.menu-item .icon-image {
  width: 36rpx;
  height: 36rpx;
}

/* 手动选择位置按钮 */
.location-btn {
  position: fixed;
  left: 20rpx;
  bottom: 100rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 10;
}

.location-btn .icon-image {
  width: 40rpx;
  height: 40rpx;
}

/* 强制隐藏各种地图平台的缩放控件 */
.amap-zoom, .amap-zoom-touch-container, .amap-controls, 
.tdt-control-zoom, .tmap-control-zoom, [class*="zoom-control"], [class*="zoomControl"],
.BMap_zoom, .BMap_stdMpCtrl, .BMap_cpyCtrl, .anchorBL, div[data-agl-cvt], div[data-tooltip],
.gmnoprint, div[title="放大"], div[title="缩小"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
</style> 