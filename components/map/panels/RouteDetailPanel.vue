<template>
  <view class="route-detail" :class="{show: visible}">
    <view class="route-header">
      <view class="route-title">
        <view class="name">{{route.name}}</view>
        <view class="count">共有{{route.count}}个景点</view>
      </view>
      <view class="close-btn" @click="close">×</view>
    </view>
    <scroll-view class="points-list" scroll-x>
      <view 
        v-for="(point, index) in points" 
        :key="index"
        class="point-item"
        :class="{active: selectedPointIndex === index}"
        @click="selectPoint(index)"
      >
        <view class="point-index">{{index + 1}}</view>
        <view class="point-info">
          <view class="point-name">{{point.name}}</view>
          <view class="point-desc">{{point.hint || '暂无说明'}}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'RouteDetailPanel',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    route: {
      type: Object,
      default: () => ({ name: '', count: 0 })
    },
    points: {
      type: Array,
      default: () => []
    },
    selectedPointIndex: {
      type: Number,
      default: -1
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    selectPoint(index) {
      this.$emit('select-point', index);
    }
  }
}
</script>

<style>
.route-detail {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  height: 0;
  transition: height 0.3s;
  overflow: hidden;
  z-index: 20;
  padding-bottom: 100rpx;
}

.route-detail.show {
  height: 400rpx;
}

.route-header {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.route-title .name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.route-title .count {
  font-size: 24rpx;
  color: #999;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
  padding: 0 10rpx;
}

.points-list {
  white-space: nowrap;
  height: 220rpx;
}

/* 添加隐藏滚动条的样式 */
.points-list::-webkit-scrollbar {
  display: none;
}

.point-item {
  display: inline-flex;
  align-items: center;
  padding: 20rpx;
  min-width: 250rpx;
  height: 180rpx;
  box-sizing: border-box;
  border-right: 1rpx solid #eee;
}

.point-item.active {
  background-color: rgba(26, 173, 25, 0.1);
}

.point-index {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  font-size: 28rpx;
}

.point-item.active .point-index {
  background-color: #1aad19;
  color: #fff;
}

.point-info {
  flex: 1;
}

.point-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.point-desc {
  font-size: 24rpx;
  color: #999;
}
</style> 