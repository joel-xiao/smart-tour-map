import mapConfig from '../config/mapConfig.js';

// 跨平台兼容的地图工具类
const mapTools = {
  // 获取当前位置
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      // 尝试使用uni.getLocation
      uni.getLocation({
        type: 'gcj02', // 默认为wgs84，gcj02为国测局坐标系（火星坐标系）
        geocode: true, // 开启逆地址解析
        success: (res) => {
          console.log('位置获取成功:', res);
          resolve(res);
        },
        fail: (error) => {
          console.error('通过uni.getLocation获取位置失败:', error);
          
          // 尝试备用方法获取位置 - H5环境
          // #ifdef H5
          if (navigator.geolocation) {
            console.log('尝试使用浏览器API获取位置');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // 浏览器原生API获取到的是WGS84坐标系，需要手动转换或直接使用
                console.log('浏览器API位置获取成功:', position);
                
                // 返回通用格式
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  horizontalAccuracy: position.coords.accuracy,
                  verticalAccuracy: position.coords.altitudeAccuracy || 0,
                  altitude: position.coords.altitude || 0,
                  speed: position.coords.speed || 0,
                  provider: 'browser'
                });
              },
              (error) => {
                console.error('浏览器API位置获取失败:', error);
                // 如果浏览器API也失败，使用默认坐标
                resolve(this.getDefaultLocation());
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );
          } else {
            console.error('浏览器不支持地理定位');
            // 使用默认位置
            resolve(this.getDefaultLocation());
          }
          // #endif
          
          // 微信小程序使用wx.getLocation
          // #ifdef MP-WEIXIN
          console.log('尝试使用wx.getLocation获取位置');
          wx.getLocation({
            type: 'gcj02',
            success: (res) => {
              console.log('wx.getLocation位置获取成功:', res);
              resolve(res);
            },
            fail: (err) => {
              console.error('wx.getLocation位置获取失败:', err);
              resolve(this.getDefaultLocation());
            }
          });
          // #endif
          
          // 其他平台使用默认位置
          // #ifndef H5 || MP-WEIXIN
          resolve(this.getDefaultLocation());
          // #endif
        }
      });
    });
  },
  
  // 获取默认位置 - 使用配置中的初始位置
  getDefaultLocation() {
    console.log('使用默认位置:', mapConfig.initialPosition);
    return {
      latitude: mapConfig.initialPosition.latitude,
      longitude: mapConfig.initialPosition.longitude,
      accuracy: 0,
      horizontalAccuracy: 0,
      verticalAccuracy: 0,
      altitude: 0,
      speed: 0,
      provider: 'default'
    };
  },
  
  // 选择位置
  chooseLocation() {
    return new Promise((resolve, reject) => {
      uni.chooseLocation({
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('选择位置失败:', error);
          reject(error);
        }
      });
    });
  },
  
  // 打开地图
  openLocation(latitude, longitude, name = '当前位置', address = '') {
    return new Promise((resolve, reject) => {
      uni.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: name,
        address: address,
        scale: 18,
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('打开地图失败:', error);
          reject(error);
        }
      });
    });
  },
  
  // 计算两点之间的距离（简单计算，不如SDK精准）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径，单位：km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance * 1000; // 返回单位为米
  },
  
  // 角度转弧度
  deg2rad(deg) {
    return deg * (Math.PI/180);
  },
  
  // 获取位置描述（简化版逆地址解析）
  getLocationDescription(latitude, longitude) {
    // 简单返回坐标信息，实际应用中可以接入其他API进行逆地址解析
    return `位置: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  },
  
  // 使用腾讯地图WebService API的逆地址解析
  reverseGeocode(latitude, longitude) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          location: `${latitude},${longitude}`,
          key: mapConfig.mapKey.qqmap,
          get_poi: 1
        },
        success: (res) => {
          if (res.data && res.data.status === 0) {
            resolve(res.data.result);
          } else {
            reject(new Error(res.data.message || '逆地址解析失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
};

export default mapTools; 