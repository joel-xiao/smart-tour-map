<template>
  <view class="order-page">
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
    }
  }
}
</script>

<style lang="scss">
.order-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
  
  .nav-bar {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 20rpx;
    padding-top: var(--status-bar-height);
    background-color: #fff;
    
    .left-btn {
      padding: 16rpx;
      
      .iconfont {
        font-size: 36rpx;
        color: #333;
      }
    }
    
    .title {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .more-btn {
      padding: 16rpx;
      
      .iconfont {
        font-size: 36rpx;
        color: #333;
      }
    }
  }
  
  .date-tabs {
    display: flex;
    background-color: #000;
    height: 80rpx;
    
    .date-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 28rpx;
      
      &.active {
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30rpx;
          height: 6rpx;
          background-color: #f55;
          border-radius: 3rpx;
        }
      }
    }
  }
  
  .order-card {
    margin: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      
      .order-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #333;
      }
      
      .close-btn {
        font-size: 40rpx;
        color: #999;
        padding: 0 10rpx;
      }
    }
    
    .info-section {
      padding: 20rpx 30rpx;
      
      .info-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .date-selector {
        display: flex;
        align-items: center;
        
        .calendar-icon {
          font-size: 36rpx;
          color: #333;
          margin-right: 10rpx;
        }
        
        .date-text {
          font-size: 32rpx;
          color: #333;
          flex: 1;
        }
        
        .change-btn {
          display: flex;
          align-items: center;
          color: #4080ff;
          font-size: 28rpx;
          
          .iconfont {
            font-size: 24rpx;
            margin-left: 4rpx;
          }
        }
      }
      
      .quantity-selector {
        display: flex;
        align-items: center;
        
        .decrease-btn, .increase-btn {
          width: 60rpx;
          height: 60rpx;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36rpx;
          border: 2rpx solid #eee;
          color: #333;
        }
        
        .quantity {
          margin: 0 30rpx;
          font-size: 36rpx;
          color: #333;
          min-width: 60rpx;
          text-align: center;
        }
      }
    }
    
    .ticket-item {
      margin: 0 30rpx;
      padding: 30rpx 0;
      border-top: 1rpx solid #f2f2f2;
      
      .ticket-name {
        font-size: 30rpx;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .ticket-count {
        position: absolute;
        right: 30rpx;
        font-size: 28rpx;
        color: #333;
      }
      
      .ticket-date {
        display: flex;
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
        
        .date-value {
          margin-left: 10rpx;
        }
      }
    }
    
    .booking-time {
      padding: 30rpx;
      
      .info-title {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 20rpx;
      }
      
      .time-unavailable {
        height: 100rpx;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 28rpx;
        border-radius: 8rpx;
      }
    }
  }
  
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    
    .total-info {
      flex: 1;
      font-size: 28rpx;
      color: #333;
      
      .price {
        margin-left: 10rpx;
        color: #f55;
        font-weight: bold;
        
        .symbol {
          font-size: 24rpx;
        }
        
        .amount {
          font-size: 36rpx;
        }
      }
    }
    
    .book-btn {
      width: 300rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #f55;
      color: #fff;
      font-size: 28rpx;
      border-radius: 8rpx;
    }
  }
}

.calendar-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  
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
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    overflow: hidden;
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #eee;
      
      .header-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .close-icon {
        font-size: 40rpx;
        color: #999;
        padding: 0 10rpx;
      }
    }
    
    .week-header {
      display: flex;
      padding: 20rpx 0;
      
      .week-day {
        flex: 1;
        text-align: center;
        font-size: 28rpx;
        color: #666;
        
        &.weekend {
          color: #f55;
        }
      }
    }
    
    .month-title {
      text-align: center;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .calendar-days {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20rpx 30rpx;
      
      .day-item {
        width: 14.28%;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28rpx;
        color: #333;
        
        &.empty {
          pointer-events: none;
        }
        
        &.today {
          text {
            color: #4080ff;
            font-weight: bold;
          }
        }
        
        &.selected {
          text {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60rpx;
            height: 60rpx;
            background-color: #f55;
            color: #fff;
            border-radius: 50%;
          }
        }
        
        &.weekend {
          color: #f55;
        }
      }
    }
    
    .calendar-footer {
      padding: 20rpx 30rpx 50rpx;
      display: flex;
      justify-content: center;
      
      .confirm-btn {
        width: 90%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background-color: #f55;
        color: #fff;
        font-size: 30rpx;
        border-radius: 40rpx;
      }
    }
  }
}
</style> 