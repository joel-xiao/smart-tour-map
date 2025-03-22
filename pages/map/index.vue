<template>
  <view class="root-container">
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
        <!-- 右上角控制按钮 -->
        <view class="top-right-controls" :style="{top: (statusBarHeight + 70) + 'px'}">
          <view class="control-btn board-btn" @click="showBoard">
            <image class="icon-image" src="/static/images/common/board.png"></image>
          </view>
          <view class="control-btn category-btn" @click="toggleCategoryMenu">
            <image class="icon-image" src="/static/images/common/navigate.png"></image>
          </view>
        </view>
        
        <!-- 侧边菜单 -->
        <view class="sidebar" :style="{top: (statusBarHeight + 64) + 'px'}" v-if="false">
          <view class="menu-item" @click="showBoard">
            <image class="icon-image" src="/static/images/common/board.png"></image>
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
          @longpress="chooseLocation"
        />
        
        <!-- 右侧分类菜单 -->
        <view class="category-side-menu" :class="{hide: !showCategoryMenu}" :style="{top: (statusBarHeight + 240) + 'px'}">
          <view 
            v-for="(category, index) in categories" 
            :key="index"
            class="category-side-item" 
            :class="{active: currentCatIndex === index}" 
            @click="selectCategory(index)"
          >
            <image 
              class="category-icon" 
              :src="getCategoryIcon(index)"
            ></image>
            <text>{{category}}</text>
          </view>
        </view>
      </map-container>
    </view>
    
    <!-- 游按钮 - 完全独立于地图容器 -->
    <route-button
      :routes="routes"
      :showRouteDeck="showRouteDeck"
      :showRouteDetail="showRouteDetail"
      :selectedRouteIndex="selectedRouteIndex"
      @toggle-deck="toggleRoute"
      @select="selectRoute"
      @close-detail="closeRouteDetail"
    />
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

// 确保标记点有有效的图标
const ensureValidMarkerIcons = (markers) => {
  return markers.map(marker => {
    if (!marker.iconPath || marker.iconPath.includes('undefined')) {
      return {
        ...marker,
        iconPath: '/static/images/common/location.png'
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
  },
  data() {
    return {
      // 地图基本配置
      longitude: mapConfig.initialPosition.longitude,
      latitude: mapConfig.initialPosition.latitude,
      scale: mapConfig.initialPosition.scale,
      
      // 定位状态
      isLocated: false,
      hasShownTip: false, // 是否已显示提示
      
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
      categories: [],
      
      markers: [],
      allMarkers: [],
      routes: routesData,
      route: [],
      circles: [],
      mapReady: false,
      showCategoryMenu: true,
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
    
    // 默认选中"全部"分类
    this.currentCatIndex = 0;
    
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
      
      console.log('更新地图视野，当前分类:', this.categories[this.currentCatIndex]);
      console.log('当前标记点数量:', this.markers.length);
      
      // 延迟执行，确保数据已更新
      setTimeout(() => {
        // 先移除所有标记点再重新添加，确保视图刷新
        if (this.mapContainerRef.mapContext) {
          this.mapContainerRef.updateMapMarkers();
        }
        
        // 调整地图视野以包含所有标记点
        this.mapContainerRef.includePoints(100);
      }, 500);
    },
    
    // 加载标记点数据
    loadMarkers() {
      try {
        console.log('开始加载标记点数据');
        this.allMarkers = markersData;
        
        // 更新分类数组，使用数据源中的分类
        this.categories = this.allMarkers.map(category => category.name);
        console.log('更新分类数组:', this.categories);
        
        // 处理标记点图标
        for (const category of this.allMarkers) {
          console.log(`处理分类: ${category.name}, 图标类型: ${category.icon}`);
          for (const marker of category.data) {
            // 根据marker.icon属性选择合适的图标
            switch(marker.icon) {
              case 'attraction':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'hotel':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'food':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'entrance':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'shop':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'attraction@1.1':
                marker.iconPath = '/static/images/common/location.png';
                break;
              case 'attraction@1.2':
                marker.iconPath = '/static/images/common/location.png';
                break;
              default:
                marker.iconPath = '/static/images/common/location.png';
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
        console.log(`初始加载分类[${this.currentCatIndex}]: ${this.categories[this.currentCatIndex]}, 标记点数量: ${this.markers.length}`);
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
      uni.showModal({
        title: '校园公告',
        content: '欢迎使用校园地图导览系统！\n\n1. 点击右侧分类菜单可筛选不同类型的地点\n2. 点击地图上的标记点可查看详细信息\n3. 点击底部"游"按钮可查看推荐路线\n4. 左下角按钮可定位到当前位置',
        showCancel: false,
        confirmText: '我知道了'
      });
    },
    
    // 选择分类
    selectCategory(index) {
      console.log(`正在切换到分类: ${this.categories[index]}`);
      
      // 检查分类索引是否有效
      if (index < 0 || index >= this.allMarkers.length) {
        console.error(`无效的分类索引: ${index}, 分类总数: ${this.allMarkers.length}`);
        uni.showToast({
          title: '该分类暂无数据',
          icon: 'none'
        });
        return;
      }
      
      // 如果已经是当前分类，不做任何操作
      if (this.currentCatIndex === index) {
        console.log(`已经是当前分类: ${this.categories[index]}`);
        return;
      }
      
      // 更新状态
      this.currentCatIndex = index;
      
      // 检查是否该分类有数据
      if (!this.allMarkers[index] || !this.allMarkers[index].data || this.allMarkers[index].data.length === 0) {
        console.error(`分类 ${this.categories[index]} 没有标记点数据`);
        this.markers = [];
        uni.showToast({
          title: '该分类暂无标记点',
          icon: 'none'
        });
        return;
      }
      
      // 更新标记点数据
      this.markers = this.allMarkers[index].data;
      
      // 确保markers数据被正确更新并通知地图组件
      this.$nextTick(() => {
        console.log(`切换到分类: ${this.categories[index]}, 分类图标: ${this.allMarkers[index].icon}, 标记点数量: ${this.markers.length}`);
        if (this.mapContainerRef) {
          this.mapContainerRef.updateMapMarkers();
          this.updateMapView();
        }
      });
      
      // 显示提示
      uni.showToast({
        title: `已选择${this.categories[index]}类别`,
        icon: 'none'
      });
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
        let iconPath = '/static/images/common/location.png';
        
        // 根据point.icon属性选择合适的图标
        switch(point.icon) {
          case 'attraction':
            iconPath = '/static/images/common/location.png';
            break;
          case 'hotel':
            iconPath = '/static/images/common/location.png';
            break;
          case 'food':
            iconPath = '/static/images/common/location.png';
            break;
          case 'entrance':
            iconPath = '/static/images/common/location.png';
            break;
          case 'shop':
            iconPath = '/static/images/common/location.png';
            break;
          case 'attraction@1.1':
            iconPath = '/static/images/common/location.png';
            break;
          case 'attraction@1.2':
            iconPath = '/static/images/common/location.png';
            break;
          default:
            iconPath = '/static/images/common/location.png';
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
      // 第一次点击时显示操作提示
      if (!this.hasShownTip) {
        this.hasShownTip = true;
        uni.showToast({
          title: '点击：获取当前位置\n长按：手动选择位置',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 显示加载提示
      uni.showLoading({
        title: '正在获取位置...'
      });
      
      // #ifdef MP-WEIXIN
      // 特殊处理：检测是否为开发工具的游客模式
      const systemInfo = uni.getSystemInfoSync();
      const isDevTools = systemInfo.platform === 'devtools';
      
      // 在开发者工具中，可能处于游客模式，无法正常获取位置
      if (isDevTools) {
        console.log('开发者工具环境，可能无法正常获取位置');
        // 开发工具环境下，直接显示提示并使用默认位置
        uni.showModal({
          title: '提示',
          content: '开发者工具中可能无法获取真实位置，已切换到默认位置',
          showCancel: false,
          success: () => {
            // 使用默认位置
            this.useDefaultLocation();
            uni.hideLoading();
          }
        });
        return;
      }
      // #endif
      
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
            errorMsg = err.errMsg;
          }
          
          uni.showModal({
            title: '定位失败',
            content: errorMsg + '，已切换到默认位置',
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
        
        // 提供视觉反馈
        this.isLocated = true;
        setTimeout(() => {
          this.isLocated = false;
        }, 2000);
        
        // 更新地图视野
        setTimeout(() => {
          this.updateMapView();
        }, 500);
      }
      
      // 显示提示
      uni.showToast({
        title: '已切换到默认位置',
        icon: 'success',
        duration: 1500
      });
    },
    
    // 手动选择位置
    chooseLocation() {
      // 显示操作提示
      uni.showToast({
        title: '请选择位置...',
        icon: 'none',
        duration: 1000
      });
      
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
    },
    
    // 显示提示
    showToast(message) {
      uni.showToast({
        title: `${message}功能开发中`,
        icon: 'none',
        duration: 2000
      });
    },
    
    // 切换分类菜单
    toggleCategoryMenu() {
      this.showCategoryMenu = !this.showCategoryMenu;
    },
    
    // 获取分类图标
    getCategoryIcon(index) {
      // 如果有 allMarkers 中对应索引的分类信息，则使用其图标
      if (this.allMarkers && this.allMarkers.length > index && this.allMarkers[index]) {
        const category = this.allMarkers[index];
        console.log(`获取分类 ${index} 图标, 名称: ${category.name}, 图标: ${category.icon}`);
        
        // 根据分类的 icon 属性返回对应图标
        switch(category.icon) {
          case 'all':
            return '/static/images/common/location.png';
          case 'attraction':
            return '/static/images/common/location.png';
          case 'hotel':
            return '/static/images/common/location.png';
          case 'food':
            return '/static/images/common/location.png';
          case 'entrance':
            return '/static/images/common/location.png';
          case 'shop':
            return '/static/images/common/location.png';
          default:
            return '/static/images/common/location.png';
        }
      }
      
      // 默认图标映射
      switch(index) {
        case 0: return '/static/images/common/location.png'; // 全部
        case 1: return '/static/images/common/location.png'; // 景点
        case 2: return '/static/images/common/location.png'; // 住宿
        case 3: return '/static/images/common/location.png'; // 餐饮
        case 4: return '/static/images/common/location.png'; // 交通
        case 5: return '/static/images/common/location.png'; // 购物
        case 6: return '/static/images/common/location.png'; // 体育场馆
        case 7: return '/static/images/common/location.png'; // 其他
        default: return '/static/images/common/location.png';
      }
    },
  }
}
</script>

<style>
/* 根容器 */
.root-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* 地图容器 */
.map-container {
  width: 750rpx;
  height: 100vh;
  position: relative;
}

/* 导航栏占位 */
.nav-placeholder {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  position: relative;
  z-index: 50;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

/* H5特定样式，解决导航栏遮挡问题 */
/* #ifdef H5 */
.map-container {
  padding-bottom: 100rpx;
}
/* #endif */

/* 侧边菜单 */
.sidebar {
  position: fixed;
  right: 20rpx;
  z-index: 100;
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

/* 修复微信小程序下的样式问题 */
page {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

/* 右侧分类菜单 */
.category-side-menu {
  position: fixed;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10rpx 0 0 10rpx;
  box-shadow: -2rpx 0 10rpx rgba(0,0,0,0.2);
  z-index: 900;
  padding: 15rpx 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: all 0.3s ease;
  max-height: 70vh;
  width: 100rpx;
}

/* 隐藏滚动条 */
.category-side-menu::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

.category-side-menu.hide {
  transform: translateX(100%);
}

.category-side-item {
  padding: 16rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  text-align: center;
  border-bottom: 1rpx solid #eee;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-side-item .category-icon {
  width: 40rpx;
  height: 40rpx;
  margin-bottom: 5rpx;
}

.category-side-item text {
  font-size: 24rpx;
}

.category-side-item:last-child {
  border-bottom: none;
}

.category-side-item.active {
  background-color: #5CACEE;
  color: #FFFFFF;
  font-weight: bold;
}

.category-side-item.active .category-icon {
  filter: brightness(5);
}

/* 右上角控制按钮 */
.top-right-controls {
  position: fixed;
  right: 20rpx;
  z-index: 950;
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
  /* #ifdef MP-WEIXIN */
  padding-top: 10rpx;
  /* #endif */
}

.control-btn {
  width: 100rpx;
  height: 100rpx;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0,0,0,0.15);
  position: relative;
  transition: all 0.2s ease;
}

.board-btn {
  margin-bottom: 60rpx;
}

.category-btn {
  margin-top: 10rpx;
}

.control-btn:active {
  transform: scale(0.9);
  background-color: #f5f5f5;
}

.control-btn .icon-image {
  width: 50rpx;
  height: 50rpx;
}

/* 统一设置地图上控件的z-index，确保它们在地图上方 */
.location-button,
.route-button,
.top-right-controls,
.category-side-menu {
  z-index: 999 !important;
}
</style> 