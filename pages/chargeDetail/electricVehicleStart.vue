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
			<view class="portBox">
				<view class="title">
					充电设备
				</view>
				<view style="width: 670rpx;height: 2rpx;background: #EAEAEA;"></view>

				<view class="portScroll">
					<view @click='changeDeviceIndex(index)'
						style="width: 590rpx;height: 88rpx;display: flex;justify-content: space-between;align-items: center;border-bottom:2rpx solid #EAEAEA;"
						v-for="(item,index) in deviceList" :key='item.id'>
						<view style="display: flex;">
							<view class="aliasName">{{item.deviceName}}</view>
							<!-- <view class="portName" v-if="port">{{port.portNumber}}号口</view> -->
						</view>
						<image src="../../static/images/weixuanzhong@2x.png" style="width:28rpx;height:28rpx"
							v-if="deviceIndex !== index"></image>
						<image src="../../static/images/xuanzhong.png" style="width:28rpx;height:28rpx"
							v-if="deviceIndex === index"></image>
					</view>
				</view>
			</view>
			<view class="timeBox" style="height: 210rpx;">
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
		<image class="selectionperiod" src="../../static/images/start.png" @click="showPort"></image>


		<uni-popup ref="popup" @change="popupChange">
			<view class="popupBox">
				<view class="title">选择充电枪</view>
				<scroll-view scroll-y="true" style="width: 100%;height:400rpx">
					<view>
						<view class="infoBox2 flex-col" v-for="(item,index) in chargingPortList" :key='item.id'>
							<view class="title1">{{item.portNo}}号枪</view>
							<view class="startUp1" @click="intoPay(item,index)" v-if="item.status === 0">
								选择
							</view>
							<view class="startUp1" @click="intoPay(item,index)" v-if="item.status === 1">
								已连接
							</view>
							<view class="startUp1" v-if="item.status === 2" style="color: #FF5151;background: #FFEDED;">
								正在充电
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!-- #ifdef MP-WEIXIN -->
		<button v-if="!isLogin" @click="wxLogin" class='free-btn-bordernone'
			style='width:100%;height:100%;top:0;left:0;z-index:99999;position: fixed;'>
		</button>
		<!-- #endif -->

		<bindPhonePopup ref="bindPhonePopupRef" @closePhoneShow='closePhoneShow' />
		<plate-input v-if="plateShow" :plate="plateNo" @close="plateShow=false" @export="setPlate"></plate-input>

	</view>
</template>

<script>
	import {
		cfChargingStationGetInfoById,
		getChargeRulesListByQuery,
		cfDeviceGet,
		getChargingPortListByQuery,
		startChargingApi,
		cfAccountGet,
		getChargingStoredCardListByQuery
	} from '../../network/api.js'
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	import bindPhonePopup from '../../components/bindPhonePopup/index.vue'

	export default {
		components: {
			bindPhonePopup,
			plateInput
		},
		data() {
			return {
				plateShow: false,
				pageMetaShow: false,
				deviceList: [],
				show: false,
				chargingPortList: [],
				deviceIndex: '',
				port: '',
				portIndex: '',
				timeIndex: '',
				chargingRules: [],
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
				storedCardId: 0,
				storedCardBalance: 0,
				storedCardCount: 0,	//充电卡数量
				inputAccount: '',
				plateNo: ''
			}
		},
		onLoad(e) {
			this.chargeId = e.chargeId
			this.getChargeInfo()
			this.getDeviceList()
			this.getChargingRules()
			this.cfAccountGetFn()
			this.cfChargingStoredCardGetFn()
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
			if (uni.getStorageSync('token')) {
				this.isLogin = true
				// this.getInfo(this.id)
				// this.getList()
				// this.getChargingStationDeviceList(this.id)
				// this.getChargingRules(this.id)
			} else {
				this.isLogin = false
				uni.showToast({
					title: '请点击任意位置登录',
					icon: 'none'
				})
			}
		},
		methods: {
			setPlate(e) {
				this.plateNo = e;
				this.plateShow = false;
			},
			popupChange(e) {
				this.pageMetaShow = e.show
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
			//获取账户数据
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
			async getDeviceList() {
				const {
					data,
					code,
					message
				} = await cfDeviceGet({
					areaId: this.chargeId,
					deviceType: 8,
					page: 1,
					size: 200
				})
				if (code == 10002) {
					this.deviceList = data
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
							uni.setStorageSync('wxauthed', true)
							uni.setStorageSync('user', loginRes.data)
							uni.setStorageSync('token', loginRes.token.jwt_token)
							this.$u.vuex('vuex_token', loginRes.token.jwt_token)
							this.$u.vuex('vuex_user', loginRes.data)
							this.getInfo(this.id)
							this.getList()
							this.getChargingStationDeviceList(this.id)
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
			async showPort() {
				const user = uni.getStorageSync('user')
				if (!user.phone) {
					this.$refs.bindPhonePopupRef.showPopup()
					return
				}


				if ((typeof this.deviceIndex) == 'string') {
					uni.showToast({
						title: '请选择充电桩',
						icon: 'none'
					})
					return
				}
				if (!this.inputAccount) {
					uni.showToast({
						title: '请输入充电金额',
						icon: 'none'
					})
					return
				}
				if (!this.plateNo) {
					uni.showToast({
						title: '请输入车牌，方便停车抵扣',
						icon: 'none'
					})
					return
				}
				// if (this.inputAccount > this.account) {
				// 	uni.showToast({
				// 		title: '账户余额不足2',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				// 先获取充电口
				var {
					code,
					data,
					message
				} = await getChargingPortListByQuery({
					page: 1,
					size: 200,
					chargingDeviceId: this.deviceList[this.deviceIndex].id
				})
				if (code === 10002) {
					console.log(data);
					this.chargingPortList = data
					this.$refs.popup.open('bottom')
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
					chargingFee: this.inputAccount,
					numberPlate: this.plateNo,
					chargingPortId: item.id,
					platform: _platform
				})
				if (code === 10002) {
					if(data.unifiedOrderData){
						// #ifdef MP-WEIXIN
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
						// #endif
						// #ifdef MP-ALIPAY
						uni.requestPayment({
							provider: _provider,
							orderInfo: data.unifiedOrderData.alipay_trade_create_response.trade_no,
							success: function(res) {
								if (res.resultCode == '9000') {
									uni.reLaunch({
										url: '/pages/chargeDetail/order'
									})
								} else {
									uni.showToast({
										title: res.memo,
										icon: 'none'
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
						// #endif
					}else{
						uni.showToast({
							title: '开始充电',
							icon: 'success'
						})
						this.$refs.popup.close()
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
			changeDeviceIndex(index) {
				this.deviceIndex = index
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

	.popupBox {
		height: 500rpx;
		background-color: #fff;
		overflow: hidden;

		.title {
			width: 220rpx;
			height: 60rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #323233;
			line-height: 60rpx;
			margin: 66rpx 0 30rpx 40rpx;
		}

		.infoBox2 {
			width: 670rpx;
			height: 136rpx;
			background: #F8F9FB;
			border-radius: 12rpx;
			border: 2rpx solid rgba(151, 151, 151, 0.08);
			position: relative;
			margin: 0 0 40rpx 40rpx;

			.title1 {
				height: 50rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(50, 50, 51, 0.8);
				line-height: 50rpx;
				margin: 28rpx 0 0 32rpx;
			}

			.infoitem1 {
				height: 32rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
				margin-top: 6rpx;
				margin-left: 32rpx;
			}

			.startUp1 {
				width: 144rpx;
				height: 56rpx;
				background: #488CF5;
				border-radius: 44rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 56rpx;
				text-align: center;
				position: absolute;
				right: 32rpx;
				top: 40rpx;
			}
		}
	}
</style>