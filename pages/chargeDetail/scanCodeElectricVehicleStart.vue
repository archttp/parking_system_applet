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
					充电金额
				</view>
				<view style="width: 670rpx;height: 2rpx;background: #EAEAEA;"></view>
				<input v-model="inputAccount" type="number" placeholder="请输入充电金额" class="chargeInputBox bb">
			</view>
			<view class="timeBox" style="height: 210rpx;">
				<view class="title" >车牌号</view>
				<input @focus="plateShow = true" v-model="plateNo" type="text" placeholder="点击选择" class="chargeInputBox bb">
			</view>
			<view class="balanceBox">
				<view class="title">账户余额</view>
				<view class="num">{{account}}元</view>
				<view class="recharge" @click="intoRecharge">充值</view>
			</view>
			<view class="balanceBox">
				<view class="title">电卡余额</view>
				<view class="num">{{storedCardBalance}}元</view>
				<view v-if="storedCardCount>0" class="recharge" @click="intoStoredCardRecharge">充值</view>
				<view v-if="storedCardCount==0" class="recharge" @click="applyNewStoredCard">申卡</view>
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
		<plate-input v-if="plateShow" :plate="plateNo" @close="plateShow=false" @export="setPlate"></plate-input>
	</view>
</template>

<script>
	import {
		cfChargingStationGetInfoById,
		getChargeRulesListByQuery,
		cfDeviceGet,
		startChargingApi,
		cfAccountGet,
		getChargingStoredCardListByQuery
	} from '../../network/api.js'
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				plateShow: false,
				pageMetaShow: false,
				show: false,
				deviceIndex: '',
				port: '',
				chargingRules: [],
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
				inputAccount: '',
				account: 0,
				portId: '',
				storedCardId: 0,
				storedCardBalance: 0,
				storedCardCount: 0,	//充电卡数量
				inputAccount: '',
				plateNo: ''
			}
		},
		onLoad(e) {
			this.chargeId = e.chargeId
			if (e.portId) {
				this.portId = e.portId
			}
			this.getChargeInfo()
			this.getChargingRules()

		},
		onShow() {
			this.cfAccountGetFn()
			this.cfChargingStoredCardGetFn()
		},
		methods: {
			setPlate(e) {
				this.plateNo = e;
				this.plateShow = false;
			},
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
			findBalanceByScoreType(arr, scoreType) {
				for (const obj of arr) {
					if (obj.scoreType === scoreType) {
						return obj.balance;
					}
				}
				return null;
			},
			async cfAccountGetFn() {
				const {
					data,
					code,
					message
				} = await cfAccountGet()
				if (code == 10002) {
					this.account = this.findBalanceByScoreType(data, 'cny')
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			//获取电卡数据
			async cfChargingStoredCardGetFn() {
				const {
					data,
					code,
					message,
					total
				} = await getChargingStoredCardListByQuery({
					page: 1,
					size: 10,
					chargingStationId: this.chargeId
				})
				if (code == 10002) {
					this.storedCardId = data[0].id;
					this.storedCardBalance = data[0].amountBalance;
					this.storedCardCount = total;
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
				console.log(data, code);
				if (code == 10002) {
					this.chargingRules = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			async intoPay() {

				if (!this.plateNo) {
					uni.showToast({
						title: '请输入车牌，方便停车抵扣',
						icon: 'none'
					})
					return
				}

				let _platform = '';
				let _provider = '';
				// #ifdef MP-WEIXIN
				_platform = 'wx_mp';
				_provider = 'wxpay';
				// #endif
				// #ifdef MP-ALIPAY
				_platform = 'ali_mp';
				_provider = 'alipay';
				// #endif
				const {
					data,
					code,
					message
				} = await startChargingApi({
					numberPlate: this.plateNo,
					chargingFee: this.inputAccount,
					chargingPortId: this.portId,
					platform: _platform
				})
				if (code === 10002) {
					if(data.unifiedOrderData){
						uni.requestPayment({
							provider: _provider,
							timeStamp: data.unifiedOrderData.timeStamp,
							nonceStr: data.unifiedOrderData.nonceStr,
							package: data.unifiedOrderData.package,
							signType: data.unifiedOrderData.signType,
							paySign: data.unifiedOrderData.paySign,
							success: function(res) {
								if (res.errMsg == 'requestPayment:ok') {
									uni.reLaunch({
										url: '/pages/chargeDetail/order'
									})
								}
							},
							fail: function(err) {
								uni.showToast({
									title: err,
									icon: 'none'
								})
							}
						});
					}else{
						uni.showToast({
							title: '开始充电',
							icon: 'success'
						})
						setTimeout(function() {
							uni.reLaunch({
								url: '/pages/chargeDetail/order'
							})
						}, 1500);
					}
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
			applyNewStoredCard() {
				uni.navigateTo({
					url: '/packageMy/my/chargingStoredValueCard'
				})
			},
			//进入充电卡充值
			intoStoredCardRecharge() {
				uni.navigateTo({
					url: '/packageMy/my/chargingStoredValueCard?storedCardId=' + this.storedCardId
				});
			}
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

	.chargeInputBox {
		width: 622rpx;
		height: 88rpx;
		background: rbga(245, 247, 251, .7);
		border-radius: 10rpx;
		width: 90%;
		margin: 16rpx 0 0 5%;
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

		.timeBox {
			width: 670rpx;
			height: 210rpx;
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