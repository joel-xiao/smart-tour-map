<template>
  <view class="order-page">
    <!-- 状态栏背景 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="left-btn" @click="goBack">
        <text class="iconfont icon-back"></text>
      </view>
      <view class="title">景点详情</view>
      <view class="right-btn" @click="navigateToMap">
        <text class="iconfont icon-map"></text>
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
      <!-- 景点图片展示 -->
      <view class="scenic-image">
        <image :src="scenicImage" mode="aspectFill"></image>
        <view class="image-overlay"></view>
        <view class="image-title">
          <text>{{orderInfo.title}}</text>
          <view class="location-tag" @click="navigateToMap">
            <text class="iconfont icon-location"></text>
            <text>导航到景点</text>
          </view>
        </view>
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
      
      <!-- 项目列表 -->
      <view class="project-list">
        <view class="section-title">
          <text>票种信息</text>
        </view>
        
        <view class="project-item" v-for="(ticket, index) in ticketInfo" :key="index">
          <view class="project-icon">
            <text class="iconfont icon-ticket"></text>
          </view>
          <view class="project-info">
            <view class="project-name">{{ticket.name}}</view>
            <view class="project-price">
              <text class="price-symbol">¥</text>
              <text>{{ticket.price}}</text>
              <text class="price-unit">x {{ticket.count}}</text>
            </view>
            <view class="project-tags" v-if="ticket.tags && ticket.tags.length > 0">
              <text class="tag-item" v-for="(tag, tagIndex) in ticket.tags" :key="tagIndex">{{tag}}</text>
            </view>
          </view>
        </view>
        
        <view class="no-items" v-if="!ticketInfo || ticketInfo.length === 0">
          <text>没有选择票种</text>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="order-info-section">
      <view class="section-title">
        <text>订单信息</text>
      </view>
      <view class="order-info-item">
        <text class="label">订单编号</text>
        <text class="value">{{orderInfo.orderNo}}</text>
      </view>
      <view class="order-info-item">
        <text class="label">下单时间</text>
        <text class="value">{{orderInfo.createTime}}</text>
      </view>
    </view>
    
    <!-- 支付方式 -->
    <view class="payment-section">
      <view class="section-title">
        <text>支付方式</text>
      </view>
      <view class="payment-options">
        <view class="payment-option" :class="{active: paymentMethod === 'wechat'}" @click="selectPayment('wechat')">
          <view class="payment-icon iconfont icon-wechat"></view>
          <view class="payment-name">微信支付</view>
          <view class="payment-check" v-if="paymentMethod === 'wechat'">✓</view>
        </view>
        <view class="payment-option" :class="{active: paymentMethod === 'alipay'}" @click="selectPayment('alipay')">
          <view class="payment-icon iconfont icon-alipay"></view>
          <view class="payment-name">支付宝</view>
          <view class="payment-check" v-if="paymentMethod === 'alipay'">✓</view>
        </view>
      </view>
    </view>
    
    <!-- 底部占位，防止内容被底部栏遮挡 -->
    <view class="bottom-placeholder" :style="{ height: bottomBarHeight + 'px' }"></view>
    
    <!-- 底部结算栏 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="total-info">
        <text>景点门票 Ticket</text>
        <text class="price">
          <text class="symbol">¥</text>
          <text class="amount">{{totalPrice.toFixed(2)}}</text>
        </text>
      </view>
      <view class="pay-btn" @click="confirmOrder">立即支付</view>
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
        title: '',
        date: '03月22日',
        dayText: '今天',
        quantity: 1,
        orderNo: 'SCT' + new Date().getTime(),
        createTime: this.formatDate(new Date())
      },
      unitPrice: 0,
      // 接收从详情页传递的数据
      ticketInfo: [],
      totalCount: 0,
      totalAmount: 0,
      // 日历相关数据
      showCalendar: false,
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      currentYear: 2025,
      currentMonth: 3,
      selectedDay: 22,
      daysArray: [],
      bottomBarHeight: 140, // 底部栏高度（包含安全区域）
      safeAreaBottom: 0, // 底部安全区域高度
      scenicImage: '/static/images/backgrounds/scenic-default.jpg',
      paymentMethod: 'wechat' // 默认支付方式
    }
  },
  computed: {
    totalPrice() {
      return this.totalAmount || 0
    }
  },
  onLoad(options) {
    // 计算状态栏高度和安全区域
    this.computeStatusBarHeight();
    
    // 从上一页接收参数
    if (options.ticketInfo) {
      try {
        // 解析票型信息 - 先解码URL编码的字符串
        const decodedTicketInfo = decodeURIComponent(options.ticketInfo);
        this.ticketInfo = JSON.parse(decodedTicketInfo);
        console.log('票型信息:', this.ticketInfo);
        
        // 设置总价和数量
        this.totalAmount = parseFloat(options.totalPrice) || 0;
        this.totalCount = parseInt(options.totalCount) || 0;
        
        // 如果有票型信息，设置订单标题
        if (this.ticketInfo.length > 0) {
          // 使用景点名称作为订单标题
          this.orderInfo.title = this.ticketInfo[0].scenicName || '景点门票';
          this.orderInfo.quantity = this.totalCount;
          
          // 调试信息
          console.log('设置订单标题:', this.orderInfo.title);
          console.log('设置订单数量:', this.orderInfo.quantity);
          console.log('设置总价:', this.totalAmount);
        }
      } catch (error) {
        console.error('解析票型信息失败:', error);
        uni.showToast({
          title: '票型信息加载失败',
          icon: 'none'
        });
      }
    } else {
      console.warn('没有接收到票型信息');
    }
    
    // 确保静态资源目录存在
    this.checkStaticResources();
  },
  created() {
    this.generateCalendar()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    navigateToMap() {
      // 导航到地图页面
      uni.switchTab({
        url: '/pages/map/index'
      })
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
      // 显示支付确认弹窗
      uni.showModal({
        title: '确认支付',
        content: `确认支付¥${this.totalPrice.toFixed(2)}？`,
        confirmText: '确认支付',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 显示支付加载中
            uni.showLoading({
              title: '支付处理中',
              mask: true
            });
            
            // 模拟支付过程
            setTimeout(() => {
              uni.hideLoading();
              // 支付成功
              uni.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                  // 延迟导航到订单成功页面
                  setTimeout(() => {
                    // 这里可以跳转到订单成功页面
                    uni.redirectTo({
                      url: '/pages/order/success?totalPrice=' + this.totalPrice.toFixed(2) + '&orderNo=' + this.orderInfo.orderNo
                    });
                  }, 1500);
                }
              });
            }, 1500);
          }
        }
      });
    },
    // 计算状态栏高度和安全区域
    computeStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo);
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        console.log('状态栏高度:', this.statusBarHeight);
        
        // 判断是否为iOS设备
        const isIOS = systemInfo.platform === 'ios';
        
        // 如果是iOS设备，增加额外的安全区域高度
        if (isIOS) {
          // 检查是否为刘海屏
          const model = systemInfo.model || '';
          if (model.indexOf('iPhone X') !== -1 || model.indexOf('iPhone 11') !== -1 || 
              model.indexOf('iPhone 12') !== -1 || model.indexOf('iPhone 13') !== -1 ||
              model.indexOf('iPhone 14') !== -1 || model.indexOf('iPhone 15') !== -1 ||
              this.statusBarHeight > 20) {
            console.log('检测到刘海屏iPhone');
            // 为刘海屏增加额外的状态栏高度
            this.statusBarHeight += 4;
          }
        }
        
        // 获取底部安全区域高度（针对iPhone X及以上机型）
        if (systemInfo.safeAreaInsets) {
          this.safeAreaBottom = systemInfo.safeAreaInsets.bottom || 0;
          console.log('底部安全区域高度:', this.safeAreaBottom);
        } else {
          // 兼容方法，处理老版本uni-app或无法获取safeAreaInsets的情况
          const screenHeight = systemInfo.screenHeight;
          const safeArea = systemInfo.safeArea;
          if (safeArea && screenHeight) {
            this.safeAreaBottom = screenHeight - safeArea.bottom;
            console.log('计算得到的底部安全区域高度:', this.safeAreaBottom);
          }
        }
        
        // 根据底部安全区域调整底部占位高度
        this.bottomBarHeight = 100 + this.safeAreaBottom;
      } catch (e) {
        console.error('获取系统信息失败:', e);
      }
    },
    // 检查静态资源目录
    checkStaticResources() {
      // 简化资源检查逻辑，使用静态默认图片
      try {
        // 检测缓存中是否有景点图片URL
        const cachedImage = uni.getStorageSync('scenicImage');
        if (cachedImage) {
          this.scenicImage = cachedImage;
          console.log('使用缓存的景点图片:', this.scenicImage);
          return;
        }
        
        // 使用默认图片
        this.scenicImage = '/static/images/backgrounds/scenic-default.jpg';
        console.log('使用默认景点图片:', this.scenicImage);
      } catch (e) {
        console.error('图片资源检查失败:', e);
        // 出错时使用更可靠的默认图片
        this.scenicImage = '/static/images/backgrounds/scenic-default.jpg';
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    selectPayment(method) {
      this.paymentMethod = method;
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
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
  
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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rpx;
    padding: 0 20rpx;
    background-color: #bc8f56;
    z-index: 999;
    margin-top: v-bind(statusBarHeight + 'px');
    
    .left-btn, .right-btn {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
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
      font-size: 34rpx;
      font-weight: bold;
      color: #fff;
      text-align: center;
      width: 300rpx;
      line-height: 90rpx;
      height: 90rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  
  .date-tabs {
    display: flex;
    background-color: #fff;
    padding: 20rpx 0;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    margin-top: v-bind((statusBarHeight + 90) + 'px');
    
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
    
    /* 景点图片展示 */
    .scenic-image {
      position: relative;
      width: 100%;
      height: 360rpx;
      
      image {
        width: 100%;
        height: 100%;
      }
      
      .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120rpx;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      }
      
      .image-title {
        position: absolute;
        bottom: 20rpx;
        left: 20rpx;
        right: 20rpx;
        
        text {
          color: #fff;
          font-size: 32rpx;
          font-weight: bold;
          display: block;
          line-height: 1.4;
          text-shadow: 0 1rpx 3rpx rgba(0,0,0,0.5);
        }
        
        .location-tag {
          display: inline-flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 30rpx;
          padding: 8rpx 16rpx;
          margin-top: 16rpx;
          backdrop-filter: blur(5rpx);
          
          .iconfont {
            font-size: 24rpx;
            color: #fff;
            margin-right: 6rpx;
          }
          
          text:last-child {
            font-size: 24rpx;
            font-weight: normal;
          }
        }
      }
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 30rpx 20rpx;
      border-bottom: 1rpx solid #f5f5f5;
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
    
    .project-list {
      background-color: #fff;
      border-radius: 16rpx;
      margin: 20rpx;
      padding: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        position: relative;
        padding-left: 20rpx;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6rpx;
          height: 30rpx;
          background-color: #bc8f56;
          border-radius: 3rpx;
        }
      }
      
      .project-item {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .project-icon {
          width: 80rpx;
          height: 80rpx;
          border-radius: 40rpx;
          background-color: rgba(188,143,86,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
          
          .iconfont {
            font-size: 40rpx;
            color: #bc8f56;
          }
        }
        
        .project-info {
          flex: 1;
          
          .project-name {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 8rpx;
          }
          
          .project-price {
            font-size: 26rpx;
            color: #999;
            line-height: 1.4;
            display: flex;
            align-items: baseline;
            margin: 6rpx 0;
            
            .price-symbol {
              font-size: 24rpx;
              color: #f56c6c;
            }
            
            text:nth-child(2) {
              font-size: 28rpx;
              color: #f56c6c;
              font-weight: bold;
              margin: 0 4rpx;
            }
            
            .price-unit {
              font-size: 24rpx;
              color: #999;
              margin-left: 8rpx;
            }
          }
          
          .project-tags {
            display: flex;
            flex-wrap: wrap;
            
            .tag-item {
              background-color: rgba(188,143,86,0.1);
              border-radius: 6rpx;
              padding: 4rpx 12rpx;
              margin-right: 10rpx;
              margin-bottom: 10rpx;
              font-size: 22rpx;
              color: #bc8f56;
            }
          }
        }
      }
      
      .no-items {
        text-align: center;
        font-size: 28rpx;
        color: #999;
        padding: 30rpx 0;
      }
    }
    
    .scenic-desc {
      background-color: #fff;
      border-radius: 16rpx;
      margin: 0 20rpx 20rpx;
      padding: 20rpx;
      box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
      
      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        position: relative;
        padding-left: 20rpx;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6rpx;
          height: 30rpx;
          background-color: #bc8f56;
          border-radius: 3rpx;
        }
      }
      
      .desc-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
        text-align: justify;
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
  
  /* 底部占位块，防止内容被底部栏遮挡 */
  .bottom-placeholder {
    width: 100%;
    height: 140rpx; /* 默认高度，会被动态计算的高度覆盖 */
    background-color: transparent;
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
    
    .pay-btn {
      width: 240rpx;
      height: 80rpx;
      border-radius: 40rpx;
      background: linear-gradient(135deg, #ff7e2d, #ff4e33);
      color: #fff;
      font-size: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 15rpx rgba(255,78,51,0.4);
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.95);
        background: linear-gradient(135deg, #ff4e33, #e54430);
      }
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
  
  /* 订单信息 */
  .order-info-section {
    background-color: #fff;
    border-radius: 16rpx;
    margin: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      position: relative;
      padding-left: 20rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 30rpx;
        background-color: #bc8f56;
        border-radius: 3rpx;
      }
    }
    
    .order-info-item {
      display: flex;
      justify-content: space-between;
      padding: 15rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-size: 28rpx;
        color: #666;
      }
      
      .value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }
  
  /* 支付方式 */
  .payment-section {
    background-color: #fff;
    border-radius: 16rpx;
    margin: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
    
    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      position: relative;
      padding-left: 20rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 30rpx;
        background-color: #bc8f56;
        border-radius: 3rpx;
      }
    }
    
    .payment-options {
      display: flex;
      flex-direction: column;
    }
    
    .payment-option {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.active {
        background-color: rgba(188,143,86,0.05);
      }
      
      .payment-icon {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        font-size: 40rpx;
      }
      
      .payment-name {
        flex: 1;
        font-size: 30rpx;
        color: #333;
      }
      
      .payment-check {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: #bc8f56;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style> 