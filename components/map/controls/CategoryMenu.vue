<template>
  <view class="category-menu">
    <view class="menu-item" @click="toggleCats">
      <image class="icon-image" src="/static/images/common/park.png"></image>
      <view class="category-panel" :class="{hide: !showCats}">
        <view 
          v-for="(item, index) in categories" 
          :key="index"
          :class="{active: currentCatIndex === index}"
          @click.stop="selectCategory(index)"
          class="category-item"
        >
          {{item.name}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CategoryMenu',
  props: {
    categories: {
      type: Array,
      required: true
    },
    currentCatIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showCats: false
    }
  },
  methods: {
    toggleCats() {
      this.showCats = !this.showCats;
    },
    selectCategory(index) {
      this.showCats = false;
      this.$emit('select', index);
    }
  }
}
</script>

<style>
.category-menu {
  display: inline-block;
}

.menu-item {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  position: relative;
}

.menu-item .icon-image {
  width: 36rpx;
  height: 36rpx;
}

.category-panel {
  position: absolute;
  right: 90rpx;
  top: 0;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  transition: all 0.3s;
  z-index: 11;
}

.category-panel.hide {
  transform: scale(0);
  opacity: 0;
}

.category-item {
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
}

.category-item.active {
  color: #1aad19;
  font-weight: bold;
}
</style> 