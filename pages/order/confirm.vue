<template>
  <view class="order-page">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="left-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">景区详情</view>
      <view class="more-btn">
        <text class="iconfont icon-more"></text>
      </view>
    </view>
    
    <!-- 日期选择标签 -->
    <view class="date-tabs">
      <view class="date-tab" v-for="(date, index) in dateList" :key="index" 
        :class="{active: currentDateIndex === index}" 
        @click="selectDate(index)">
        <text>{{date}}</text>
      </view>
    </view>
    
    <!-- 日历选择弹窗 -->
    <view class="calendar-popup" v-if="showCalendar">
      <view class="calendar-mask" @click="closeCalendar"></view>
      <view class="calendar-content">
        <view class="calendar-header">
          <text class="header-title">请选择日期</text>
          <text class="close-icon" @click="closeCalendar">×</text>
        </view>
        
        <view class="week-header">
          <text class="week-day" v-for="(day, index) in weekDays" :key="index" :class="{weekend: index === 5 || index === 6}">{{day}}</text>
        </view>
        
        <view class="month-title">
          <text>{{currentYear}}年{{currentMonth}}月</text>
        </view>
        
        <view class="calendar-days">
          <view class="day-item" v-for="(day, index) in daysArray" :key="index"
            :class="{empty: !day, today: isToday(day), selected: isSelectedDay(day), weekend: isWeekend(index)}">
            <text v-if="day" @click="selectDay(day)">{{day}}</text>
          </view>
        </view>
        
        <view class="calendar-footer">
          <view class="confirm-btn" @click="confirmSelectDate">确定</view>
        </view>
      </view>
    </view>
    
    <!-- 订单卡片 -->
    <view class="order-card">
      <view class="order-header">
        <text class="order-title">{{orderInfo.title}}</text>
        <text class="close-btn" @click="cancelOrder">×</text>
      </view>
      
      <!-- 旅行日期 -->
      <view class="info-section">
        <view class="info-title">
          <text>游玩日期 Travel Date</text>
        </view>
        <view class="date-selector">
          <text class="calendar-icon iconfont icon-calendar"></text>
          <text class="date-text">{{orderInfo.date}} {{orderInfo.dayText}}</text>
          <view class="change-btn" @click="changeDate">
            <text>更换游玩日期</text>
            <text class="iconfont icon-right"></text>
          </view>
        </view>
      </view>
      
      <!-- 数量选择 -->
      <view class="info-section">
        <view class="info-title">
          <text>数量 Qty</text>
        </view>
        <view class="quantity-selector">
          <view class="decrease-btn" @click="decreaseQty">
            <text>-</text>
          </view>
          <text class="quantity">{{orderInfo.quantity}}</text>
          <view class="increase-btn" @click="increaseQty">
            <text>+</text>
          </view>
        </view>
      </view>
      
      <!-- 票种信息 -->
      <view class="ticket-item">
        <view class="ticket-name">缆车双程票</view>
        <text class="ticket-count">X{{orderInfo.quantity}}</text>
        <view class="ticket-date">
          <text>游玩日期 Travel Date</text>
          <text class="date-value">{{orderInfo.date}}</text>
        </view>
      </view>
      
      <view class="ticket-item">
        <view class="ticket-name">成人票</view>
        <text class="ticket-count">X{{orderInfo.quantity}}</text>
        <view class="ticket-date">
          <text>游玩日期 Travel Date</text>
          <text class="date-value">{{orderInfo.date}}</text>
        </view>
      </view>
      
      <!-- 预约时间选择 -->
      <view class="booking-time">
        <view class="info-title">
          <text>请选择预约时间 Booking Time</text>
        </view>
        <view class="time-unavailable">
          <text>当前日期无可售时段</text>
        </view>
      </view>
    </view>
    
    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text>合计 Total Amount</text>
        <text class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{totalPrice.toFixed(2)}}</text>
        </text>
      </view>
      <view class="book-btn" @click="confirmOrder">立即预订 Book Now</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      dateList: ['2025-03-22', '2025-03-23', '2025-03-24', '2025-03-25'],
      currentDateIndex: 0,
      orderInfo: {
        title: '八达岭长城成人票【淡季】+缆车双程票',
        date: '03月22日',
        dayText: '今天',
        quantity: 1
      },
      unitPrice: 175,
      // 日历相关数据
      showCalendar: false,
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      currentYear: 2025,
      currentMonth: 3,
      selectedDay: 22,
      daysArray: []
    }
  },
  computed: {
    totalPrice() {
      return this.unitPrice * this.orderInfo.quantity
    }
  },
  onLoad(options) {
    // 计算状态栏高度
    this.computeStatusBarHeight();
    
    // 从上一页接收参数
    if (options.ticketId) {
      console.log('票型ID:', options.ticketId)
      // 根据ID获取票型信息
    }
  },
  created() {
    this.generateCalendar()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    selectDate(index) {
      this.currentDateIndex = index
      // 更新日期信息
      const dayTexts = ['今天', '明天', '后天', '大后天']
      this.orderInfo.dayText = dayTexts[index] || ''
      
      // 格式化日期 MM月DD日
      const date = new Date(this.dateList[index])
      const month = date.getMonth() + 1
      const day = date.getDate()
      this.orderInfo.date = `${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日`
    },
    cancelOrder() {
      uni.navigateBack()
    },
    changeDate() {
      this.showCalendar = true
    },
    closeCalendar() {
      this.showCalendar = false
    },
    generateCalendar() {
      // 生成当月日历
      const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate()
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth - 1, 1).getDay()
      const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
      
      // 创建日历数组
      const daysArray = Array(offset).fill('') // 填充前面的空白
      for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i)
      }
      
      // 补齐后面的空白，使总数为42（6行7列）
      const remain = 42 - daysArray.length
      for (let i = 0; i < remain; i++) {
        daysArray.push('')
      }
      
      this.daysArray = daysArray
    },
    isToday(day) {
      const today = new Date()
      return day === today.getDate() && this.currentMonth === today.getMonth() + 1 && this.currentYear === today.getFullYear()
    },
    isSelectedDay(day) {
      return day === this.selectedDay
    },
    isWeekend(index) {
      // 计算是否是周末
      return (index % 7 === 5) || (index % 7 === 6)
    },
    selectDay(day) {
      this.selectedDay = day
    },
    confirmSelectDate() {
      // 更新选中的日期
      const formattedMonth = this.currentMonth < 10 ? `0${this.currentMonth}` : this.currentMonth
      const formattedDay = this.selectedDay < 10 ? `0${this.selectedDay}` : this.selectedDay
      this.orderInfo.date = `${formattedMonth}月${formattedDay}日`
      
      // 更新dateList中的日期
      const selectedDate = `${this.currentYear}-${formattedMonth}-${formattedDay}`
      const index = this.dateList.indexOf(selectedDate)
      if (index !== -1) {
        this.currentDateIndex = index
      } else {
        // 如果不在列表中，添加到列表
        this.dateList[this.currentDateIndex] = selectedDate
      }
      
      this.closeCalendar()
    },
    decreaseQty() {
      if (this.orderInfo.quantity > 1) {
        this.orderInfo.quantity--
      }
    },
    increaseQty() {
      this.orderInfo.quantity++
    },
    confirmOrder() {
      uni.showToast({
        title: '预订成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            uni.navigateBack({
              delta: 2 // 返回上上页
            })
          }, 2000)
        }
      })
    },
    // 计算状态栏高度
    computeStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo);
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        console.log('状态栏高度:', this.statusBarHeight);
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    }
  }
}
</script>

<style lang="scss">
.order-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  /* 状态栏背景 */
  .status-bar {
    background-color: #bc8f56;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  
  .nav-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    padding: 0;
    background-color: #bc8f56;
    
    .left-btn {
      padding: 16rpx;
      z-index: 2;
      
      .iconfont {
        font-size: 36rpx;
        color: #fff;
      }
    }
    
    .title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      text-align: center;
      top: -5rpx;
    }
    
    .more-btn {
      padding: 16rpx;
      z-index: 2;
      
      .iconfont {
        font-size: 36rpx;
        color: #fff;
      }
    }
  }
  
  .date-tabs {
    display: flex;
    background-color: #fff;
    padding: 20rpx 0;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    
    .date-tab {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #666;
      padding: 10rpx 0;
      
      &.active {
        color: #bc8f56;
        font-weight: bold;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -10rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: #bc8f56;
          border-radius: 2rpx;
        }
      }
    }
  }
  
  .order-card {
    background-color: #fff;
    border-radius: 16rpx;
    margin: 0 20rpx 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 30rpx 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .order-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        flex: 1;
        padding-right: 20rpx;
      }
      
      .close-btn {
        font-size: 40rpx;
        color: #999;
        line-height: 1;
      }
    }
    
    .info-section {
      padding: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .info-title {
        font-size: 28rpx;
        color: #666;
        margin-bottom: 15rpx;
      }
      
      .date-selector {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .calendar-icon {
          font-size: 36rpx;
          color: #bc8f56;
          margin-right: 10rpx;
        }
        
        .date-text {
          font-size: 30rpx;
          color: #333;
          flex: 1;
        }
        
        .change-btn {
          display: flex;
          align-items: center;
          color: #bc8f56;
          font-size: 26rpx;
          
          .iconfont {
            font-size: 24rpx;
            margin-left: 5rpx;
          }
        }
      }
      
      .quantity-selector {
        display: flex;
        align-items: center;
        
        .decrease-btn, .increase-btn {
          width: 60rpx;
          height: 60rpx;
          border: 1rpx solid #ddd;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36rpx;
          color: #bc8f56;
        }
        
        .quantity {
          min-width: 80rpx;
          text-align: center;
          font-size: 32rpx;
          color: #333;
          margin: 0 20rpx;
        }
      }
    }
    
    .ticket-item {
      padding: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
      
      .ticket-name {
        font-size: 30rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .ticket-count {
        font-size: 28rpx;
        color: #bc8f56;
        margin-bottom: 15rpx;
        display: block;
      }
      
      .ticket-date {
        display: flex;
        justify-content: space-between;
        font-size: 26rpx;
        color: #999;
        
        .date-value {
          color: #666;
        }
      }
    }
    
    .booking-time {
      padding: 20rpx;
      
      .time-unavailable {
        background-color: #f5f5f5;
        padding: 30rpx 0;
        text-align: center;
        font-size: 28rpx;
        color: #999;
        border-radius: 8rpx;
      }
    }
  }
  
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 20rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    z-index: 100;
    
    .total-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      text {
        font-size: 24rpx;
        color: #666;
      }
      
      .price {
        font-size: 36rpx;
        color: #f56c6c;
        font-weight: bold;
        
        .symbol {
          font-size: 24rpx;
          margin-right: 5rpx;
        }
      }
    }
    
    .book-btn {
      background-color: #bc8f56;
      color: #fff;
      font-size: 30rpx;
      padding: 20rpx 40rpx;
      border-radius: 40rpx;
    }
  }
  
  /* 日历弹窗 */
  .calendar-popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    
    .calendar-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
    }
    
    .calendar-content {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 20rpx 20rpx 0 0;
      padding: 30rpx;
      
      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        
        .header-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }
        
        .close-icon {
          font-size: 40rpx;
          color: #999;
        }
      }
      
      .week-header {
        display: flex;
        margin-bottom: 20rpx;
        
        .week-day {
          flex: 1;
          text-align: center;
          font-size: 28rpx;
          color: #999;
          
          &.weekend {
            color: #f56c6c;
          }
        }
      }
      
      .month-title {
        text-align: center;
        font-size: 30rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .calendar-days {
        display: flex;
        flex-wrap: wrap;
        
        .day-item {
          width: 14.28%;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          
          text {
            width: 60rpx;
            height: 60rpx;
            border-radius: 30rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            color: #333;
          }
          
          &.empty {
            pointer-events: none;
          }
          
          &.today text {
            background-color: #f5f5f5;
          }
          
          &.selected text {
            background-color: #bc8f56;
            color: #fff;
          }
          
          &.weekend:not(.selected) text {
            color: #f56c6c;
          }
        }
      }
      
      .calendar-footer {
        margin-top: 30rpx;
        
        .confirm-btn {
          background-color: #bc8f56;
          color: #fff;
          font-size: 30rpx;
          padding: 20rpx 0;
          border-radius: 40rpx;
          text-align: center;
        }
      }
    }
  }
}
</style> 