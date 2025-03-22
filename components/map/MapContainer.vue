<template>
  <view class="map-container">
    <!-- 微信小程序地图组件 -->
    <!-- #ifdef MP-WEIXIN -->
    <map
      id="map"
      class="map"
      :longitude="longitude"
      :latitude="latitude"
      :scale="scale"
      :markers="markers"
      :polyline="showRoute ? route : []"
      :circles="showRoute ? circles : []"
      :show-location="true"
      :enable-rotate="true" 
      :enable-3D="true"
      :enable-overlooking="true"
      :show-compass="false"
      :show-scale-control="false"
      :enable-zoom="true"
      @markertap="onMarkerTap"
    ></map>
    <!-- #endif -->
    
    <!-- H5环境下的地图容器 -->
    <!-- #ifdef H5 -->
    <div id="h5-map" class="map"></div>
    <!-- #endif -->
    
    <!-- 子组件插槽 -->
    <slot></slot>
  </view>
</template>

<script>
import MapService from '../../services/MapService.js';
import MapLoader from './libs/MapLoader.js';
import mapConfig from '../../static/config/mapConfig.js';

export default {
  name: 'MapContainer',
  props: {
    // 初始位置
    initialLongitude: {
      type: Number,
      default: () => mapConfig.initialPosition.longitude
    },
    initialLatitude: {
      type: Number,
      default: () => mapConfig.initialPosition.latitude
    },
    initialScale: {
      type: Number,
      default: () => mapConfig.initialPosition.scale
    },
    // 标记点
    markers: {
      type: Array,
      default: () => []
    },
    // 路线
    route: {
      type: Array,
      default: () => []
    },
    // 圆形区域
    circles: {
      type: Array,
      default: () => []
    },
    // 是否显示路线
    showRoute: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      longitude: this.initialLongitude,
      latitude: this.initialLatitude,
      scale: this.initialScale,
      mapContext: null,
      h5Map: null,
      mapReady: false
    }
  },
  mounted() {
    this.initMap();
  },
  watch: {
    markers: {
      handler(newMarkers, oldMarkers) {
        console.log('markers发生变化，新标记点数量:', newMarkers.length);
        // 延迟更新，确保数据变化已经完成
        this.$nextTick(() => {
          // 如果标记点数组长度发生变化或内容发生变化，则更新地图标记
          if (JSON.stringify(newMarkers) !== JSON.stringify(oldMarkers)) {
            // #ifdef MP-WEIXIN
            // 微信小程序环境下，标记点更新可能不会立即生效，手动更新
            if (this.mapContext) {
              console.log('更新微信小程序地图标记点');
              this.updateMapMarkers();
            }
            // #endif
            
            // #ifdef H5
            console.log('H5环境：更新地图标记点');
            this.updateH5MapMarkers();
            // #endif
          }
        });
      },
      deep: true
    },
    // 监听路线变化
    route: {
      handler(newRoute) {
        // #ifdef H5
        if (this.h5Map && this.showRoute && newRoute.length > 0) {
          console.log('H5环境：路线数据变化，更新路线');
          this.updateH5MapRoute();
        }
        // #endif
      },
      deep: true
    }
  },
  methods: {
    // 初始化地图
    initMap() {
      // 延迟执行，确保DOM已渲染
      setTimeout(() => {
        try {
          // #ifdef MP-WEIXIN
          // 创建小程序地图上下文
          this.mapContext = uni.createMapContext('map', this);
          if (this.mapContext) {
            MapService.setMapContext(this.mapContext);
            
            // 设置地图准备状态并发送事件
            this.mapReady = true;
            this.$emit('map-ready', {
              mapContext: this.mapContext,
              h5Map: null
            });
            
            // 更新视野
            this.includePoints();
          } else {
            console.error('无法创建地图上下文');
          }
          // #endif
          
          // #ifdef H5
          // 加载H5环境下的地图
          this.loadH5Map();
          // #endif
        } catch (error) {
          console.error('初始化地图错误:', error);
        }
      }, 300);
    },
    
    // 加载H5环境下的地图
    loadH5Map() {
      // #ifdef H5
      try {
        // 注入CSS隐藏地图控件
        MapLoader.injectAntiZoomCSS();
        
        // 加载地图脚本
        MapLoader.loadH5MapScript()
          .then(mapInstance => {
            this.initH5MapInstance(mapInstance);
            
            // 初始化完成后触发地图准备事件
            if (this.mapReady) {
              this.$emit('map-ready', {
                mapContext: null,
                h5Map: this.h5Map
              });
            }
          })
          .catch(error => {
            console.error('加载地图失败:', error);
            uni.showToast({
              title: '地图加载失败，请检查网络',
              icon: 'none'
            });
          });
      } catch (error) {
        console.error('加载H5地图初始化失败:', error);
        uni.showToast({
          title: '地图初始化失败',
          icon: 'none'
        });
      }
      // #endif
    },
    
    // 初始化H5地图实例
    initH5MapInstance(mapInstance) {
      // #ifdef H5
      try {
        if (typeof TMap !== 'undefined') {
          // 腾讯地图WebGL
          this.h5Map = new TMap.Map('h5-map', {
            center: new TMap.LatLng(this.latitude, this.longitude),
            zoom: this.scale,
            viewMode: '2D',
            zoomControl: false,
            pitchControl: false,
            rotationControl: false,
            scaleControl: false,
            doubleClickZoom: true,
            scrollwheel: true,
            mapStyleId: 'style1',
            showControl: false,
            baseMap: {
              type: 'vector',
              features: ['base', 'building3d']
            }
          });
          
          // 设置地图服务实例
          MapService.setH5Map(this.h5Map);
          
          // 更新标记点
          this.updateH5MapMarkers();
          
          // 更新路线
          if (this.showRoute && this.route.length > 0) {
            this.updateH5MapRoute();
          }
          
          // 移除默认控件
          setTimeout(() => {
            MapLoader.removeDefaultLocationControls();
          }, 500);
          
          // 设置地图准备状态
          this.mapReady = true;
        } else if (typeof AMap !== 'undefined') {
          // 高德地图
          this.h5Map = new AMap.Map('h5-map', {
            zoom: this.scale,
            center: [this.longitude, this.latitude],
            viewMode: '3D',
            resizeEnable: true,
            zoomEnable: true,
            dragEnable: true,
            keyboardEnable: false,
            doubleClickZoom: true,
            scrollWheel: true,
            showIndoorMap: false,
            zooms: [3, 20],
            isHotspot: false,
            rotateEnable: true,
            controlBar: false,
            mapStyle: 'amap://styles/normal',
            showBuildingBlock: true,
            touchZoom: true,
            zoomToAccuracy: true
          });
          
          // 移除所有控件
          this.h5Map.clearControl();
          
          // 设置地图服务实例
          MapService.setH5Map(this.h5Map);
          
          // 更新标记点
          this.updateH5MapMarkers();
          
          // 更新路线
          if (this.showRoute && this.route.length > 0) {
            this.updateH5MapRoute();
          }
          
          // 设置地图准备状态
          this.mapReady = true;
        }
      } catch (error) {
        console.error('初始化H5地图失败:', error);
        uni.showToast({
          title: '地图加载失败，请重试',
          icon: 'none'
        });
      }
      // #endif
    },
    
    // 更新H5地图标记点
    updateH5MapMarkers() {
      // #ifdef H5
      if (!this.h5Map) return;
      
      if (typeof TMap !== 'undefined') {
        // 腾讯地图WebGL标记点更新
        this.updateTMapMarkers();
      } else if (typeof AMap !== 'undefined') {
        // 高德地图标记点更新
        this.updateAMapMarkers();
      }
      // #endif
    },
    
    // 更新腾讯地图WebGL标记点
    updateTMapMarkers() {
      // #ifdef H5
      if (!this.h5Map || typeof TMap === 'undefined') return;
      
      try {
        // 清除现有标记
        if (this.markerLayer) {
          this.markerLayer.setMap(null);
          this.markerLayer = null;
        }
        
        if (this.labelLayer) {
          this.labelLayer.setMap(null);
          this.labelLayer = null;
        }
        
        // 添加新标记点
        if (this.markers && this.markers.length > 0) {
          console.log('腾讯地图WebGL：添加标记点，数量:', this.markers.length);
          
          // 创建标记点数据
          const markerStyles = {};
          const markerData = [];
          
          this.markers.forEach((point, index) => {
            // 为每个点定义样式ID
            const styleId = `style_${index}`;
            
            // 设置标记样式
            markerStyles[styleId] = new TMap.MarkerStyle({
              width: point.width || mapConfig.markerStyle.width,
              height: point.height || mapConfig.markerStyle.height,
              anchor: { x: 16, y: 32 },
              src: point.iconPath || '/static/images/markers/jd.png'
            });
            
            // 添加标记数据
            markerData.push({
              id: point.id || `marker_${index}`,
              styleId: styleId,
              position: new TMap.LatLng(point.latitude, point.longitude),
              properties: {
                title: point.name,
                index: index,
                data: point
              }
            });
          });
          
          // 创建标记图层
          this.markerLayer = new TMap.MultiMarker({
            map: this.h5Map,
            styles: markerStyles,
            geometries: markerData
          });
          
          // 添加点击事件
          this.markerLayer.on('click', (evt) => {
            const markerId = evt.geometry.id;
            const index = evt.geometry.properties.index;
            console.log('标记点点击:', markerId, index);
            this.$emit('marker-tap', markerId);
            
            // 可以在这里添加信息窗体显示
            const point = this.markers[index];
            if (point) {
              const infoWindow = new TMap.InfoWindow({
                content: `<div style="padding:10px;"><h3>${point.name}</h3><p>${point.desc || ''}</p></div>`,
                position: evt.geometry.position,
                offset: { x: 0, y: -32 }
              });
              infoWindow.open();
            }
          });
          
          // 创建标签数据
          const labelStyles = {
            label: new TMap.LabelStyle({
              color: '#333333',
              size: 12,
              offset: { x: 0, y: -35 },
              angle: 0,
              alignment: 'center',
              backgroundColor: '#FFFFFF',
              padding: { top: 3, right: 6, bottom: 3, left: 6 },
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 3
            })
          };
          
          const labelData = this.markers.map((point, index) => {
            return {
              id: `label_${index}`,
              styleId: 'label',
              position: new TMap.LatLng(point.latitude, point.longitude),
              content: point.short_name || point.name,
              properties: {
                description: point.desc || ''
              }
            };
          });
          
          // 创建标签图层
          this.labelLayer = new TMap.MultiLabel({
            map: this.h5Map,
            styles: labelStyles,
            geometries: labelData
          });
          
          // 调整视野包含所有点
          setTimeout(() => {
            this.includePoints();
          }, 100);
        } else {
          console.log('腾讯地图WebGL：没有标记点需要添加');
        }
      } catch (error) {
        console.error('更新腾讯地图WebGL标记点失败:', error);
      }
      // #endif
    },
    
    // 更新高德地图标记点
    updateAMapMarkers() {
      // #ifdef H5
      if (!this.h5Map || typeof AMap === 'undefined') return;
      
      try {
        // 获取当前地图上的所有覆盖物
        const allOverlays = this.h5Map.getAllOverlays();
        const nonMarkerOverlays = [];
        
        // 筛选出非标记点的覆盖物，如路线等
        if (allOverlays && allOverlays.length > 0) {
          allOverlays.forEach(overlay => {
            if (overlay.CLASS_NAME && !overlay.CLASS_NAME.includes('Marker')) {
              nonMarkerOverlays.push(overlay);
            }
          });
        }
        
        // 清除所有覆盖物
        this.h5Map.clearMap();
        
        // 恢复非标记点覆盖物
        if (nonMarkerOverlays.length > 0) {
          this.h5Map.add(nonMarkerOverlays);
        }
        
        // 添加新标记点
        if (this.markers && this.markers.length > 0) {
          console.log('高德地图：添加标记点，数量:', this.markers.length);
          const markers = [];
          
          this.markers.forEach((point, index) => {
            // 创建标记点
            const marker = new AMap.Marker({
              position: [point.longitude, point.latitude],
              title: point.name,
              extData: { id: point.id || index, data: point },
              icon: new AMap.Icon({
                size: new AMap.Size(40, 40),
                image: point.iconPath || '/static/images/markers/jd.png',
                imageSize: new AMap.Size(40, 40)
              })
            });
            
            // 添加信息窗体
            marker.content = `<div style="padding:10px;"><h3>${point.name}</h3><p>${point.desc || ''}</p></div>`;
            marker.on('click', () => {
              // 触发标记点点击事件
              this.$emit('marker-tap', point.id || index);
              
              // 显示信息窗体
              const infoWindow = new AMap.InfoWindow({
                content: marker.content,
                offset: new AMap.Pixel(0, -30)
              });
              infoWindow.open(this.h5Map, marker.getPosition());
            });
            
            markers.push(marker);
          });
          
          this.h5Map.add(markers);
          
          // 调整视野
          setTimeout(() => {
            this.includePoints();
          }, 100);
        } else {
          console.log('高德地图：没有标记点需要添加');
        }
      } catch (error) {
        console.error('更新高德地图标记点失败:', error);
      }
      // #endif
    },
    
    // 更新H5地图路线
    updateH5MapRoute() {
      // #ifdef H5
      if (!this.h5Map) return;
      
      if (typeof TMap !== 'undefined') {
        // 腾讯地图WebGL路线更新
        this.updateTMapRoute();
      } else if (typeof AMap !== 'undefined') {
        // 高德地图路线更新
        this.updateAMapRoute();
      }
      // #endif
    },
    
    // 更新腾讯地图WebGL路线
    updateTMapRoute() {
      // #ifdef H5
      if (!this.h5Map || typeof TMap === 'undefined') return;
      
      try {
        // 清除现有的路线图层
        if (this.polylineLayer) {
          this.polylineLayer.setMap(null);
        }
        
        if (this.route && this.route.length > 0 && this.route[0].points && this.route[0].points.length > 1) {
          // 创建路线点数组
          const pathPoints = this.route[0].points.map(point => {
            return new TMap.LatLng(point.latitude, point.longitude);
          });
          
          // 创建路线图层
          this.polylineLayer = new TMap.MultiPolyline({
            map: this.h5Map,
            styles: {
              style_blue: new TMap.PolylineStyle({
                color: this.route[0].color, 
                width: this.route[0].width,
                borderWidth: this.route[0].borderWidth,
                borderColor: this.route[0].borderColor,
                lineCap: 'round',
                lineJoin: 'round',
                showArrow: this.route[0].arrowLine,
                geodesic: true
              })
            },
            geometries: [
              {
                id: 'polyline_1',
                styleId: 'style_blue',
                paths: pathPoints
              }
            ]
          });
        }
      } catch (error) {
        console.error('更新腾讯地图WebGL路线失败:', error);
      }
      // #endif
    },
    
    // 更新高德地图路线
    updateAMapRoute() {
      // #ifdef H5
      if (!this.h5Map || typeof AMap === 'undefined') return;
      
      try {
        // 清除已有路线但保留标记点
        const markers = this.h5Map.getAllOverlays('marker');
        this.h5Map.clearMap();
        this.h5Map.add(markers);
        
        // 添加新路线
        if (this.route && this.route.length > 0 && this.route[0].points && this.route[0].points.length > 1) {
          const path = this.route[0].points.map(point => [point.longitude, point.latitude]);
          
          // 创建折线
          const polyline = new AMap.Polyline({
            path: path,
            strokeColor: this.route[0].color,
            strokeWeight: this.route[0].width,
            strokeOpacity: 1,
            strokeStyle: this.route[0].dottedLine ? 'dashed' : 'solid'
          });
          
          this.h5Map.add(polyline);
        }
      } catch (error) {
        console.error('更新高德地图路线失败:', error);
      }
      // #endif
    },
    
    // 包含所有标记点
    includePoints(padding = 100) {
      if (!this.markers || this.markers.length === 0) return;
      
      const points = this.markers.map(item => ({
        latitude: item.latitude,
        longitude: item.longitude
      }));
      
      // 小程序环境使用统一的MapService
      // #ifdef MP-WEIXIN
      MapService.includePoints(points, padding);
      // #endif
      
      // H5环境自行处理
      // #ifdef H5
      try {
        if (this.h5Map) {
          if (typeof TMap !== 'undefined') {
            // 腾讯地图WebGL
            const bounds = new TMap.LatLngBounds();
            
            // 扩展边界包含所有点
            points.forEach(point => {
              bounds.extend(new TMap.LatLng(point.latitude, point.longitude));
            });
            
            // 设置视野
            this.h5Map.fitBounds(bounds, {
              padding: padding
            });
          } else if (typeof AMap !== 'undefined') {
            // 高德地图
            if (points.length === 1) {
              // 单点情况
              this.h5Map.setCenter([points[0].longitude, points[0].latitude]);
              this.h5Map.setZoom(15);
            } else {
              // 多点情况，设置合适的视图范围
              const newPoints = points.map(point => [point.longitude, point.latitude]);
              this.h5Map.setFitView(null, false, [padding, padding, padding, padding]);
            }
          }
        }
      } catch (error) {
        console.error('H5地图设置视野失败:', error);
      }
      // #endif
    },
    
    // 标记点点击事件
    onMarkerTap(e) {
      this.$emit('marker-tap', e.markerId);
    },
    
    // 对外暴露的方法：移动到指定位置
    moveToLocation(longitude, latitude, scale) {
      this.longitude = longitude;
      this.latitude = latitude;
      if (scale) {
        this.scale = scale;
      }
      
      MapService.moveToLocation(longitude, latitude, this.scale);
    },
    
    // 对外暴露的方法：更新地图标记点
    updateMapMarkers() {
      // 小程序环境
      // #ifdef MP-WEIXIN
      console.log('微信小程序环境：更新标记点');
      if (this.mapContext) {
        // 先清除再添加，强制刷新
        const markerIds = this.markers.map((_, index) => index);
        
        // 只有当有标记点时才执行清除操作
        if (markerIds.length > 0) {
          // 先移除所有现有标记点
          this.mapContext.removeMarkers({
            markerIds: markerIds,
            success: () => {
              console.log('已清除所有标记点');
              
              // 延迟添加新标记点，确保清除操作完成
              setTimeout(() => {
                // 添加新标记点
                this.mapContext.addMarkers({
                  markers: this.markers,
                  clear: false, // 不清除地图上已有的marker
                  success: () => {
                    console.log('添加新标记点成功，数量:', this.markers.length);
                    // 调整地图视野
                    this.includePoints();
                  },
                  fail: (err) => {
                    console.error('添加标记点失败:', err);
                  }
                });
              }, 100);
            },
            fail: (err) => {
              console.error('清除标记点失败:', err);
              
              // 即使清除失败，也尝试添加标记点
              this.mapContext.addMarkers({
                markers: this.markers,
                clear: true, // 清除地图上所有marker
                success: () => {
                  console.log('添加新标记点成功，数量:', this.markers.length);
                  this.includePoints();
                }
              });
            }
          });
        } else {
          console.log('没有标记点需要更新');
        }
      }
      // #endif
      
      // H5环境
      // #ifdef H5
      this.updateH5MapMarkers();
      // #endif
    }
  }
}
</script>

<style>
/* 地图容器 */
.map-container {
  width: 750rpx;
  height: 100vh;
  position: relative;
}

/* 地图 */
.map {
  width: 750rpx;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* H5地图容器样式 */
#h5-map {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* 地图上的控件需要确保在地图上方显示 */
.route-btn-wrapper,
.location-button {
  z-index: 999 !important;
}
</style> 