import mapConfig from '../config/mapConfig.js';

// 初始化地图SDK
let qqmapsdk = null;

// 仅在微信小程序环境中初始化腾讯地图SDK
// #ifdef MP-WEIXIN
try {
  // 由于requirePlugin只在微信小程序中可用，这里用动态方式加载
  if (typeof wx !== 'undefined' && wx.requirePlugin) {
    const QQMapWX = wx.requirePlugin('qqmap-wx-jssdk');
    qqmapsdk = new QQMapWX({
      key: mapConfig.mapKey.qqmap
    });
    console.log('腾讯地图SDK初始化成功');
  } else {
    console.log('当前环境不支持requirePlugin');
  }
} catch (error) {
  console.error('地图SDK初始化失败:', error);
}
// #endif

const mapUtils = {
  // 检查是否在微信小程序环境
  isWxMiniProgram() {
    // #ifdef MP-WEIXIN
    return true;
    // #endif
    
    // #ifndef MP-WEIXIN
    return false;
    // #endif
  },
  
  // 逆地址解析（坐标转地址）
  reverseGeocoder(latitude, longitude) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      if (!qqmapsdk) {
        return reject(new Error('地图SDK未初始化'));
      }
      
      qqmapsdk.reverseGeocoder({
        location: {
          latitude,
          longitude
        },
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('逆地址解析失败:', error);
          reject(error);
        }
      });
      // #endif
      
      // #ifndef MP-WEIXIN
      reject(new Error('当前平台不支持此功能'));
      // #endif
    });
  },
  
  // 计算距离
  calculateDistance(from, to) {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      if (!qqmapsdk) {
        return reject(new Error('地图SDK未初始化'));
      }
      
      qqmapsdk.calculateDistance({
        from,
        to,
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('距离计算失败:', error);
          reject(error);
        }
      });
      // #endif
      
      // #ifndef MP-WEIXIN
      reject(new Error('当前平台不支持此功能'));
      // #endif
    });
  },
  
  // 获取当前位置
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          console.error('获取位置失败:', error);
          reject(error);
        }
      });
    });
  }
};

export default mapUtils;