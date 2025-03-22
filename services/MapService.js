/**
 * 地图服务类
 * 提供地图相关的服务功能，包括地图控制、定位、路径规划等
 */

// 地图上下文
let mapContext = null;
// H5地图实例
let h5Map = null;

/**
 * 设置地图上下文（小程序环境）
 * @param {Object} context - 小程序地图上下文对象
 */
export function setMapContext(context) {
  mapContext = context;
  console.log('设置地图上下文成功');
}

/**
 * 设置H5地图实例
 * @param {Object} map - H5环境下的地图实例
 */
export function setH5Map(map) {
  h5Map = map;
  console.log('设置H5地图实例成功');
}

/**
 * 移动地图到指定位置
 * @param {Number} longitude - 经度
 * @param {Number} latitude - 纬度
 * @param {Number} scale - 缩放级别
 */
export function moveToLocation(longitude, latitude, scale = 16) {
  // 小程序环境
  // #ifdef MP-WEIXIN
  if (mapContext) {
    mapContext.moveToLocation({
      longitude: longitude,
      latitude: latitude,
      success: () => {
        console.log('移动到指定位置成功');
      },
      fail: (err) => {
        console.error('移动到指定位置失败:', err);
      }
    });
  }
  // #endif
  
  // H5环境
  // #ifdef H5
  if (h5Map) {
    if (typeof TMap !== 'undefined') {
      // 腾讯地图WebGL
      const center = new TMap.LatLng(latitude, longitude);
      h5Map.setCenter(center);
      h5Map.setZoom(scale);
    } else if (typeof AMap !== 'undefined') {
      // 高德地图
      h5Map.setCenter([longitude, latitude]);
      h5Map.setZoom(scale);
    }
  }
  // #endif
}

/**
 * 包含所有标记点
 * @param {Array} points - 点位数组，每个元素包含longitude和latitude
 * @param {Number} padding - 边距
 */
export function includePoints(points, padding = 100) {
  if (!points || points.length === 0) return;
  
  // 小程序环境
  // #ifdef MP-WEIXIN
  if (mapContext) {
    mapContext.includePoints({
      padding: [padding, padding, padding, padding],
      points: points,
      success: () => {
        console.log('地图视野更新成功');
      },
      fail: (err) => {
        console.error('地图视野更新失败:', err);
      }
    });
  }
  // #endif
  
  // H5环境
  // #ifdef H5
  if (h5Map) {
    if (typeof TMap !== 'undefined') {
      // 腾讯地图WebGL
      const bounds = new TMap.LatLngBounds();
      points.forEach(point => {
        bounds.extend(new TMap.LatLng(point.latitude, point.longitude));
      });
      h5Map.fitBounds(bounds);
    } else if (typeof AMap !== 'undefined') {
      // 高德地图
      h5Map.setFitView();
    }
  }
  // #endif
}

/**
 * 获取当前位置
 * @returns {Promise} 返回位置信息的Promise
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    // 小程序环境
    // #ifdef MP-WEIXIN
    uni.authorize({
      scope: 'scope.userLocation',
      success: () => {
        uni.getLocation({
          type: 'gcj02',
          success: res => {
            resolve(res);
          },
          fail: err => {
            reject(err);
          }
        });
      },
      fail: (err) => {
        reject({
          errMsg: '位置权限被拒绝，请在设置中开启',
          ...err
        });
      }
    });
    // #endif
    
    // H5环境
    // #ifdef H5
    if (navigator && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // WGS84坐标系，可能需要转换
          resolve({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          let errMsg = '获取位置失败';
          if (error.code === 1) { // PERMISSION_DENIED
            errMsg = '位置权限被拒绝，请在浏览器设置中允许获取位置';
          } else if (error.code === 2) { // POSITION_UNAVAILABLE
            errMsg = '无法获取当前位置';
          } else if (error.code === 3) { // TIMEOUT
            errMsg = '获取位置超时，请检查网络';
          }
          
          reject({
            errMsg,
            ...error
          });
        },
        options
      );
    } else {
      reject({
        errMsg: '当前浏览器不支持获取位置'
      });
    }
    // #endif
  });
}

/**
 * 手动选择位置
 * @returns {Promise} 返回选择的位置信息
 */
export function chooseLocation() {
  return new Promise((resolve, reject) => {
    // 小程序环境
    // #ifdef MP-WEIXIN
    uni.chooseLocation({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
    // #endif
    
    // H5环境
    // #ifdef H5
    reject({
      errMsg: 'H5环境暂不支持选择位置'
    });
    // #endif
  });
}

// 为了兼容之前的代码，提供默认导出
export default {
  setMapContext,
  setH5Map,
  moveToLocation,
  includePoints,
  getCurrentLocation,
  chooseLocation
}; 