<template>
  <view class="route-btn-wrapper">
    <!-- 游按钮 -->
    <view class="route-btn" @click="toggleRoute">
      <text>{{showRouteDeck ? '×' : '游'}}</text>
    </view>
    
    <!-- 路线选择面板 -->
    <view class="route-panel" v-if="showRouteDeck">
      <view 
        v-for="(route, index) in routes" 
        :key="index"
        class="route-item"
        :class="{active: selectedRouteIndex === index}"
        @click.stop="selectRoute(index)"
      >
        {{route.shortName}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RouteButton',
  props: {
    routes: {
      type: Array,
      required: true
    },
    showRouteDeck: {
      type: Boolean,
      default: false
    },
    showRouteDetail: {
      type: Boolean,
      default: false
    },
    selectedRouteIndex: {
      type: Number,
      default: -1
    }
  },
  methods: {
    toggleRoute() {
      if (this.showRouteDetail) {
        this.$emit('close-detail');
      } else {
        this.$emit('toggle-deck');
      }
    },
    selectRoute(index) {
      this.$emit('select', index);
    }
  }
}
</script>

<style>
/* 按钮容器 */
.route-btn-wrapper {
  position: fixed;
  left: 50%;
  bottom: 120rpx;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  z-index: 999;
  pointer-events: auto;
}

/* H5环境特别处理 */
/* #ifdef H5 */
.route-btn-wrapper {
  bottom: 150rpx;
}
/* #endif */

/* 按钮样式 */
.route-btn {
  width: 120rpx;
  height: 120rpx;
  background-color: #FF8C37;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48rpx;
  font-weight: bold;
  box-shadow: 0 4rpx 20rpx rgba(255,140,55,0.5);
  transition: all 0.3s ease;
  z-index: 999;
}

/* 按钮按下效果 */
.route-btn:active {
  transform: scale(0.95);
  background-color: #E67320;
}

/* 路线面板 */
.route-panel {
  position: absolute;
  bottom: 150rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  width: 180rpx;
  max-height: 350rpx;
  overflow-y: auto;
  animation: slideDown 0.3s ease-out;
  z-index: 998;
}

/* 路线面板动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 路线项 */
.route-item {
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  text-align: center;
  transition: all 0.2s;
}

/* 路线项按下效果 */
.route-item:active {
  background-color: #f0f0f0;
}

/* 激活的路线项 */
.route-item.active {
  background-color: #FF8C37;
  color: #fff;
  font-weight: bold;
}
</style> 