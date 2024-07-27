<template>
	<view>
		<image src="../../static/images/charginBg@2x(1).png" class="bg"></image>
		<view v-if="chargeInfo.contents" class="scheduleBox flex">
			<view class="one" v-if="show">{{chargeInfo.contents.currentSoc}}</view>
			<view class="two">%</view>
		</view>
		<view class="estimatedTime" v-if="show && chargeInfo.contents.chargingedRemainingTime>=60000">预计还需要
			{{chargeInfo.contents.chargingedRemainingTime / 60000}}分钟 完成
		</view>
		<view class="estimatedTime" v-if="show && chargeInfo.contents.chargingedRemainingTime<60000">
			剩余时间估算中..
		</view>
		<view v-if="chargeInfo.contents" class="ChargingInfo">
			<view class="powerBox">
				<view class="title">充电功率</view>
				<view class="power">
					<view class="num" v-if="show">{{(chargeInfo.contents.chargingPower / 1000).toFixed(1)}}</view>
					<view class="unit">KW</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="ampereBox">
				<view class="ampereBoxItem">{{chargeInfo.contents.chargingVolt}}<text style="font-size: 24rpx;">V</text>
				</view>
				<view class="ampereBoxItem" style="margin-top: 20rpx;">{{chargeInfo.contents.chargingAmpere}}<text
						style="font-size: 24rpx;">A</text>
				</view>
			</view>
		</view>
		<view v-if="chargeInfo.contents" class="flex moneyBox flex-col-center" style="margin-top: 108rpx;">
			<view class="title">充电时间</view>
			<view class="num" v-if="show">{{chargeInfo.contents.chargingedTime / 60000}}</view>
			<view class="unit">分钟</view>
		</view>

		<view v-if="chargeInfo.contents" class="flex moneyBox flex-col-center" style="margin-top: 66rpx;">
			<view class="title">充电度数</view>
			<view class="num" v-if="show">{{chargeInfo.contents.chargingedKwh}}</view>
			<view class="unit">度</view>
		</view>

		<view v-if="chargeInfo.contents" class="flex moneyBox flex-col-center" style="margin-top: 66rpx;">
			<view class="title">充电费用</view>
			<view class="num" v-if="show">
				{{chargeInfo.contents.chargingUseLog.chargingFee + chargeInfo.contents.chargingUseLog.serviceFee}}
			</view>
			<view class="unit">元</view>
		</view>

		<view v-if="chargeInfo.contents" class="endChargingBox" @click="stopCharge">
			结束充电
		</view>
		<view v-if="!chargeInfo.contents" class="endChargingBox">
			数据同步中，请稍等...
		</view>
		<!-- 

		<u-mask :show="!show" @click="show = false" class="flex flex-row-center flex-col-center">
			<view class="flex-col flex-row-center flex-col-center" style="width: 100%;height: 100%;">
				<u-loading mode="flower" size="66"></u-loading>
				<view style="color: #fff;margin-top: 6rpx;">加载中</view>
			</view>
		</u-mask> -->



	</view>
</template>

<script>
	import {
		getMinChatLinkCountsServiceIp,
		getPortRealTimeData,
		stopChargingApi
	} from '../../network/api.js'
	import {
		wsURL
	} from '../../common/config.js'

	var Interval = null
	export default {
		data() {
			return {
				info: {},
				chargeInfo: {},
				show: false,
				orderInfo: {},
				chargeid: ''
			}
		},
		onLoad(e) {
			this.chargeid = e.chargeid
			this.getWsUrl()
		},
		onHide() {
			uni.closeSocket();
			clearInterval(Interval)
		},
		onUnload() {
			uni.closeSocket();
			clearInterval(Interval)
		},
		methods: {
			async getInfo() {
				var {
					code,
					message,
					data
				} = await this.$u.api.getChargingOrderByUesLogId({
					id: uni.getStorageSync('charingId')
				})
				// console.log(data);
				if (code === 10002) {
					this.orderInfo = data
				}
			},
			getTime(chargingPower, chargingedKwh) {
				return ((this.orderInfo.planChargingKwh - chargingedKwh) / (chargingPower / 1000)).toFixed(1)
				// （（计划 - 已充） / 功率） * 60
			},
			getPercent(total) {
				var num = parseFloat(this.chargeInfo.contents.chargingedKwh);
				total = parseFloat(total);
				if (isNaN(num) || isNaN(total)) {
					return "-";
				}
				return total <= 0 ? "0" : ((num / total * 100).toFixed(2));
			},
			async stopCharge() {
				var _this = this
				uni.showModal({
					title: '提示',
					content: '是否结束充电?',
					success: async function(res) {
						if (res.confirm) {
							const {
								data,
								code,
								message
							} = await stopChargingApi({
								chargingUseLogId: _this.chargeid,
							})
							if (code === 10002) {
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								})
								setTimeout(function() {
									uni.navigateBack()
								}, 1500);
							} else {
								uni.showToast({
									title: message,
									icon: 'none'
								})
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async notificationDendMessage() {
				var {
					data,
					code,
					message
				} = await getPortRealTimeData({
					chargingUseLogId: this.chargeid
				})
			},
			async getWsUrl() {
				var {
					data,
					code,
					message
				} = await getMinChatLinkCountsServiceIp()
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
				// uni.showLoading({
				// 	mask:true,
				// 	title:'连接中~'
				// })
				uni.connectSocket({
					url: wsURL+'/ws',
					success: e => {
						// console.log(e);
					},
					fail: (e) => {
						console.log(e);
					}
				});
				uni.onSocketOpen(function(res) {
					socketOpen = true;
					console.log('WebSocket连接已打开！');
					_.notificationDendMessage()
					sendSocketMessage()
				});
				uni.onSocketError(function(res) {
					console.log(res);
					uni.showToast({
						title: '连接打开失败，请检查！',
						icon: 'none'
					})
				});
				uni.onSocketClose(function(res) {
					// uni.showToast({
					// 	title: '连接断开',
					// 	icon: 'none'
					// })
					// setTimeout(()=>{
					//  uni.navigateBack()
					// },1500)
				});
				uni.onSocketMessage(function(res) {
					// console.log('收到服务器内容：' + res.data);
					var info = JSON.parse(res.data).cfUserMessage
					info.contents = JSON.parse(info.contents)
					_.chargeInfo = info
					uni.hideLoading()
					_.show = true
				});
				const sendSocketMessage = () => {
					let message = _.initNullMessagePojo();
					message.type = "create_link";
					uni.sendSocketMessage({
						data: JSON.stringify(message)
					});
					Interval = setInterval(() => {
						let _message = _.initNullMessagePojo();
						_message.type = "heartbeat_check";
						uni.sendSocketMessage({
							data: JSON.stringify(_message)
						});
					}, 30000);
				}
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #488CF5;
		width: 750rpx;
	}

	.endChargingBox {
		width: 670rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		border: 2rpx solid #FFFFFF;
		margin: 170rpx 0 0 40rpx;
		font-size: 40rpx;
		font-weight: 500;
		color: #488CF5;
		line-height: 100rpx;
		text-align: center;
	}

	.moneyBox {
		margin-left: 80rpx;

		.title {
			height: 32rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: #FFFFFF;
			line-height: 32rpx;
		}

		.num {
			height: 66rpx;
			font-size: 48rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 66rpx;
			margin-left: 52rpx;
			margin-right: 16rpx;
		}

		.unit {
			height: 34rpx;
			font-size: 24rpx;

			font-weight: 400;
			color: #FFFFFF;
			line-height: 34rpx;
		}
	}

	.ChargingInfo {
		margin: 64rpx 0 0 80rpx;
		display: flex;

		.ampereBox {
			display: flex;
			flex-direction: column;
			margin-left: 30rpx;

			.ampereBoxItem {
				width: 90rpx;
				height: 44rpx;
				font-size: 32rpx;

				font-weight: 400;
				color: #FFFFFF;
				line-height: 44rpx;
			}
		}

		.line {
			width: 2rpx;
			height: 96rpx;
			background: #FFFFFF;
			margin-left: 24rpx;
			margin-top: 10rpx;
		}

		.powerBox {
			display: flex;
			flex-direction: column;

			.power {
				display: flex;
				margin-top: 8rpx;

				.num {
					height: 66rpx;
					font-size: 48rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 66rpx;
				}

				.unit {
					width: 42rpx;
					height: 34rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 34rpx;
					margin-left: 10rpx;
					margin-top: 8rpx;
				}
			}

			.title {
				width: 132rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 44rpx;
			}
		}
	}

	.estimatedTime {
		width: 400rpx;
		height: 32rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 32rpx;
		margin: 14rpx 0 0 80rpx;
	}

	.scheduleBox {
		margin: 106rpx 0 0 80rpx;
		align-items: flex-start;

		.one {
			height: 140rpx;
			font-size: 120rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 140rpx;
			letter-spacing: 2rpx;
		}

		.two {
			width: 42rpx;
			height: 56rpx;
			font-size: 40rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 56rpx;
			margin-top: 14rpx;
		}
	}

	.bg {
		position: fixed;
		top: 150rpx;
		right: 0;
		width: 318rpx;
		height: 760rpx;
	}
</style>