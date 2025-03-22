import App from './App'
import mapConfig from './static/config/mapConfig.js'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()

Vue.prototype.$mapConfig = mapConfig

// 全局网络状态监听
Vue.prototype.$networkStatus = {
  isConnected: true,
  networkType: 'unknown'
}

// 监听网络状态变化
uni.onNetworkStatusChange(function(res) {
  Vue.prototype.$networkStatus.isConnected = res.isConnected
  Vue.prototype.$networkStatus.networkType = res.networkType
  
  // 网络恢复时提示
  if (res.isConnected) {
    uni.showToast({
      title: '网络已恢复',
      icon: 'none',
      duration: 2000
    })
  } else {
    uni.showToast({
      title: '网络连接已断开',
      icon: 'none',
      duration: 2000
    })
  }
})

// 获取初始网络状态
uni.getNetworkType({
  success: function(res) {
    Vue.prototype.$networkStatus.networkType = res.networkType
    Vue.prototype.$networkStatus.isConnected = res.networkType !== 'none'
  }
})

// 全局错误处理
Vue.config.errorHandler = function(err, vm, info) {
  console.error('Vue错误:', err)
  console.error('错误信息:', info)
}

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif