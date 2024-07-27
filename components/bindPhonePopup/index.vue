<template>
	<uni-popup ref="popup">
		<view class="popupBox2 bb por">
			<image class="poa" src="../../static/images/maoboli@2x.png"
				style="width: 128rpx;height: 128rpx;top:52rpx;right:28rpx;" mode=""></image>
			<view class="text1">手机号码未认证</view>
			<view class="text2">为了保障信息安全，请先进行号码认证</view>

			<!-- #ifdef MP-WEIXIN -->
			<button class="intoOrder" open-type="getPhoneNumber" @getphonenumber='getPhoneNumber'>一键授权手机号
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button class="intoOrder" open-type="getAuthorize" @getAuthorize="getAliPhoneNumber" scope="phoneNumber">
				一键授权手机号
			</button>
			<!-- #endif -->

			<!-- 
			<button class="intoOrder" style="margin-top: 54rpx;" open-type="getPhoneNumber"
				@getphonenumber='getPhoneNumber'>一键绑定手机号</button> -->
		</view>
	</uni-popup>
</template>

<script>
	import {
		wxAppid,
		aliAppid
	} from '../../common/config.js'
	import {
		getUserPhonenumberByCodeAndLoginType
	} from '../../network/api.js'

	export default {
		props: ['phoneShow'],
		methods: {
			getAliPhoneNumber() {
				my.getPhoneNumber({
					success: async (res) => {
						const newRes = JSON.parse(res.response)
						var res = await getUserPhonenumberByCodeAndLoginType({
							code: newRes.response,
							platform: 'ali_mp',
							sign: newRes.sign,
							appid: aliAppid
						})
						if (res.code === 10002) {
							uni.setStorageSync('token', res.token.access_token)
							uni.setStorageSync('user', res.data)
							uni.showToast({
								title: res.message,
								icon: 'success'
							})
						} else {
							uni.showModal({
								title: '提示',
								content: res.message
							})
						}
						this.closePopup()
					},
					fail: (res) => {
						console.log(res);
					}
				});
			},
			async getPhoneNumber(e) {
				if (e.detail.code) {
					var res = await getUserPhonenumberByCodeAndLoginType({
						code: e.detail.code,
						platform: 'wx_mp',
						appid: wxAppid
					})

					console.log('更新后的用户信息', res)
					if (res.code == 10002) {
						uni.setStorageSync('token', res.token.access_token)
						uni.setStorageSync('user', res.data)
						uni.showToast({
							title: res.message,
							icon: 'success'
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.message
						})
					}
					this.closePopup()
				}
			},
			onGetAuthorize() {
				console.log(123);
			},
			showPopup() {
				this.$refs.popup.open('bottom');
			},
			closePopup() {
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss">
	.popupBox2 {
		width: 686rpx;
		height: 384rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-left: 32rpx;
		overflow: hidden;

		.text1 {
			width: 252rpx;
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #323233;
			line-height: 50rpx;
			margin: 64rpx 0 0 34rpx;
		}

		.text2 {
			width: 408rpx;
			height: 34rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #323233;
			line-height: 34rpx;
			margin: 16rpx 0 0 34rpx;
		}

		.intoOrder {
			width: 620rpx;
			height: 100rpx;
			background: #488CF5;
			border-radius: 16rpx;
			margin-top: 48rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 100rpx;
			text-align: center;
			margin-left: 33rpx;
		}
	}
</style>