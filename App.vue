<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获取系统信息
			this.getSystemInfo()
			// 监听网络状态
			this.listenNetworkStatus()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onError: function(err) {
			// 捕获应用级别的错误
			console.error('应用错误:', err)
			
			// 修复语法错误的处理
			if (err && err.toString().includes('SyntaxError')) {
				console.log('检测到语法错误，尝试修复...')
				// 这里可以添加特定的错误处理逻辑
			}
		},
		methods: {
			// 获取系统信息
			getSystemInfo() {
				try {
					const systemInfo = uni.getSystemInfoSync()
					console.log('系统信息:', systemInfo)
					// 存储系统信息
					getApp().globalData = getApp().globalData || {}
					getApp().globalData.systemInfo = systemInfo
				} catch (e) {
					console.error('获取系统信息失败:', e)
				}
			},
			// 监听网络状态
			listenNetworkStatus() {
				uni.getNetworkType({
					success: (res) => {
						if (res.networkType === 'none') {
							this.showNetworkToast('当前网络不可用，请检查网络设置')
						}
					}
				})
			},
			// 显示网络提示
			showNetworkToast(message) {
				uni.showToast({
					title: message,
					icon: 'none',
					duration: 3000
				})
			}
		}
	}
</script>

<style>
	/* 引入第三方图标字体，实际使用时需要替换为正确的CDN地址 */
	@import url("https://at.alicdn.com/t/font_2878562_8l21pdf3xv.css");
	
	/* 隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
	
	/* 全局样式 */
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
			Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
			sans-serif;
		color: #333;
		font-size: 28rpx;
		background-color: #f5f5f5;
	}
	
	/* 公共颜色变量 */
	:root {
		--primary-color: #bc8f56;
		--bg-color: #f5f5f5;
		--text-color: #333;
		--text-color-light: #999;
		--border-color: #eee;
	}
	
	/* 清除默认样式 */
	image {
		display: block;
		will-change: transform;
	}
	
	/* 通用容器 */
	.container {
		width: 100%;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	/* 通用文本省略 */
	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	/* 多行文本省略 */
	.ellipsis-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	
	/* 通用圆角 */
	.rounded {
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	/* 通用阴影 */
	.shadow {
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
	}
	
	/* 通用图标基础样式 */
	.iconfont {
		font-family: "iconfont" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	/* 临时使用的图标类 */
	.icon-ticket:before { content: "\e648"; }
	.icon-show:before { content: "\e652"; }
	.icon-hotel:before { content: "\e62f"; }
	.icon-leisure:before { content: "\e626"; }
	.icon-food:before { content: "\e60a"; }
	.icon-parent:before { content: "\e61a"; }
	.icon-souvenir:before { content: "\e620"; }
	.icon-tour:before { content: "\e63c"; }
	.icon-home:before { content: "\e608"; }
	.icon-map:before { content: "\e60c"; }
	.icon-smart:before { content: "\e646"; }
	.icon-user:before { content: "\e607"; }
	.icon-back:before { content: "\e679"; }
	.icon-share:before { content: "\e66f"; }
	.icon-collect:before { content: "\e665"; }
	.icon-right:before { content: "\e6a3"; }
	.icon-more:before { content: "\e684"; }
	.icon-calendar:before { content: "\e6a5"; }
	.icon-search:before { content: "\e602"; }
	.icon-navigation:before { content: "\e60c"; }
	.icon-add:before { content: "\e767"; }
	.icon-minus:before { content: "\e765"; }
	.icon-location:before { content: "\e650"; }
	.icon-3d:before { content: "\e603"; }
	.icon-2d:before { content: "\e601"; }
	.icon-info:before { content: "\e6e5"; }
	.icon-close:before { content: "\e668"; }
	.icon-target:before { content: "\e651"; }
	.icon-park:before { content: "\e652"; }
	.icon-board:before { content: "\e7b0"; }
	.icon-panorama:before { content: "\e606"; }
</style>
