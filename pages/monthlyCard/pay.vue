<template>
	<view>
		<view class="parkNameBox flex flex-col-center">
			<view class="left">
				停车场
			</view>
			<view class="right single-line">
				{{ packageProductInfo.carParkName }}
			</view>
		</view>
		<view class="licensePlateBox">
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left">
					车牌
				</view>
				<view class="right single-line">
					{{ licensePlate }}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left" style="width: 128rpx;">
					月卡类型
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					{{ packageProductInfo.title }}
				</view>
			</view>
		</view>
		<view class="parkNameBox flex flex-col-center flex-row-between">
			<view class="left" style="width: 128rpx;">
				购买数量
			</view>
			<view class="right flex" style="width: auto;margin-right: 32rpx;">
				<image mode="" src="../../static/images/add@2x.png" style="width: 48rpx;height: 48rpx;"
					@click="changeNum('add')"></image>
				<view style="width: 48rpx;height: 48rpx;font-size: 32rpx;text-align: center;">{{ num }}</view>
				<image mode="" src="../../static/images//-@2x.png" style="width: 48rpx;height: 48rpx;"
					@click="changeNum('dec')"></image>
			</view>
		</view>
		<view class="licensePlateBox">
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left" style="width: 128rpx;">
					应付金额
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					¥{{ (packageProductInfo.currentPrice * num).toFixed(2) }}
				</view>
			</view>
			<view class="flex flex-col-center" style="height: 50%;">
				<view class="left" style="width: 128rpx;">
					其他折扣
				</view>
				<view class="right single-line" style="width: 502rpx;margin-left: 0;">
					限时折扣-¥0
				</view>
			</view>
		</view>
		<view class="payBox flex flex-row-between">
			<view class="flex-col">
				<view class="flex totalBox">
					<view class="left">合计</view>
					<view class="right">￥{{ (packageProductInfo.currentPrice * num).toFixed(2) }}</view>
				</view>
				<view class="discount">已优惠¥0</view>
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<view class="pay" @click="onPay">
				立即支付
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<view class="pay" @click="onAliPay">
				立即支付
			</view>
			<!-- #endif -->



		</view>
	</view>
</template>

<script>
	import {
		buyCarParkPackageProduct,
		getCarParkPackageProductListById
	} from '../../network/api.js'

	export default {
		data() {
			return {
				id: '',
				licensePlate: '',
				packageProductInfo: {
					
				},
				num: 1,
				packageId: '',
			}
		},
		onLoad(e) {
			this.id = e.id
			this.licensePlate = e.licensePlate
			if(e.packageId){
				this.packageId = e.packageId
			}
			this.fenchData()
		},
		methods: {
			async onPay() {
				const {
					data,
					code,
					message,
					mixMessage
				} = await buyCarParkPackageProduct({
					numberPlate: this.licensePlate,
					packageProductId: this.id,
					platform: 'wx_mp',
					quantity: this.num,
					packageId: this.packageId
				})
				if (code == 10002) {
					if (data == null) {
						uni.showToast({
							title: message,
							icon: 'none'
						})
					} else {
						const price = this.packageProductInfo.currentPrice * this.num
						const carParkName = this.packageProductInfo.carParkName
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
										url: '/pages/pay/paymentComplete?price=' + price +
											'&parkName=' + carParkName
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
					}
				} else {
					uni.showModal({
						title: message,
						icon: 'none',
						content: mixMessage,
					})
				}
			},
			async onAliPay() {
				const {
					data,
					code,
					message
				} = await buyCarParkPackageProduct({
					numberPlate: this.licensePlate,
					packageProductId: this.id,
					platform: 'ali_mp',
					quantity: this.num,
					packageId: this.packageId
				})
				if (code == 10002) {
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
									uni.switchTab({
										url: '/packageMy/my/my'
									})
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
			changeNum(type) {
				if (type == 'add') {
					this.num++
				} else {
					if (this.num == 1) {
						uni.showToast({
							title: '最少数量为1',
							icon: 'none'
						})
					} else {
						this.num--
					}
				}
			},
			async fenchData() {
				const {
					data,
					code,
					message
				} = await getCarParkPackageProductListById({
					id: this.id,
				})
				console.log(data, code);
				if (code == 10002) {
					this.id = data.id
					this.packageProductInfo = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
	}

	.payBox {
		width: 686rpx;
		height: 152rpx;
		background: #2B3041;
		border-radius: 75rpx;
		position: absolute;
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
		height: 248rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 32rpx 0 0 26rpx;

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
</style>