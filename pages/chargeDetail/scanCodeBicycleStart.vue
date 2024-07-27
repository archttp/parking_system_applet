<template>
	<page-meta :page-style="'overflow:'+(pageMetaShow?'hidden':'visible')"></page-meta>
	<view>
		<view class="nameBox">
			<view class="name single-line">{{changeInfo.stationName}}</view>
			<view class="flex addressBox"
				@click="openMap(changeInfo.positionY,changeInfo.positionX,changeInfo.stationName,changeInfo.address)">
				<image class='icon' src="../../static/images/clock.png" style="width: 32rpx;height: 32rpx;">
				</image>
				<view class="address single-line">00:00:00-24:00:00</view>
			</view>
			<view class="flex addressBox"
				@click="openMap(changeInfo.positionY,changeInfo.positionX,changeInfo.stationName,changeInfo.address)"
				style="margin-top: 18rpx;">
				<image class='icon' src="../../static/images/Positioning.png" style="width: 32rpx;height: 32rpx;">
				</image>
				<view class="address single-line">{{changeInfo.address}}</view>
			</view>
			<image src="../../static/images/Navigationicon2x.png" class="navIcon"
				@click="openMap(changeInfo.positionY,changeInfo.positionX,changeInfo.stationName,changeInfo.address)">
			</image>
		</view>
		<view class="infoBox">
			<view class="timeBox">
				<view class="title">
					充电时长
				</view>
				<view style="width: 670rpx;height: 2rpx;background: #EAEAEA;"></view>
				<view class="" style="display: flex;flex-wrap: wrap;justify-content: space-evenly;">
					<view :class="timeIndex === index ? 'timeOption redBorder' : 'timeOption'"
						v-for="(item,index) in timeArr" :key='item.time' @click="setTimeIndex(index)">
						<image src="../../static/images/shandianBg@2x.png" class="bg"></image>
						<view class="content">
							<view class="left">{{item.time}}</view>
							<view class="right">{{item.price}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="balanceBox">
				<view class="title">账户余额</view>
				<view class="num">{{account}}元</view>
				<view class="recharge" @click="intoRecharge">充值</view>
			</view>
			<view class="illustrateBox">
				<view class="title">
					收费说明
				</view>
				<view style="width: 670rpx;height: 2rpx;background: #EAEAEA;"></view>
				<!-- <view class="text">充电每小时<span style='color:#488CF5'>{{chargingRules[0].fee}}元</span></view> -->
				<view class="feeBox_item1 bb flex flex-col-center">
					<view style="margin-left: 32rpx;">
						收费时段
					</view>
					<view style="margin-left: 156rpx;">充电费</view>
					<view style="margin-left: 26rpx;">=</view>
					<view style="margin-left: 34rpx;">电费</view>
					<view style="margin-left: 50rpx;">服务费</view>
				</view>
				<view class="feeBox_item2 bb flex flex-col-center" v-for="item in chargingRules" :key="item.id">
					<view style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 24rpx;">
						{{ item.startTimeString + ' - ' + item.endTimeTimeString }}
					</view>
					<view
						style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 62rpx;width: 60rpx;text-align: center;">
						{{item.fee + item.serviceFee}}
					</view>
					<view
						style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 72rpx;width: 60rpx;text-align: center;">
						{{item.fee}}
					</view>
					<view
						style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 56rpx;width: 60rpx;text-align: center;">
						{{item.serviceFee}}
					</view>
				</view>
			</view>
		</view>
		<image class="selectionperiod" src="../../static/images/start.png" @click="intoPay"></image>

		<!-- #ifdef MP-WEIXIN -->
		<button v-if="!isLogin" @click="wxLogin" class='free-btn-bordernone'
			style='width:100%;height:100%;top:0;left:0;z-index:99999;position: fixed;'>
		</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		cfChargingStationGetInfoById,
		getChargeRulesListByQuery,
		cfDeviceGet,
		startChargingApi,
		cfAccountGet
	} from '../../network/api.js'
	export default {
		data() {
			return {
				pageMetaShow: false,
				show: false,
				port: '',
				portIndex: '',
				timeIndex: '',
				chargingRules: [],
				timeArr: [{
						time: '120分钟',
						price: '',
						value: 7200000
					},
					{
						time: '360分钟',
						price: '',
						value: 21600000
					},
					{
						time: '480分钟',
						price: '',
						value: 28800000
					},
					{
						time: '充满即停',
						price: '',
						value: ''
					}
				],
				isLogin: false,
				code: '',
				chargeId: '',
				changeInfo: {
					name: '',
					address: '',
					freeTime: '',
					parkingSpaceNumber: '',
					usedParkingSpaceNumber: '',
					distance: 0,
					freeParkTime: 0,
					usedFastChargeNumber: 0,
					fastChargeNumber: 0,
					usedSlowChargeNumber: 0,
					slowChargeNumber: 0,
				},
				account: 0,
				portId: ''
			}
		},
		onLoad(e) {
			this.chargeId = e.chargeId
			if (e.portId) {
				this.portId = e.portId
			}
			this.getChargeInfo()
			this.getChargingRules()
			this.cfAccountGetFn()
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
			if (uni.getStorageSync('token')) {
				this.isLogin = true
			} else {
				this.isLogin = false
				uni.showToast({
					title: '请点击任意位置登录',
					icon: 'none'
				})
			}
		},
		methods: {
			openMap(latitude, longitude, name, address) {
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name,
					address: address,
					success: function() {
						console.log('success');
					}
				});
			},
			async cfAccountGetFn() {
				const {
					data,
					code,
					message
				} = await cfAccountGet()
				if (code == 10002) {
					this.account = data[0].balance
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			async getChargeInfo() {
				const {
					data,
					code
				} = await cfChargingStationGetInfoById({
					id: this.chargeId
				})
				console.log(data, code);
				if (code == 10002) {
					this.changeInfo = data
				} else {
					uni.showToast({
						title: '获取详情失败',
						icon: 'none'
					})
					setTimeout(function() {
						uni.navigateBack()
					}, 1500);
				}
			},
			getCode() {
				wx.login({
					success: (res) => {
						console.log(res);
						this.code = res.code
					}
				})
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
						var loginRes = await this.$u.api.wxLogin(data)
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
							uni.setStorageSync('wxauthed', true)
							uni.setStorageSync('user', loginRes.data)
							uni.setStorageSync('token', loginRes.token.jwt_token)
							this.$u.vuex('vuex_token', loginRes.token.jwt_token)
							this.$u.vuex('vuex_user', loginRes.data)
							this.getInfo(this.id)
							this.getList()
							this.getChargingRules(this.id)
						} else {
							this.$u.toast('登陆出错')
						}
					}
				})
			},
			// 获取充电站收费规则
			async getChargingRules() {
				const {
					data,
					code,
					message
				} = await getChargeRulesListByQuery({
					chargingStationId: this.chargeId,
					page: 1,
					size: 100
				})
				if (code == 10002) {
					this.chargingRules = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			setTimeIndex(index) {
				this.timeIndex = index
			},
			async intoPay(item, index) {
				if ((typeof this.timeIndex) == 'string') {
					uni.showToast({
						title: '请选择充电时长',
						icon: 'none'
					})
					return
				}
				const {
					data,
					code,
					message
				} = await startChargingApi({
					chargingPortId: this.portId,
					chargingTime: this.timeArr[this.timeIndex].value
				})
				if (code === 10002) {
					uni.showToast({
						title: '开始充电',
						icon: 'success'
					})
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/chargeDetail/order'
						})
					}, 1500);
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			intoRecharge() {
				uni.navigateTo({
					url: '/packageMy/my/recharge'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
	}

	.feeBox_item1 {
		width: 622rpx;
		height: 70rpx;
		background: rgba(103, 148, 246, 0.1);
		border-radius: 8rpx;
		border: 2rpx solid #6794F6;
		margin-top: 24rpx;
		font-size: 24rpx;
		color: #6794F6;
		font-weight: 400;
		margin-left: 26rpx;
		// padding: 20rpx 24rpx 16rpx 24rpx;
	}

	.feeBox_item2 {
		width: 622rpx;
		height: 70rpx;
		background: #F8F8F8;
		border-radius: 8rpx;
		margin-top: 28rpx;
		margin-left: 26rpx;
		// padding: 20rpx 24rpx;
	}

	.selectionperiod {
		width: 630rpx;
		height: 200rpx;
		position: fixed;
		left: 64rpx;
		bottom: 0;
	}

	.infoBox {
		position: absolute;
		top: 238rpx;
		left: 40rpx;
		padding-bottom: 300rpx;

		.portBox {
			width: 670rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			.title {
				width: 128rpx;
				height: 88rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 88rpx;
				margin-left: 40rpx;
			}

			.portScroll {
				width: 590rpx;
				margin-left: 40rpx;

				.portItem {
					display: inline-block;
					width: 140rpx;
					height: 140rpx;
					background-size: 100% 100%;
					margin-right: 24rpx;
					font-size: 64rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: rgba(72, 140, 245, 0.5);
					line-height: 140rpx;
					text-align: center;
				}

				.portItem_red {
					@extend .portItem;
					color: #FF7B7B;
				}

				.aliasName {
					height: 88rpx;
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #323233;
					line-height: 88rpx;
				}

				.portName {
					height: 52rpx;
					background: rgba(72, 140, 245, .2);
					border-radius: 200rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #488CF5;
					text-align: center;
					margin-left: 16rpx;
					padding: 14rpx 24rpx;
					margin-top: 18rpx;
				}
			}
		}

		.timeBox {
			width: 670rpx;
			height: 474rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 24rpx;

			.title {
				width: 128rpx;
				height: 88rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 88rpx;
				margin-left: 40rpx;
			}

			.redBorder {
				border: 2rpx solid #4F93F6 !important;
			}

			.timeOption {
				width: 276rpx;
				height: 144rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				border: 2rpx solid rgba(151, 151, 151, 0.08);
				overflow: hidden;
				position: relative;
				margin-top: 30rpx;
				align-items: center;
				display: flex;

				.bg {
					width: 106rpx;
					height: 170rpx;
					position: absolute;
					left: 28rpx;
					bottom: -38rpx;
				}

				.content {
					justify-content: space-around;
					width: 100%;
					display: flex;

					.left {
						height: 48rpx;
						font-size: 34rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #323233;
						line-height: 48rpx;
					}

					.right {
						width: 72rpx;
						height: 48rpx;
						font-size: 34rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #FF5151;
						line-height: 48rpx;
						text-align: right;
					}
				}
			}
		}

		.typeBox {
			width: 668rpx;
			height: 100rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 24rpx;
		}

		.balanceBox {
			width: 668rpx;
			height: 100rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 24rpx;
			display: flex;
			align-items: center;

			.title {
				width: 128rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				margin-left: 38rpx;
			}

			.num {
				width: 348rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				text-align: right;
			}

			.recharge {
				width: 96rpx;
				height: 52rpx;
				background: #488CF5;
				border-radius: 200rpx;
				background: #488CF5;
				border-radius: 200rpx;
				line-height: 52rpx;
				text-align: center;
				color: #FFFFFF;
				margin-left: 18rpx;
			}
		}

		.illustrateBox {
			width: 668rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			margin-top: 24rpx;
			padding-bottom: 32rpx;

			.title {
				width: 128rpx;
				height: 88rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 88rpx;
				margin-left: 40rpx;
			}

			.text {
				width: 590rpx;
				height: 168rpx;
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 42rpx;
				margin: 36rpx 0 0 26rpx;
			}
		}
	}

	.nameBox {
		background-image: url('http://file.cfeng.wang/parkInfoBG2x.png');
		width: 750rpx;
		height: 288rpx;
		background-size: 100% 100%;
		overflow: hidden;
		position: relative;

		.navIcon {
			width: 160rpx;
			height: 160rpx;
			position: absolute;
			right: 48rpx;
			bottom: -25rpx;
			z-index: 1;
		}

		.name {
			width: 670rpx;
			height: 40rpx;
			font-size: 40rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 40rpx;
			margin: 58rpx 0 0 40rpx;
		}

		.addressBox {
			margin-top: 20rpx;

			.icon {
				margin-left: 46rpx;
			}

			.address {
				margin-left: 8rpx;
				width: 463rpx;
				height: 40rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 40rpx;
			}
		}
	}
</style>