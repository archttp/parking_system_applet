<template>
	<view>
		<view class="inputBox flex-col">
			<view class="title">充值金额</view>
			<view class="flex">
				<view class="line"></view>
				<input type="number" v-model="value" class="input" placeholder-class="placeholder"
					placeholder="请输入充值金额" />
			</view>
		</view>
		<view class="payNum">需支付：<text :style="value?'color:#488cf5':''">¥ {{value ? value : '-'}}</text></view>

		<view :class="value?'pay_active':'pay'" @click="pay">立即支付</view>


		<!-- 	<u-mask :show="noLicenseplateBoxShow" z-index='5'>
			<view style="display: flex;align-items: center;height: 100%;flex-direction: column;margin-top: 36%;">
				<view class="flex-col flex-col-center noLicenseplateBox">
					<image src="../../../static/image/my/paySucc.png" class="image"></image>
					<view class="title1">充值成功</view>
					<view class="title2">o(^▽^)o已经充值成功啦，感谢您的信任与支持</view>
					<navigator url="../my/myCar/addCar" hover-class="none">
						<view class="button" @click="back">好的，我知道了</view>
					</navigator>
				</view>
			</view>
		</u-mask> -->


	</view>
</template>

<script>
	import {
		recharge
	} from '../../network/api.js'
	export default {
		data() {
			return {
				value: '',
				rechargeRatio: 1,
				noLicenseplateBoxShow: false
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			async pay() {
				if (!this.value) {
					return
				}
				var that = this
				// #ifdef  MP-WEIXIN
				var payinfo = await recharge({
					paymentScenes: 'wx_mp',
					currencyType: 'cny',
					amount: this.value
				})
				// #endif
				// #ifdef MP-ALIPAY
				var payinfo = await recharge({
					paymentScenes: 'ali_mp',
					currencyType: 'cny',
					amount: this.value
				})
				// #endif
				if (payinfo.code != 10002) {
					uni.showToast({
						title: payinfo.message,
						icon: 'none'
					})
					return
				} else {
					// #ifdef  H5
					this.wxPay(payinfo.data.data)
					// #endif
					// #ifdef  MP-WEIXIN
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: payinfo.data.timeStamp,
						nonceStr: payinfo.data.nonceStr,
						package: payinfo.data.package,
						signType: payinfo.data.signType,
						paySign: payinfo.data.paySign,
						success: function(res) {
							if (res.errMsg == 'requestPayment:ok') {
								uni.showToast({
									title: '支付成功',
									icon: 'success'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							}
						},
						fail: function(err) {
							uni.showToast({
								title: '支付取消',
								icon: 'none'
							})
						}
					});
					// #endif
					// #ifdef  MP-ALIPAY
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: payinfo.data.alipay_trade_create_response.trade_no,
						success: function(res) {
							if (res.resultCode == '9000') {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: '支付取消',
									icon: 'none'
								})
							}
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
					});
					// #endif
				}
			},
			wxPay(datas) {
				var _ = this
				window.WeixinJSBridge.invoke(
					"getBrandWCPayRequest", {
						appId: datas.appId, //公众号名称，由商户传入
						timeStamp: String(datas
							.timeStamp
						), //时间戳，自1970年以来的秒数。这里必须要转换为字符串。ios跟android表现不同。后台返回的是数值，但是微信方面必须要json参数都是字符串形式，android会自动转换成字符串（当时我在这里也找了很久的博文才知道的）
						nonceStr: datas.nonceStr, //随机串
						package: datas.package,
						signType: datas.signType, //微信签名方式：
						paySign: datas.sign, //微信签名
					},
					function(res) {
						_.payDisabled = false
						_.payLoading = false
						if (res.err_msg === "get_brand_wcpay_request:ok") {
							uni.showModal({
								title: "提示",
								message: "支付成功",
								confirmColor: "#488cf5",
							});
						} else if (res.err_msg === "get_brand_wcpay_request:cancel") {
							uni.showModal({
								title: "提示",
								content: "支付取消",
								confirmColor: "#488cf5",
							});
						} else {
							uni.showModal({
								title: "提示",
								message: "支付失败",
								confirmColor: "#488cf5",
							});
						}
					}
				);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F7F7F7;
	}

	.payNum {
		width: 750rpx;
		height: 88rpx;
		background: #FFFFFF;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #323233;
		line-height: 88rpx;
		border-top: 2rpx solid #eaeaea;
		padding-left: 32rpx;
	}

	.Prompt {
		width: 480rpx;
		height: 34rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.3);
		line-height: 34rpx;
		margin: 16rpx 0 0 24rpx;
	}

	.pay {
		width: 686rpx;
		height: 100rpx;
		background: #488cf5;
		border-radius: 16rpx;
		opacity: 0.4;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 100rpx;
		text-align: center;
		margin: 52rpx 0 0 32rpx;
	}

	.pay_active {
		@extend .pay;
		background: #488cf5;
		opacity: 1;
	}

	.inputBox {
		width: 750rpx;
		height: 198rpx;
		background: #FFFFFF;
		margin-top: 32rpx;

		.title {
			width: 224rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(50, 50, 51, 0.32);
			line-height: 44rpx;
			margin: 22rpx 0 0 32rpx;
		}
	}

	.line {
		width: 6rpx;
		height: 64rpx;
		background: #488cf5;
		border-radius: 4rpx;
		margin: 34rpx 0 0 36rpx;
	}

	.input {
		width: 320rpx;
		height: 44rpx;
		margin: 44rpx 0 0 12rpx;
	}

	.placeholder {
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.3);
		line-height: 44rpx;
	}

	.noLicenseplateBox {
		width: 624rpx;
		height: 776rpx;
		background: #FDFEFF;
		border-radius: 16rpx;

		.image {
			width: 200rpx;
			height: 200rpx;
			margin-top: 104rpx;
		}

		.title1 {
			width: 294rpx;
			height: 36rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #323233;
			line-height: 36rpx;
			margin-top: 16rpx;
			text-align: center;
		}

		.title2 {
			width: 342rpx;
			height: 80rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.5);
			line-height: 40rpx;
			margin-top: 32rpx;
			text-align: center;
		}

		.button {
			width: 456rpx;
			height: 100rpx;
			background: #488cf5;
			border-radius: 16rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 100rpx;
			text-align: center;
			margin-top: 130rpx;
		}
	}
</style>