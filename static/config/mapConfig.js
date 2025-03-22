export default {
  // 是否开启调试模式
  debug: true,
  
  // 地图密钥配置
  mapKey: {
    qqmap: "QZABZ-ZO3WJ-E4KFV-DIGVB-5LMGT-V7BXU", // 微信小程序腾讯地图密钥
    // H5环境使用的密钥
    h5: {
      amap: "e5766edfcfd96b7ee84968b32a41ddc5", // 高德地图Web端密钥
      bmap: ""  // 百度地图密钥
    }
  },
  
  // 地图初始位置（八达岭长城坐标）
  initialPosition: {
    latitude: 40.364,
    longitude: 115.975,
    scale: 14
  },
  
  // 标记点样式
  markerStyle: {
    width: 32,
    height: 40,
    calloutStyle: {
      display: "ALWAYS",
      bgColor: "#ffffff",
      color: "#333333",
      borderRadius: 3,
      fontSize: 12,
      padding: 8
    },
    polylineStyle: {
      color: "#bc8f56",
      width: 4,
      borderColor: "#FFFFFF",
      borderWidth: 1,
      arrowLine: true,
      dottedLine: false
    },
    circleStyle: {
      color: "#bc8f56",
      fillColor: "#bc8f5650",
      strokeWidth: 2
    }
  },
  
  // 全景配置
  panorama: {
    // 全景查看基础URL
    rootUrl: "https://720yun.com/t/67e22mf5jts?scene_id=",
    // 是否启用全景功能
    active: true
  },
  
  // 云服务配置
  cloud: {
    id: "env-badaling",
    cloudRoot: "cloud://env-badaling.656e-env-badaling-1257272717/"
  },
  
  // 网络请求超时配置(毫秒)
  networkTimeout: {
    request: 10000,   // 请求超时时间
    connectSocket: 10000,  // WebSocket连接超时时间
    uploadFile: 10000,  // 上传文件超时时间
    downloadFile: 10000  // 下载文件超时时间
  }
}; 