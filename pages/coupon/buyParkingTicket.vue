<template>
	<view>
		<!-- <u-tabs :list="list1" @change="click" :current='current'></u-tabs> -->
		<view style="width: 750rpx;height: 88rpx;background-color:#EEEEEF ;"
			class="flex flex-col-center flex-row-center">
			<view style="width: 250rpx;height: 88rpx;text-align: center;line-height: 88rpx;"
				@click="changeCurrent(index)"
				:style="current == index ? 'background:#FFFFFF;font-weight: 900;' : 'opacity: .7;'"
				v-for="(item,index) in list1" :key="item.name">{{item.name}}</view>
		</view>
		<view v-if="current === 0">
			<view class="inputBox flex-col">
				<view class="title">购买停车券面值</view>
				<view class="flex">
					<view class="line"></view>
					<input type="number" v-model="value" class="input" placeholder-class="placeholder"
						placeholder="请输入购买停车场面值" />
				</view>
			</view>
			<view class="payNum">需支付：<text
					:style="value?'color:#488cf5':''">¥{{value ? value  : '-'}}</text></view>
			<view class="Prompt">注：充值比例 1:{{shopInfo.rechargeRatio}}</view>
			<view :class="value?'pay_active':'pay'" @click="pay">立即支付</view>
		</view>

		<view v-if="current === 1">
			<view class="inputBox flex-col">
				<view class="title">购买停车时长券</view>
				<view class="flex">
					<view class="line"></view>
					<input type="number" v-model="time" class="input" placeholder-class="placeholder"
						placeholder="请输入小时数" />
				</view>
			</view>
			<view class="payNum">需支付：<text
					:style="time?'color:#488cf5':''">¥{{time ? time * shopInfo.timeCouponPrice : '-'}}</text></view>
			<view class="Prompt">注：一小时{{shopInfo.timeCouponPrice}}元</view>
			<view :class="time?'pay_active':'pay'" @click="pay">立即支付</view>
		</view>


		<view v-if="current === 2">
			<view class="inputBox flex-col">
				<view class="title">购买停车次数券</view>
				<view class="flex">
					<view class="line"></view>
					<input type="number" v-model="num" class="input" placeholder-class="placeholder"
						placeholder="请输入次数" />
				</view>
			</view>
			<view class="payNum">需支付：<text
					:style="num?'color:#488cf5':''">¥{{num ? num * shopInfo.timesCouponPrice : '-'}}</text></view>
			<view class="Prompt">注：一次{{shopInfo.timesCouponPrice}}元</view>
			<view :class="num?'pay_active':'pay'" @click="pay">立即支付</view>
		</view>



	</view>
</template>

<script>
	import {
		rechargeCouponActivity
	} from '../../network/api.js'
	import { wxAppid } from '../../common/config.js'
	export default {
		data() {
			return {
				current: 0,
				value: '',
				num: '',
				time: '',
				rechargeRatio: 1,
				timeCouponPrice: '',
				timesCouponPrice: '',
				list1: [{
					name: '金额券',
				}, {
					name: '时长券',
				}, {
					name: '次数券'
				}],
				shopInfo: {

				}
			}
		},
		onLoad(e) {
			if (e.shopInfo) {
				this.shopInfo = JSON.parse(e.shopInfo)
			}
			// if (e.rechargeRatio) {
			// 	this.rechargeRatio = e.rechargeRatio
			// }
			// if (e.timeCouponPrice) {
			// 	this.timeCouponPrice = e.timeCouponPrice
			// }
			// if (e.timesCouponPrice) {
			// 	this.timesCouponPrice = e.timesCouponPrice
			// }
		},
		methods: {
			changeCurrent(index) {
				this.current = index
			},
			click(item) {
				console.log('item', item);
				this.current = item
			},

			async pay() {
				var that = this
				if (this.current == 0) {
					if (!this.value) {
						return
					}
				}
				if (this.current == 1) {
					if (!this.time) {
						return
					}
				}
				if (this.current == 2) {
					if (!this.num) {
						return
					}
				}
				const amountOfMoney = this.current == 0 ? this.value : this.current == 1 ? this.time : this.num
				var payinfo = await rechargeCouponActivity({
					couponActivityId: this.shopInfo.id,
					couponType: this.current == 0 ? 2 : this.current == 1 ? 3 : 1,
					paymentScenes: 'wx_mp',
					quantity: amountOfMoney,
					appid:wxAppid
				})
				console.log(payinfo);
				// var res = await this.$u.api.rechargeToCouponActivity({
				// 	couponActivityId: uni.getStorageSync('parkingTicketActivityId'),
				// 	// amountOfMoney:Number(this.value) / Number(this.rechargeRatio),
				// 	amountOfMoney: Number(amountOfMoney),
				// 	payTypeId: payinfo.data[0].id,
				// 	useScenes: 'wx_mp',
				// 	// 1-次数券/2-金额券/3-时长券
				// 	couponType: this.current == 2 ? 1 : this.current == 0 ? 2 : 3
				// })
				if (payinfo.code != 10002) {
					uni.showToast({
						title: payinfo.message,
						icon: 'none'
					})
					return
				} else {
					// #ifdef  H5
					this.wxPay(payinfo.data)
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
							console.log(res)
							if (res.errMsg == 'requestPayment:ok') {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1500)
							}
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
							uni.showToast({
								title: '支付已取消',
								icon: 'none'
							})
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
		// margin-top: 32rpx;

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
</style>