<template>
  <view class="locate-btn" :class="{ active: isLocated }" @click="locate">
    <image class="icon-image" src="/static/images/icons/target.png"></image>
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
  methods: {
    locate() {
      this.$emit('locate');
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
  z-index: 10;
  transition: all 0.3s ease;
}

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
</style> 