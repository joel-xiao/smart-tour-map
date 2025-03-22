import mapConfig from '../../../static/config/mapConfig.js';

// 地图加载器 - 处理不同环境下的地图加载逻辑
class MapLoader {
  constructor() {
    this.config = mapConfig;
    this.mapLoaded = false;
    this.scriptLoadPromises = {};
  }
  
  // 加载地图脚本 (H5环境)
  loadH5MapScript(mapType = 'qq') {
    // #ifdef H5
    return new Promise((resolve, reject) => {
      if (mapType === 'qq' && this.config.mapKey.qqmap) {
        this.loadQQMapScript()
          .then(resolve)
          .catch(() => {
            console.error('加载腾讯地图失败，尝试加载高德地图作为备选');
            this.loadAMapScript()
              .then(resolve)
              .catch(reject);
          });
      } else if (mapType === 'amap' && this.config.mapKey.h5.amap) {
        this.loadAMapScript()
          .then(resolve)
          .catch(reject);
      } else if (mapType === 'bmap' && this.config.mapKey.h5.bmap) {
        this.loadBMapScript()
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('未配置有效的地图密钥'));
      }
    });
    // #endif
    
    // #ifndef H5
    return Promise.resolve(null);
    // #endif
  }
  
  // 加载腾讯地图WebGL版本
  loadQQMapScript() {
    // #ifdef H5
    // 避免重复加载
    if (this.scriptLoadPromises.qq) {
      return this.scriptLoadPromises.qq;
    }
    
    this.scriptLoadPromises.qq = new Promise((resolve, reject) => {
      // 检查地图对象是否已存在
      if (typeof TMap !== 'undefined') {
        resolve(TMap);
        return;
      }
      
      // 创建全局回调函数
      window.onTMapInitComplete = () => {
        console.log('腾讯地图WebGL脚本加载完成');
        if (typeof TMap !== 'undefined') {
          resolve(TMap);
        } else {
          reject(new Error('腾讯地图加载失败'));
        }
      };
      
      // 加载腾讯地图WebGL版本脚本
      const tmapScript = document.createElement('script');
      tmapScript.type = 'text/javascript';
      tmapScript.async = true;
      tmapScript.src = `https://map.qq.com/api/gljs?v=1.exp&key=${this.config.mapKey.qqmap}&callback=onTMapInitComplete`;
      tmapScript.onerror = () => {
        reject(new Error('腾讯地图脚本加载失败'));
      };
      document.head.appendChild(tmapScript);
    });
    
    return this.scriptLoadPromises.qq;
    // #endif
    
    // #ifndef H5
    return Promise.resolve(null);
    // #endif
  }
  
  // 加载高德地图
  loadAMapScript() {
    // #ifdef H5
    // 避免重复加载
    if (this.scriptLoadPromises.amap) {
      return this.scriptLoadPromises.amap;
    }
    
    this.scriptLoadPromises.amap = new Promise((resolve, reject) => {
      // 检查地图对象是否已存在
      if (typeof AMap !== 'undefined') {
        resolve(AMap);
        return;
      }
      
      // 加载高德地图脚本
      const amapScript = document.createElement('script');
      amapScript.type = 'text/javascript';
      amapScript.async = true;
      amapScript.src = `https://webapi.amap.com/maps?v=2.0&key=${this.config.mapKey.h5.amap}`;
      amapScript.onerror = () => {
        reject(new Error('高德地图脚本加载失败'));
      };
      
      // 加载高德地图UI组件库
      const amapUIScript = document.createElement('script');
      amapUIScript.type = 'text/javascript';
      amapUIScript.async = true;
      amapUIScript.src = 'https://webapi.amap.com/ui/1.1/main.js?v=1.1.1';
      
      // 监听脚本加载完成
      amapScript.onload = () => {
        setTimeout(() => {
          // 防止AMap对象尚未完全初始化
          if (typeof AMap !== 'undefined') {
            resolve(AMap);
          } else {
            reject(new Error('高德地图加载失败'));
          }
        }, 100);
      };
      
      document.head.appendChild(amapScript);
      document.head.appendChild(amapUIScript);
    });
    
    return this.scriptLoadPromises.amap;
    // #endif
    
    // #ifndef H5
    return Promise.resolve(null);
    // #endif
  }
  
  // 加载百度地图
  loadBMapScript() {
    // #ifdef H5
    // 避免重复加载
    if (this.scriptLoadPromises.bmap) {
      return this.scriptLoadPromises.bmap;
    }
    
    this.scriptLoadPromises.bmap = new Promise((resolve, reject) => {
      // 检查地图对象是否已存在
      if (typeof BMap !== 'undefined') {
        resolve(BMap);
        return;
      }
      
      // 设置回调函数
      window.bmapInitCallback = () => {
        console.log('百度地图脚本加载完成');
        if (typeof BMap !== 'undefined') {
          resolve(BMap);
        } else {
          reject(new Error('百度地图加载失败'));
        }
      };
      
      // 加载百度地图脚本
      const bmapScript = document.createElement('script');
      bmapScript.type = 'text/javascript';
      bmapScript.async = true;
      bmapScript.src = `https://api.map.baidu.com/api?v=3.0&ak=${this.config.mapKey.h5.bmap}&callback=bmapInitCallback`;
      bmapScript.onerror = () => {
        reject(new Error('百度地图脚本加载失败'));
      };
      document.head.appendChild(bmapScript);
    });
    
    return this.scriptLoadPromises.bmap;
    // #endif
    
    // #ifndef H5
    return Promise.resolve(null);
    // #endif
  }
  
  // 注入CSS隐藏地图的缩放控件 (H5环境)
  injectAntiZoomCSS() {
    // #ifdef H5
    try {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        .amap-zoom, .amap-zoom-touch-container, .amap-controls, 
        .tdt-control-zoom, .tmap-control-zoom, [class*="zoom-control"], [class*="zoomControl"],
        .BMap_zoom, .BMap_stdMpCtrl, .BMap_cpyCtrl, .anchorBL, div[data-agl-cvt], div[data-tooltip],
        .gmnoprint, div[title="放大"], div[title="缩小"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
      
      // 使用MutationObserver持续监听DOM变化，移除缩放控件
      const observer = new MutationObserver((mutations) => {
        const zoomControls = document.querySelectorAll('.amap-zoom, .amap-zoom-touch-container, .amap-controls, .tdt-control-zoom, .tmap-control-zoom, [class*="zoom-control"], [class*="zoomControl"], .BMap_zoom, .BMap_stdMpCtrl, .BMap_cpyCtrl, .anchorBL, div[data-agl-cvt], div[data-tooltip], .gmnoprint, div[title="放大"], div[title="缩小"]');
        if (zoomControls && zoomControls.length > 0) {
          zoomControls.forEach(control => {
            control.style.display = 'none';
            control.style.visibility = 'hidden';
            control.style.opacity = '0';
            control.style.pointerEvents = 'none';
          });
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('注入反缩放按钮CSS成功');
    } catch (e) {
      console.error('注入CSS失败:', e);
    }
    // #endif
  }
  
  // 移除腾讯/高德地图默认的定位按钮
  removeDefaultLocationControls() {
    // #ifdef H5
    try {
      // 查找并移除所有与定位相关的默认控件
      const locationControls = document.querySelectorAll('[class*="location"], [class*="gps"], [title*="定位"], [class*="locate"]');
      if (locationControls && locationControls.length > 0) {
        locationControls.forEach(control => {
          if (control.className.indexOf('locate-btn') === -1) { // 不移除我们自己的定位按钮
            control.style.display = 'none';
          }
        });
      }
      console.log('移除默认定位控件成功');
    } catch (e) {
      console.error('移除默认定位控件失败:', e);
    }
    // #endif
  }
}

export default new MapLoader(); 