<template>
	<div>
		<view class="currentBalanceBox">
			<view class="num">当前余额：{{balance}}</view>
			<view class="recharge" @click="intoRecharge">立即充值</view>
		</view>
		<view class="inputBox">
			<view class="flex top">
				<view class="times">
					当前计费时段：{{(currentPrice.startTimeString || '') + ' - ' + (currentPrice.endTimeTimeString || '')}}
				</view>
				<view class="pirce">当前电价:{{(currentPrice.fee + currentPrice.serviceFee) || ''}}</view>
			</view>


			<input type="text" v-model="chargeNum" placeholder="请输入充电金额" placeholder-class="pirceInputPlaceholder"
				class="pirceInput" />
			<!-- <view class="expectBox"> -->
			<!-- <view class="left">需支付:{{chargeNum}}</view> -->
			<!-- {{((chargeNum / (currentPrice[0].serviceFee + currentPrice[0].fee) / power) * 1000).tofixed(2)}} -->
			<!-- <view class="right">预计充电时长：{{getExpectedChargingTime(currentPrice.serviceFee + currentPrice.fee)}} -->
			<!-- </view> -->
		</view>
		</view>
		<view class="flex trip">
			<view class="left">停车优惠</view>
			<view class="right">充电免停{{(chargeInfo.freeParkTime / 60000) || 0}}分钟</view><!-- ，超时收费3元/小时 -->
		</view>

		<view class="payButton" :style="chargeNum > 0 ? 'opacity: 1;' : ''" @click="onPay">立即支付</view>
		<view class="pirceDetail" @click="showPircePopup">价格详情</view>

		<!-- 价格详情popop -->
		<uni-popup ref="pircePopup">
			<view class="popupBox bb">
				<view class="title">价格详情</view>
				<view class="pirceItem" :style="item.status ? 'background: rgba(72, 140, 245, 0.1)' : ''"
					v-for="item in rulesList" :key='item.id'>
					<view class="time">{{item.startTimeString + ' - ' + item.endTimeTimeString}}</view>
					<view class="pirce flex-col">
						<view class="pirce1">¥{{item.fee + item.serviceFee}}/度</view>
						<view class="pirce2">电费 ¥{{item.fee}} + 服务费 ¥{{item.serviceFee}}</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- <u-popup v-model="show" mode='bottom' border-radius='28' closeable>
			<view class="popupBox">
				<view class="title">价格详情</view>
				<view class="pirceItem" :style="item.status ? 'background: rgba(72, 140, 245, 0.1)' : ''"
					v-for="item in chargingRules" :key='item.id'>
					<view class="time">{{getTimeText(item.startTime) + ' - ' + getTimeText(item.endTime)}}</view>
					<view class="pirce flex-col">
						<view class="pirce1">¥{{item.fee + item.serviceFee}}/度</view>
						<view class="pirce2">电费 ¥{{item.fee}} + 服务费 ¥{{item.serviceFee}}</view>
					</view>
				</view>
			</view>
		</u-popup> -->

		<!-- 提醒popop -->
		<!-- 		<u-popup v-model="remindShow" mode='center' border-radius='28'>
			<image src="../../static/remind.png" style="width: 580rpx;height: 706rpx;" @click="remindShow = false">
			</image>
		</u-popup> -->

		<!-- 联接失败popop -->
		<!-- 		<u-popup v-model="linkFailedShow" mode='bottom' border-radius='28' closeable>
			<view class="linkFailedBox flex-col">
				<image src="../../static/linkFailed.png"></image>
				<view class="title">连接失败</view>
				<view class="content">充电枪未正确连接，请确保关门，熄火，重新拔插充电枪，并再次扫码。</view>
			</view>
		</u-popup> -->

		<!-- 支付成功popop -->
		<!-- <u-popup v-model="paymentSuccessfulShow" mode='bottom' border-radius='28' closeable>
			<view class="linkFailedBox flex-col">
				<image src="../../static/paymentSuccess.png"></image>
				<view class="title">支付成功</view>
				<view class="content1">{{times}}s 系统启动中…</view>
				<view class="content2">
					充电启动中…
				</view>
			</view>
		</u-popup> -->

		<!-- 启动失败popop -->
		<!-- <u-popup v-model="faultShow" mode='bottom' border-radius='28' closeable>
			<view class="linkFailedBox flex-col">
				<image src="../../static/Fault.png"></image>
				<view class="title">启动失败</view>
				<view class="content">启动时间已超90秒，费用将会在 5分钟内返回至您的支付账号</view>
			</view>
		</u-popup> -->


		<!-- #ifdef MP-WEIXIN -->
		<button v-if="!isLogin" class='free-btn-bordernone' @click="wxLogin"
			style='width:100%;height:100%;top:0;left:0;z-index:99999;position: fixed;'>
		</button>
		<!-- #endif -->


	</div>
</template>

<script>
	var Interval = null
	import {
		wxMpLogin,
		cfAccountGet,
		cfChargingStationGetInfoById,
		getChargeRulesListByQuery
	} from '../../network/api.js'
	import dayjs from 'dayjs'
	import {
		wxAppid
	} from '../../common/config.js'
	export default {
		data() {
			return {
				show: false,
				remindShow: false,
				linkFailedShow: false,
				paymentSuccessfulShow: false,
				faultShow: false,
				chargingStationId: '',
				chargingRules: [],
				chargingStationInfo: {},
				chargeNum: '',
				balance: 0,
				chargingPort: {},
				times: 60,
				isLogin: false,
				code: '',
				power: '',

				chargeInfo: {

				},
				rulesList: []
			}
		},
		onLoad(e) {
			console.log(e);
			// 需要一个充电站id
			// 需要充电的收费规则
			// 需要充电端口的信息
			// type=scan&chargingStationId=1481859754519396352&chargingDeviceId=1485172308581212160&portNumber=0
			// 扫码进入
			// if (e.type == 'scan') {
			// 	this.chargingPort.portNumber = e.portNumber
			// 	this.chargingPort.chargingDeviceId = e.chargingDeviceId
			// 	this.chargingStationId = e.chargingStationId
			// 	return
			// }

			// if (e.chargingRules) {
			// 	this.chargingPort = JSON.parse(e.chargingPort)
			// 	this.chargingStationId = JSON.parse(e.chargingPort).chargingStationId
			// 	this.chargingRules = JSON.parse(e.chargingRules)
			// } else {
			// 	this.chargingStationId = e.chargingStationId // 1481859754519396352
			// 	this.chargingPort.chargingDeviceId = e.chargingDeviceId // 1485172308581212160
			// 	this.chargingPort.portNumber = e.portNumber // 0
			// }
			var token = uni.getStorageSync('token')
			if (e.chargeId) {
				this.chargeId = e.chargeId
				if (token) {
					this.getChargingInfo()
					this.fenchRulesData()
				}

			}

		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
			var token = uni.getStorageSync('token')
			if (token) {
				this.getBalance()
				this.isLogin = true
			} else {
				this.isLogin = false
			}

			// this.paymentSuccessfulShow = false
			// this.faultShow = false
			// this.linkFailedShow = false
		},
		onUnload() {
			clearInterval(Interval)
		},
		computed: {
			currentPrice() {
				return this.rulesList.filter(i => i.status)[0]
			}
		},
		methods: {
			showPircePopup() {
				this.$refs.pircePopup.open('bottom')
			},
			async getChargingInfo() {
				var res = await cfChargingStationGetInfoById({
					id: this.chargeId
				})
				console.log(111, res);
				if (res.code === 10002) {
					this.chargeInfo = res.data
					uni.setNavigationBarTitle({
						title: res.data.stationName
					})
				}
			},
			async fenchRulesData() {
				const {
					data,
					code,
					message
				} = await getChargeRulesListByQuery({
					chargingStationId: this.chargeId,
					page: 1,
					size: 100
				})
				console.log(data, code);
				if (code == 10002) {
					this.getCurrentTimePrice(data)
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			getExpectedChargingTime(powerPirce) {
				return (this.chargeNum / powerPirce / this.power * 1000).toFixed(2) + '小时'
			},
			getCode() {
				wx.login({
					success: (res) => {
						console.log(res);
						this.code = res.code
					}
				})
			},
			getCurrentTimePrice(datas) {
				var arrs = datas
				var newTime = dayjs().valueOf() - dayjs().startOf('day').valueOf()
				for (let i of arrs) {
					if (newTime > i.startTime && newTime < i.endTime) {
						console.log(i);
						i.status = 1
					} else {
						i.status = 0
					}
				}
				this.rulesList = arrs
			},
			wxLogin() {
				var _ = this
				uni.showLoading({
					title: '请稍等'
				})

				uni.getUserProfile({
					desc: '保存用户数据',
					success: async ({
						iv,
						encryptedData
					}) => {
						var data = {
							iv,
							code: this.code,
							loginType: 'mp',
							encryptedData,
							appid: wxAppid
						}
						var loginRes = await wxMpLogin(data)
						console.log('登陆个人信息', loginRes)
						uni.hideLoading()
						// code 失效
						if (loginRes.code === 24017) {
							uni.showToast({
								title: 'code失效 请重试一次',
								icon: 'none'
							})
							_.getCode()
						} else if (loginRes.code == 10002) {
							this.isLogin = true
							uni.setStorageSync('user', loginRes.data)
							uni.setStorageSync('token', loginRes.token.access_token)
							this.getBalance()
							this.fenchRulesData()
							this.getChargingInfo()
						} else {
							this.$u.toast('登陆出错')
						}
					}
				})
			},
			initNullMessagePojo() {
				let cfUserMessage = {
					id: "",
					fromUid: "",
					toUid: "",
					groupId: "",
					status: 0,
					contents: "",
					type: 0,
					client: "",
					ip: "",
					createTime: 0,
					receiveTime: 0,
				};

				let message = {
					type: "create_link",
					cfUserMessage: cfUserMessage,
					ext: "",
					token: uni.getStorageSync('token'),
				};
				return message;
			},

			async onPay() {
				if (!this.chargeNum) return
				if (this.chargeNum > this.balance) {
					uni.showToast({
						title: '余额不足 请先充值',
						icon: 'none'
					})
				} else {
					var res = await this.$u.api.startCharging({
						chargingFee: this.chargeNum,
						chargingPort: this.chargingPort.portNumber,
						id: this.chargingPort.chargingDeviceId
					})
					console.log('开始充电信息', res);
					if (res.code === 10002) {
						uni.setStorageSync('charingId', res.data.id)
						Interval = setInterval(() => {
							if (this.times === 0) {
								clearInterval(Interval)
								this.paymentSuccessfulShow = false
								this.linkFailedShow = true
							}
							this.times = this.times - 1
						}, 1000)
						this.paymentSuccessfulShow = true
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}

					if (res.code == 10002) {
						this.getWsUrl()
						// uni.showToast({
						// 	title: res.message
						// })
						// uni.setStorageSync('charingId',res.data.id)
						// setTimeout(() => {
						// 	uni.navigateTo({
						// 		url: '../charging/index?datas=' + JSON.stringify(this.chargingPort)
						// 	})
						// }, 1500)
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				}
			},
			async getWsUrl() {
				var {
					data,
					code,
					message
				} = await this.$u.api.getMinChatLinkCountsServiceIp()
				console.log(data);
				if (code !== 10002) {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				} else {
					this.initWs(data)
				}
			},
			initWs(ip) {
				var _ = this
				var socketOpen = false;
				uni.connectSocket({
					url: `wss://wss.cfeng.wang/${ip}`
				});
				uni.onSocketOpen(function(res) {
					socketOpen = true;
					console.log('WebSocket连接已打开！');
					sendSocketMessage()
				});
				uni.onSocketError(function(res) {
					console.log(res);
					// uni.showToast({
					// 	title: 'WebSocket连接打开失败，请检查！',
					// 	icon: 'none'
					// })
				});
				uni.onSocketMessage(function(res) {
					console.log('收到服务器内容：' + res.data);
					var info = JSON.parse(res.data).cfUserMessage
					info.contents = JSON.parse(info.contents)
					console.log(info);
					if (info.contents.chargingStatus === 2) {
						console.log('已启动');
						uni.closeSocket();
						uni.navigateTo({
							url: '../charging/index?datas=' + JSON.stringify(_.chargingPort)
						})
					}
				});
				const sendSocketMessage = () => {
					let message = _.initNullMessagePojo();
					message.type = "create_link";
					uni.sendSocketMessage({
						data: JSON.stringify(message)
					});
					setInterval(() => {
						let _message = _.initNullMessagePojo();
						_message.type = "heartbeat_check";
						uni.sendSocketMessage({
							data: JSON.stringify(_message)
						});
					}, 500);
				}
			},
			// initNullMessagePojo() {
			// 	let cfUserMessage = {
			// 		id: "",
			// 		fromUid: "",
			// 		toUid: "",
			// 		groupId: "",
			// 		status: 0,
			// 		contents: "",
			// 		type: 0,
			// 		client: "",
			// 		ip: "",
			// 		createTime: 0,
			// 		receiveTime: 0,
			// 	};
			// 	let message = {
			// 		type: "create_link",
			// 		cfUserMessage: cfUserMessage,
			// 		ext: "",
			// 		token: uni.getStorageSync('token'),
			// 	};
			// 	return message;
			// },
			async getBalance() {
				var {
					data,
					code
				} = await cfAccountGet()
				if (code == 10002) {
					console.log(data);
					this.balance = data[0].balance
				}
			},
			getTimeText(time) {
				if (time != null) {
					return dayjs(dayjs().startOf('month').valueOf() + time).format(
						'HH:mm'
					)
				} else {
					return '-'
				}
			},
			async getInfo() {
				var res = await this.$u.api.searchChargingStation({
					id: this.chargingStationId,
				})
				console.log('充电站信息', res);
				if (res.code === 10002) {
					this.chargingStationInfo = res.data[0]
				}
			},
			intoRecharge() {
				uni.navigateTo({
					url: '../../../packageMy/my/myWallet/recharge'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
	}

	.currentBalanceBox {
		width: 750rpx;
		height: 132rpx;
		background: #FFFFFF;
		border-top: 20rpx solid #F5F5F5;
		border-bottom: 20rpx solid #F5F5F5;
		box-sizing: content-box;
		display: flex;
		justify-content: space-between;

		.num {
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 76rpx;
			margin: 28rpx 0 0 40rpx;
		}

		.recharge {
			width: 168rpx;
			height: 60rpx;
			background: #488CF5;
			border-radius: 200rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 60rpx;
			text-align: center;
			margin: 36rpx 42rpx 0 0;
		}
	}

	.linkFailedBox {
		align-items: center;

		image {
			width: 112rpx;
			height: 112rpx;
			margin-top: 48rpx;
		}

		.title {
			height: 58rpx;
			font-size: 42rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #323233;
			line-height: 58rpx;
			margin-top: 8rpx;
		}

		.content {
			width: 670rpx;
			height: 138rpx;
			background: #FAFAFA;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.7);
			line-height: 55rpx;
			margin-top: 38rpx;
			margin-bottom: 64rpx;
			padding: 20rpx;
		}

		.content1 {
			width: 258rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 44rpx;
			margin-top: 8rpx;
		}

		.content2 {
			width: 670rpx;
			height: 100rpx;
			background: #C7CCD4;
			border-radius: 16rpx;
			font-size: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 100rpx;
			margin: 32rpx 0 56rpx 0;
			text-align: center;
		}
	}

	.popupBox {
		height: 690rpx;
		background-color: #FFFFFF;
		overflow: hidden;

		.pirceItem {
			width: 670rpx;
			height: 136rpx;
			background: #F8F9FB;
			border-radius: 12rpx;
			border: 2rpx solid rgba(151, 151, 151, 0.08);
			margin-left: 42rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 40rpx;

			.pirce {
				align-items: flex-end;
				margin: 28rpx 30rpx 0 0;

				.pirce1 {
					height: 50rpx;
					font-size: 36rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: rgba(50, 50, 51, 0.8);
					line-height: 50rpx;
				}

				.pirce2 {
					width: 266rpx;
					height: 32rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #323233;
					line-height: 32rpx;
					text-align: right;
				}
			}

			.time {
				height: 50rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(50, 50, 51, 0.8);
				line-height: 50rpx;
				margin: 45rpx 0 0 32rpx;
			}
		}

		.title {
			width: 176rpx;
			height: 60rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #323233;
			line-height: 60rpx;
			margin: 40rpx;
		}
	}

	.payButton {
		width: 670rpx;
		height: 100rpx;
		background: #488CF5;
		border-radius: 16rpx;
		opacity: 0.5;
		margin: 52rpx 0 0 40rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 100rpx;
		text-align: center;
	}

	.pirceDetail {
		width: 670rpx;
		height: 100rpx;
		border-radius: 16rpx;
		border: 2rpx solid #488CF5;
		margin: 24rpx 0 0 40rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #488CF5;
		line-height: 100rpx;
		text-align: center;
	}

	.trip {
		width: 750rpx;
		height: 76rpx;
		background: #FFFFFF;
		margin-top: 20rpx;

		.left {
			width: 112rpx;
			height: 76rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 76rpx;
			margin-left: 40rpx;
		}

		.right {
			width: 452rpx;
			height: 76rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 76rpx;
			margin-left: 106rpx;
			text-align: right;
		}
	}

	.inputBox {
		width: 750rpx;
		background-color: #fff;

		.pirceInput {
			width: 670rpx;
			margin-left: 40rpx;
			height: 122rpx;
			font-weight: 500;
			font-size: 48rpx;
		}

		.pirceInputPlaceholder {
			width: 336rpx;
			height: 122rpx;
			font-size: 48rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(50, 50, 51, 0.2);
			line-height: 122rpx;
		}

		.line {
			width: 670rpx;
			height: 2rpx;
			background: #EAEAEA;
			margin-left: 40rpx;
		}

		.expectBox {
			display: flex;
			width: 670rpx;
			margin-left: 40rpx;
			height: 88rpx;
			align-items: center;
			justify-content: flex-end;

			.left {
				height: 32rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(72, 140, 245, 0.5);
				line-height: 32rpx;
			}

			.right {
				height: 32rpx;
				font-size: 26rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(72, 140, 245, 0.5);
				line-height: 32rpx;
			}
		}

		.top {
			.times {
				width: 378rpx;
				height: 76rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 76rpx;
				margin-left: 40rpx;
			}

			.pirce {
				width: 186rpx;
				height: 52rpx;
				background: rgba(255, 81, 81, 0.09);
				border-radius: 200rpx;
				font-size: 20rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FF5151;
				line-height: 52rpx;
				text-align: center;
				margin: 12rpx 0 0 106rpx;
			}
		}
	}
</style>