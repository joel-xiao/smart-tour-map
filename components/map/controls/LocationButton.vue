<template>
  <view class="locate-btn" :class="{ active: isLocated }" @click="locate" @longpress="onLongPress">
    <image class="icon-image" src="/static/images/common/target.png"></image>
    <view class="tooltip" v-if="showTooltip">长按选择位置</view>
  </view>
</template>

<script>
import MapService from '../../../services/MapService.js';

export default {
  name: 'LocationButton',
  props: {
    isLocated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTooltip: false,
      tooltipTimer: null
    }
  },
  mounted() {
    // 显示工具提示一次
    this.showTooltip = true;
    this.tooltipTimer = setTimeout(() => {
      this.showTooltip = false;
    }, 3000);
  },
  beforeDestroy() {
    // 清除定时器
    if (this.tooltipTimer) {
      clearTimeout(this.tooltipTimer);
    }
  },
  methods: {
    locate() {
      this.$emit('locate');
    },
    onLongPress() {
      this.$emit('longpress');
    }
  }
}
</script>

<style>
.locate-btn {
  position: fixed;
  left: 20rpx;
  bottom: 200rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 40;
  transition: all 0.3s ease;
}

/* #ifdef H5 */
.locate-btn {
  bottom: 250rpx;
}
/* #endif */

.locate-btn:active {
  transform: scale(0.9);
  background-color: #f5f5f5;
}

.locate-btn .icon-image {
  width: 40rpx;
  height: 40rpx;
}

/* 定位成功时的样式 */
.locate-btn.active {
  background-color: #1aad19;
}

.locate-btn.active .iconfont {
  color: #fff;
}

/* 工具提示样式 */
.tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  white-space: nowrap;
  z-index: 41;
}
</style> 