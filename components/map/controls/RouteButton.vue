<template>
  <view class="route-btn-container">
    <view class="route-btn" @click="toggleRoute">
      <text>{{showRouteDeck ? '×' : '游'}}</text>
      <view class="route-panel" v-if="showRouteDeck">
        <view 
          v-for="(route, index) in routes" 
          :key="index"
          class="route-item"
          @click.stop="selectRoute(index)"
        >
          {{route.shortName}}
        </view>
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
.route-btn-container {
  position: relative;
}

.route-btn {
  position: fixed;
  right: 20rpx;
  bottom: 100rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: #1aad19;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 10;
}

.route-panel {
  position: absolute;
  bottom: 90rpx;
  right: 0;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  z-index: 11;
}

.route-item {
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  text-align: center;
}
</style> 