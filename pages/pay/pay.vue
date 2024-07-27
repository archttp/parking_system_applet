<template>
	<view>
		<view class="parkNameBox flex flex-col-center">
			<view class="left">
				停车场
			</view>
			<view class="right single-line">
				{{order.carParkName}}
			</view>
		</view>
		<view class="licensePlateBox">
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left">
					车牌
				</view>
				<view class="right single-line">
					{{order.numberPlate}}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left" style="width: 128rpx;">
					停车时长
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					{{getTimeDifference(order.inTime,order.outTime)}}
				</view>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<ad :unit-id="wxMpAdId"></ad>
		<!-- #endif -->
		<view class="licensePlateBox">
			<view class="flex flex-col-center" style="height: 40%;">
				<view class="left" style="width: 128rpx;">
					入场时间
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					{{order.inTime | formatTimestamp}}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left" style="width: 128rpx;">
					出场时间
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					{{order.outTime | formatTimestamp}}
				</view>
			</view>
		</view>
		<view class="licensePlateBox" style="height: 260rpx;">
			<view class="flex flex-col-center" style="height: 25%;">
				<view class="left" style="width: 128rpx;">
					应付金额
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					¥{{order.cfOrder.amountsPayable}}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 25%;">
				<view class="left" style="width: 128rpx;">
					实付金额
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					¥{{order.cfOrder.containCouponAmountsPayable ? order.cfOrder.containCouponAmountsPayable : 0}}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 25%;">
				<view class="left" style="width: 128rpx;">
					优惠券
				</view>
				<view class="flex flex-col-center">
					<view class="right single-line" style="margin-left: 0;width: 486rpx;" @click="showCouponPopup">
						{{couponDetail.id ? getcouponText() : (order.cfCouponList != null ? '选择优惠券' : '暂无优惠券')}}
					</view>
					<image v-if="order.cfCouponList != null" src="../../static/images/xiala@2x.png"
						style="width: 16rpx;height: 16rpx;margin-left: 16rpx;" mode=""></image>
				</view>
			</view>
			<!-- <view class="flex flex-col-center" style="height: 20%;"> -->
				<!-- <view class="left" style="width: 128rpx;"> -->
					<!-- 支付方式 -->
				<!-- </view> -->
				<!-- #ifdef MP-WEIXIN -->
				<!-- <view class="right single-line" style="width: 502rpx;margin-left: 0;"> -->
					<!-- 微信支付 -->
				<!-- </view> -->
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<!-- <view class="right single-line" style="width: 502rpx;margin-left: 0;"> -->
					<!-- 支付宝支付 -->
				<!-- </view> -->
				<!-- #endif -->
			<!-- </view> -->
		</view>
		<view class="parkNameBox flex flex-col-center">
			<view class="left" style="width: 128rpx;">
				补缴信息
			</view>
			<view class="right single-line" style="width: 502rpx;margin-left: 0;">
				暂无
			</view>
		</view>
		<view class="payBox flex flex-row-between">
			<view class="flex-col">
				<view class="flex totalBox">
					<view class="left">合计</view>
					<view class="right">￥{{order.cfOrder.containCouponAmountsPayable ? order.cfOrder.containCouponAmountsPayable : 0}}</view>
				</view>
				<view class="discount">已优惠¥{{order.cfOrder.amountsPayable-order.cfOrder.containCouponAmountsPayable}}</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="pay" @click="onPay" :disabled="order.cfOrder.status !== 0">
				{{order.cfOrder.status == 0 ? '立即支付' : '无需支付'}}
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button class="pay" @click="onAliPay" :disabled="order.cfOrder.status !== 0">
				{{order.cfOrder.status == 0 ? '立即支付' : '无需支付'}}
			</button>
			<!-- #endif -->
		</view>

		<uni-popup ref="popup" type="bottom">
			<view style="width: 100%;height: 100%;" class="flex">
				<view class="choose" @tap.stop>
					<view class="flex flex-col-center">
						<view class="title">选择优惠券</view>
						<view @click="onNoCoupon" style="margin-left: 274rpx;margin-top: 36rpx;color: #488cf5;">
							不使用优惠券</view>
					</view>
					<view class="subtitle">选择优惠券付款更优惠哦～</view>
					<scroll-view scroll-y="true" style="widows: 670rpx;height: 550rpx;" v-if="couponList.length > 0">
						<view class="licensePlate bb" v-for="item of couponList" :key="item.id"
							@click="onScrollCoupon(item)">
							<view class="title1" v-if="item.couponType == 1">{{item.denomination}}次 - 次数券</view>
							<view class="title1" v-if="item.couponType == 2">{{item.denomination}}元 - 金额券</view>
							<view class="title1" v-if="item.couponType == 3">{{item.denomination / 3600000}}小时 - 时长券
							</view>
							<view class="subTitle1">{{item.targetObject}} 可用</view>
						</view>
					</scroll-view>
					<view v-else style="width: 100%;" class="flex-col flex-col-center">
						<image src="../../static/images/nocar.png"
							style="width: 220rpx;height: 108rpx;margin-top:20rpx;"></image>
						<view
							style="margin:16rpx 0 0 0;width: 362rpx;height: 32rpx;font-weight: 400;color: #CDCDCD;line-height: 32rpx;">
							...(- -)..您还未绑定车牌哦~</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- <bindPhonePopup ref="bindPhonePopupRef" @closePhoneShow='closePhoneShow' /> -->
	</view>
</template>

<script>
	import {
		getCarParkUseLogOrder,
		payCarParkUseLogOrder
	} from '../../network/api.js'
	import {
		timeDifference,
		formatTimestamp
	} from '../../utils/index.js'
	// import bindPhonePopup from '../../components/bindPhonePopup/index.vue'
	import {
		parkingFeeWxMpAdId
	} from '../../common/config.js'

	export default {
		data() {
			return {
				order: {
					carParkName: '',
					numberPlate: '',
					inTime: '',
					outTime: '',
					cfOrder: {
						amountsPayable: '',
						containCouponAmountsPayable: '',
					},
					temporaryLicensePlate: false
				},
				maskShow: true,
				couponList: [],
				couponDetail: {
					id: ''
				},
				wxMpAdId: parkingFeeWxMpAdId
			}
		},
		filters: {
			formatTimestamp
		},
		// components: {
		// 	bindPhonePopup
		// },
		onLoad(e) {
			this.carParkUseLogId = e.carParkUseLogId
			this.fenchData()
		},
		methods: {
			async onPay() {
				// const user = uni.getStorageSync('user')
				// if (!user.phone) {
				// 	this.$refs.bindPhonePopupRef.showPopup()
				// 	return
				// }


				const {
					data,
					code,
					message
				} = await payCarParkUseLogOrder({
					carParkUseLogId: this.carParkUseLogId,
					couponId: this.couponDetail.id,
					paymentScenes: 'wx_mp'
				})
				if (code === 10002) {
					if (data == null) {
						uni.showToast({
							title: message,
							icon: 'none'
						})
					} else {
						var _this = this;
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(res) {
								if (res.errMsg == 'requestPayment:ok') {
									
									uni.reLaunch({
										url: '/pages/pay/paymentComplete?price=' + _this.order
											.cfOrder.amountsPayable + '&parkName=' + _this.order
											.carParkName
									})
								}
							},
							fail: function(err) {
								uni.showToast({
									title: err,
									icon: 'none'
								})
								console.log(err);
							}
						});
					}
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			async onAliPay() {
				// const user = uni.getStorageSync('user')
				// if (!user.phone) {
				// 	this.$refs.bindPhonePopupRef.showPopup()
				// 	return
				// }
				const {
					data,
					code,
					message
				} = await payCarParkUseLogOrder({
					carParkUseLogId: this.carParkUseLogId,
					couponId: '',
					paymentScenes: 'ali_mp'
				})
				if (code === 10002) {
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: data.alipay_trade_create_response.trade_no,
						success: function(res) {
							if (res.resultCode == '9000') {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.navigateBack()
								}, 1500);
							} else {
								uni.showToast({
									title: res.memo,
									icon: 'none'
								})
							}
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
					});
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			getcouponText() {
				// 1-次数券/2-金额券/3-时长券
				const arrs = ['次数券', '金额券', '时长券']
				const arrs2 = ['次', '元', '小时']
				const {
					couponType,
					denomination
				} = this.couponDetail;
				const couponValue = couponType === 3 ? denomination / 3600000 : denomination;
				const couponLabel = `${arrs2[couponType - 1]} - ${arrs[couponType - 1]}`;
				const result = couponValue + ' ' + couponLabel;
				return result;
			},
			onScrollCoupon(item) {
				this.couponDetail = item
				this.fenchData()
				this.closeCouponPopup()
			},
			showCouponPopup() {
				if (this.couponList.length > 0) {
					this.$refs.popup.open('bottom')
				}
			},
			closeCouponPopup() {
				this.$refs.popup.close()
			},
			onNoCoupon() {
				this.couponDetail = null
				this.closeCouponPopup()
			},
			getTimeDifference(inTime, outTime) {
				return timeDifference(inTime, outTime)
			},
			async fenchData() {
				const {
					data,
					code
				} = await getCarParkUseLogOrder({
					carParkUseLogId: this.carParkUseLogId,
					couponId: this.couponDetail.id
				})
				if (code === 10002) {
					if(data.numberPlate.indexOf('临')>=0){
						data.temporaryLicensePlate = true;
					}
					this.order = data
					if (data.cfCouponList != null) {
						this.couponList = data.cfCouponList;
						if(this.couponList.length>0){
							this.couponDetail = this.couponList[0];
						}
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
		padding-bottom: 300rpx;
	}

	.payBox {
		width: 686rpx;
		height: 152rpx;
		background: #2B3041;
		border-radius: 75rpx;
		position: fixed;
		left: 32rpx;
		bottom: 84rpx;

	}

	.pay {
		width: 222rpx;
		height: 96rpx;
		background: linear-gradient(270deg, #F3DBA6 0%, #E2B46D 100%);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #5E3400;
		line-height: 96rpx;
		text-align: center;
		margin: 28rpx 44rpx 0 0;
	}

	.totalBox {
		.left {
			font-size: 32rpx;

			font-weight: 400;
			color: #FFFFFF;
			margin: 46rpx 0 0 58rpx;
		}

		.right {
			font-size: 52rpx;
			font-weight: 600;
			color: #EFB25A;
			margin: 26rpx 0 0 20rpx;
		}
	}

	.discount {
		height: 34rpx;
		font-size: 24rpx;

		font-weight: 400;
		color: #FFFFFF;
		line-height: 34rpx;
		margin: 0rpx 0 0 58rpx;
		opacity: .7;
	}

	.licensePlateBox {
		width: 698rpx;
		height: 160rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 20rpx 0 0 26rpx;

		.left {
			width: 96rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: rgba(50, 50, 51, 0.6);
			margin-left: 32rpx;
		}

		.right {
			width: 502rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: #323233;
			margin-left: 36rpx;
			text-align: right;
		}
	}

	.parkNameBox {
		width: 698rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 32rpx 0 0 26rpx;

		.left {
			width: 96rpx;
			height: 44rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: rgba(50, 50, 51, 0.6);
			line-height: 44rpx;
			margin-left: 32rpx;
		}

		.right {
			width: 502rpx;
			height: 44rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: #323233;
			line-height: 44rpx;
			margin-left: 36rpx;
			text-align: right;
		}
	}

	.choose {
		width: 750rpx;
		// height: 530rpx;
		background: #FFFFFF;
		border-radius: 48rpx 48rpx 0rpx 0rpx;
		align-self: flex-end;

		.title {
			height: 60rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #323233;
			line-height: 60rpx;
			margin: 40rpx 0 0 40rpx;
		}

		.subtitle {
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 34rpx;
			margin: 4rpx 0 0 40rpx;
		}

		.licensePlate {
			background: #F8F9FB;
			border-radius: 12rpx;
			border: 2rpx solid rgba(151, 151, 151, 0.08);
			width: 670rpx;
			height: 136rpx;
			border-radius: 12rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 136rpx;
			padding-left: 32rpx;
			margin-left: 42rpx;
			margin-top: 40rpx;

			.title1 {
				// width: 116rpx;
				height: 60rpx;
				font-size: 44rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 60rpx;
				margin-top: 20rpx;
			}

			.subTitle1 {
				width: 284rpx;
				height: 32rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
				margin-top: 4rpx;
			}
		}

		.addCarBox {
			width: 670rpx;
			height: 136rpx;
			background: rgba(72, 140, 245, 0.08);
			border-radius: 12rpx;
			border: 3rpx dashed #488CF5;
			margin: 46rpx 0 0 40rpx;
			margin-bottom: 32rpx;
			margin-top: 20rpx;

			image {
				width: 32rpx;
				height: 32rpx;
			}

			.text {
				width: 144rpx;
				height: 50rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #488CF5;
				line-height: 50rpx;
			}
		}
	}
</style>