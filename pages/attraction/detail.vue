<template>
  <view class="attraction-detail">
    <!-- 返回按钮和标题栏 -->
    <view class="nav-bar">
      <view class="left-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">景区详情</view>
      <view class="right-btns">
        <text class="iconfont icon-share"></text>
        <text class="iconfont icon-collect"></text>
      </view>
    </view>
    
    <!-- 轮播图 -->
    <swiper class="banner-swiper" circular :indicator-dots="true" autoplay>
      <swiper-item>
        <image src="/static/images/backgrounds/default_bg.jpg" mode="aspectFill" class="banner-image"></image>
      </swiper-item>
      <swiper-item>
        <image src="/static/images/backgrounds/default_bg.jpg" mode="aspectFill" class="banner-image"></image>
      </swiper-item>
    </swiper>
    
    <!-- 景点标题信息 -->
    <view class="attraction-info">
      <view class="attraction-header">
        <view class="title-area">
          <view class="title-wrap">
            <text class="tag">【自营】</text>
            <text class="title">八达岭长城</text>
            <text class="en-title">The Great-wall of Badaling</text>
          </view>
          <view class="level">国家AAAAA级风景名胜区</view>
        </view>
      </view>
      
      <!-- 开放时间 -->
      <view class="info-row">
        <text class="info-label">开园时间：</text>
        <text class="info-value">07:30-16:00</text>
        <navigator url="/pages/notice/index" class="link-btn">
          <text>预订须知</text>
          <text class="iconfont icon-right"></text>
        </navigator>
      </view>
      
      <!-- 地址 -->
      <view class="info-row">
        <text class="info-label-vertical">北京市延庆区军都山关沟古道北口</text>
        <view class="map-btn" @click="openMap">
          <text class="text-primary">地图·导航</text>
          <view class="distance">距我 52.8km</view>
        </view>
      </view>
    </view>
    
    <!-- 日期选择 -->
    <view class="date-selector">
      <scroll-view scroll-x class="date-list">
        <view 
          v-for="(date, index) in dateList" 
          :key="index" 
          class="date-item" 
          :class="{ active: selectedDate === index }"
          @click="selectDate(index)"
        >
          <text class="date-text">{{date}}</text>
          <text class="check-icon" v-if="selectedDate === index">✓</text>
        </view>
      </scroll-view>
      <view class="date-notice" v-if="!hasTimeSlot">
        <text class="notice-text">当前游玩日期没有可选时间段，换个日期试试</text>
      </view>
    </view>
    
    <!-- 可选票型 -->
    <view class="ticket-section">
      <view class="section-title">可选票型</view>
      
      <view class="ticket-list">
        <view class="ticket-item" v-for="(ticket, index) in tickets" :key="index">
          <view class="ticket-info">
            <view class="ticket-name">{{ticket.name}}</view>
            <view class="ticket-tags">
              <text v-for="(tag, idx) in ticket.tags" :key="idx" class="tag-item">{{tag}}</text>
            </view>
            <view class="ticket-detail">查看详情 ></view>
          </view>
          <view class="ticket-price">
            <text class="price-symbol">¥</text>
            <text class="price-value">{{ticket.price}}</text>
            <text class="price-unit">起</text>
          </view>
          <view class="book-btn" @click="bookTicket(ticket)">立即预订</view>
        </view>
      </view>
    </view>
    
    <!-- 底部购买栏 -->
    <view class="bottom-bar">
      <view class="cart-info">
        <text>已选：</text>
        <text class="selected-count">{{selectedCount}}</text>
        <text class="total-price">总额：</text>
        <text class="price-symbol">¥</text>
        <text class="price-value">{{totalPrice.toFixed(2)}}</text>
      </view>
      <view class="confirm-btn" @click="confirmOrder">立即预订</view>
    </view>

    <view class="action-buttons">
      <view class="action-btn booking-btn" @click="navigateToBooking">
        <text class="iconfont icon-book"></text>
        <text>预约参观</text>
      </view>
      <view class="action-btn guide-btn" @click="navigateToGuide">
        <text class="iconfont icon-navigation"></text>
        <text>语音导览</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: 0,
      hasTimeSlot: false,
      dateList: ['2025-03-22', '2025-03-23', '2025-03-24', '2025-03-25'],
      tickets: [
        {
          id: 1,
          name: '八达岭长城成人票【淡季】+缆车双程票【买缆车票赠送野鸭湖50元成人票优惠券】',
          tags: ['长城', '缆车'],
          price: 175,
          selected: false
        },
        {
          id: 2,
          name: '八达岭长城学生票【淡季】+缆车双程票【买缆车票赠送野鸭湖50元成人票优惠券】',
          tags: ['学生票', '缆车'],
          price: 157.5,
          selected: false
        },
        {
          id: 3,
          name: '八达岭长城成人票【淡季】+缆车单程票【买缆车票赠送野鸭湖50元成人票优惠券】',
          tags: ['成人票', '缆车'],
          price: 135,
          selected: false
        },
        {
          id: 4,
          name: '八达岭长城学生票【淡季】+缆车单程票【买缆车票赠送野鸭湖50元成人票优惠券】',
          tags: ['学生票', '缆车'],
          price: 117.5,
          selected: false
        }
      ],
      selectedCount: 0,
      totalPrice: 0
    }
  },
  onLoad(options) {
    // 获取景点ID，根据ID加载详情
    const id = options.id || 1
    this.loadAttractionDetail(id)
  },
  methods: {
    loadAttractionDetail(id) {
      // 实际项目中应该从服务器获取数据
      console.log('加载景点详情，ID：', id)
    },
    goBack() {
      uni.navigateBack()
    },
    openMap() {
      uni.showToast({
        title: '打开地图导航',
        icon: 'none'
      })
    },
    selectDate(index) {
      this.selectedDate = index
      this.hasTimeSlot = index !== 0 // 假设只有第一天没有时间段
    },
    bookTicket(ticket) {
      // 切换选中状态
      ticket.selected = !ticket.selected
      // 更新已选数量和总价
      this.updateCartInfo()
    },
    updateCartInfo() {
      let count = 0
      let price = 0
      
      this.tickets.forEach(ticket => {
        if (ticket.selected) {
          count++
          price += ticket.price
        }
      })
      
      this.selectedCount = count
      this.totalPrice = price
    },
    confirmOrder() {
      if (this.selectedCount === 0) {
        uni.showToast({
          title: '请先选择票型',
          icon: 'none'
        })
        return
      }
      
      // 跳转到订单确认页
      const selectedTickets = this.tickets.filter(t => t.selected)
      uni.navigateTo({
        url: `/pages/order/confirm?ticketId=${selectedTickets[0].id}`
      })
    },
    navigateToBooking() {
      // 实现预约参观的逻辑
      console.log('预约参观')
    },
    navigateToGuide() {
      uni.navigateTo({
        url: `/pages/attraction/guide?id=${this.attractionId}`
      })
    }
  }
}
</script>

<style lang="scss">
/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 20rpx;
  padding-top: var(--status-bar-height);
  background-color: rgba(255,255,255,0.9);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  
  .left-btn {
    padding: 16rpx;
    
    .iconfont {
      font-size: 36rpx;
      color: #333;
    }
  }
  
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .right-btns {
    display: flex;
    
    .iconfont {
      font-size: 36rpx;
      color: #333;
      margin-left: 30rpx;
    }
  }
}

/* 轮播图样式 */
.banner-swiper {
  height: 480rpx;
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
}

/* 景点信息样式 */
.attraction-info {
  padding: 30rpx 20rpx;
  background-color: #fff;
  
  .attraction-header {
    .title-area {
      margin-bottom: 20rpx;
      
      .title-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 6rpx;
        
        .tag {
          font-size: 28rpx;
          color: #333;
        }
        
        .title {
          font-size: 34rpx;
          font-weight: bold;
          color: #333;
          margin: 0 10rpx;
        }
        
        .en-title {
          font-size: 24rpx;
          color: #666;
        }
      }
      
      .level {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    padding: 10rpx 0;
    
    .info-label {
      font-size: 28rpx;
      color: #333;
    }
    
    .info-label-vertical {
      font-size: 28rpx;
      color: #333;
      width: 60%;
    }
    
    .info-value {
      font-size: 28rpx;
      color: #666;
      flex: 1;
    }
    
    .link-btn {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #4080ff;
      
      .iconfont {
        font-size: 24rpx;
        margin-left: 6rpx;
      }
    }
    
    .map-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .text-primary {
        color: #4080ff;
        font-size: 28rpx;
      }
      
      .distance {
        font-size: 24rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
  }
}

/* 日期选择样式 */
.date-selector {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  
  .date-list {
    display: flex;
    white-space: nowrap;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    .date-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 220rpx;
      height: 80rpx;
      border: 2rpx solid #eee;
      border-radius: 8rpx;
      margin-right: 20rpx;
      position: relative;
      
      .date-text {
        font-size: 28rpx;
        color: #333;
      }
      
      .check-icon {
        position: absolute;
        right: 10rpx;
        bottom: 6rpx;
        color: #fff;
        background-color: #f55;
        width: 30rpx;
        height: 30rpx;
        font-size: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      
      &.active {
        border-color: #f55;
      }
    }
  }
  
  .date-notice {
    margin-top: 20rpx;
    padding: 20rpx;
    background-color: #fff9f9;
    border-radius: 8rpx;
    
    .notice-text {
      font-size: 26rpx;
      color: #f55;
    }
  }
}

/* 票型区域样式 */
.ticket-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 220rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .ticket-list {
    .ticket-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f2f2f2;
      
      &:last-child {
        border-bottom: none;
      }
      
      .ticket-info {
        width: 50%;
        
        .ticket-name {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        
        .ticket-tags {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10rpx;
          
          .tag-item {
            font-size: 22rpx;
            color: #999;
            background-color: #f5f5f5;
            padding: 4rpx 12rpx;
            border-radius: 4rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
          }
        }
        
        .ticket-detail {
          font-size: 24rpx;
          color: #4080ff;
        }
      }
      
      .ticket-price {
        display: flex;
        align-items: baseline;
        
        .price-symbol {
          font-size: 24rpx;
          color: #f55;
        }
        
        .price-value {
          font-size: 36rpx;
          font-weight: bold;
          color: #f55;
        }
        
        .price-unit {
          font-size: 24rpx;
          color: #f55;
        }
      }
      
      .book-btn {
        width: 160rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        background-color: #f55;
        color: #fff;
        font-size: 28rpx;
        border-radius: 35rpx;
      }
    }
  }
}

/* 底部购买栏样式 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 90;
  
  .cart-info {
    font-size: 28rpx;
    color: #333;
    
    .selected-count {
      font-weight: bold;
      margin-right: 20rpx;
    }
    
    .total-price {
      color: #333;
    }
    
    .price-symbol {
      color: #f55;
      font-size: 24rpx;
    }
    
    .price-value {
      color: #f55;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  
  .confirm-btn {
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #f55;
    color: #fff;
    font-size: 30rpx;
    border-radius: 40rpx;
  }
}

.action-buttons {
  position: fixed;
  bottom: 100rpx;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 89;
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48%;
    height: 100%;
    background-color: #fff;
    border-radius: 8rpx;
    padding: 10rpx;
    
    .iconfont {
      font-size: 36rpx;
      color: #333;
      margin-bottom: 4rpx;
    }
    
    text {
      font-size: 28rpx;
      color: #333;
    }
  }
}
</style> 