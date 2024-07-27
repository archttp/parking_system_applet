<template>
	<view>
		<view class="inp flex-col">
			<view class="title">我的手机号</view>
			<view class="phone">{{ phone ? phone : '-' }}</view>
		</view>
		<!-- <view class="trip">注：昵称最多支持8个汉字</view> -->
		<!-- 	<view class="buttonNo" @click="phoneShow = true">
      {{phone?'换绑手机号':'绑定手机号'}}
    </view> -->

		<!-- #ifdef MP-WEIXIN -->
		<button class="buttonNo" open-type="getPhoneNumber"
			@getphonenumber='getPhoneNumber'>{{ phone ? '换绑手机号' : '绑定手机号' }}
		</button>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<button class="buttonNo" open-type="getAuthorize" @getAuthorize="getAliPhoneNumber" scope="phoneNumber">
			授权手机号
		</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		wxAppid,
		aliAppid
	} from '@/common/config.js'
	import {
		getUserPhonenumberByCodeAndLoginType
	} from '../../../network/api.js'

	export default {
		data() {
			return {
				phone: '',
			}
		},
		onShow() {
			this.phone = uni.getStorageSync('user').phone
		},
		methods: {
			closePhoneShow() {
				this.phoneShow = false
				setTimeout(() => {
					this.phone = uni.getStorageSync('user').phone
				}, 300);
			},
			clear() {
				this.nickname = ""
			},
			intoBind() {
				uni.navigateTo({
					url: 'bind'
				})
			},
			handleAuthError(e) {
				console.log(e);
			},
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
							this.phone = res.data.phone
							uni.showToast({
								title: '修改成功',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
						}
					},
					fail: (res) => {
						console.log(res);
						console.log('getPhoneNumber_fail');

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
						this.phone = res.data.phone
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.buttonNo {
		width: 90vw;
		height: 100 upx;
		line-height: 100 upx;
		border-radius: 10 upx;
		text-align: center;
		color: #FFFFFF;
		background: #488cf5;
		margin-top: 68rpx;
		margin-left: 32rpx;
	}

	.trip {
		width: 280rpx;
		height: 34rpx;
		font-size: 24rpx;

		font-weight: 400;
		color: rgba(50, 50, 51, 0.5);
		line-height: 34rpx;
		margin: 32rpx 0 0 24rpx;
	}

	.inp {
		width: 750rpx;
		height: 248rpx;
		background: #FFFFFF;
		margin-top: 32rpx;
		padding-left: 24rpx;
		box-sizing: border-box;

		.title {
			width: 100%;
			text-align: center;
			height: 44rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: #323233;
			line-height: 44rpx;
			margin-top: 64rpx;
			opacity: .6;
		}

		.phone {
			width: 100%;
			text-align: center;
			height: 66rpx;
			font-size: 48rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 66rpx;
			margin-top: 12rpx;
		}
	}
</style>