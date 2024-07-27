<template>
	<view>
		<!-- <image src="../../../static/image/home/LOGO@2x.png"  class="logo"></image>
		<div class="text1">您好，</div>
		<div class="text2">欢迎使用中威停车</div>
		<div class="text2">请点击授权缴纳停车费</div>
		<image src="../../../static/image/home/BG@2x.png"  class="bg"></image>
		<button @click="wxLogin" class="authorize" :loading='isCode' :disabled='isCode'>
			点击授权
		</button> -->

		<view class="title1">您好，</view>
		<view class="title2">请点击授权 获取信息</view>
		<!-- 	<image src="../../static/images/我的BG@2x.png"
			style="width: 750rpx;height:100vh;position: absolute;bottom: 0;left: 0;"></image> -->

		<!-- #ifdef MP-WEIXIN -->
		<button @click="wxLogin" class="authorize" :loading='isCode' :disabled='isCode'>
			点击授权
		</button>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<button @click="aliLogin" class="authorize" :loading='isCode' :disabled='isCode'>
			点击授权
		</button>
		<!-- #endif -->


	</view>
</template>

<script>
	import {
		wxAppid,
		aliAppid
	} from '../../common/config.js'
	import {
		wxMpLogin,
		getAliMinBaseUserInfoByCode
	} from '../../network/api.js'
	export default {
		data() {
			return {
				code: '',
				carpark_checkpoint_id: ''
			}
		},
		onShow(e) {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
		},
		onLoad(e) {

		},
		methods: {
			aliLogin() {
				var _ = this
				uni.getAuthCode({
					scopes: ['auth_user'],
					success: async (res) => {
						if (res.authCode) {
							console.log(res.authCode);
							var loginRes = await getAliMinBaseUserInfoByCode({
								authCode: res.authCode,
								appid: aliAppid
							})
							console.log(loginRes);
							if (loginRes.code === 10002) {
								uni.setStorageSync('user', loginRes.data)
								uni.setStorageSync('token', loginRes.token.jwt_token)
								uni.switchTab({
									url: '/packageMy/my/my'
								})
							} else {
								uni.showToast({
									title: loginRes.message,
									icon: 'none'
								})
							}
						}
					},
				});
			},
			getCode() {
				wx.login({
					success: (res) => {
						console.log(res);
						this.code = res.code
					}
				})
			},
			wxLogin(e) {
				var _ = this
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
						var loginRes = await wxMpLogin(data)
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
							uni.setStorageSync('user', loginRes.data)
							uni.setStorageSync('token', loginRes.token.access_token)
							uni.switchTab({
								url: '/packageMy/my/my'
							})
						} else {
							uni.showToast({
								title: '登陆出错',
								icon: 'none'
							})
							_.getCode()
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.title1 {
		height: 90rpx;
		font-size: 64rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #323233;
		line-height: 90rpx;
		margin: 240rpx 0 0 56rpx;
	}

	.title2 {
		height: 56rpx;
		font-size: 40rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #323233;
		line-height: 56rpx;
		margin: 12rpx 0 0 56rpx;
	}

	.authorize {
		width: 670rpx;
		height: 100rpx;
		background: #488CF5;
		border-radius: 12rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #fff;
		line-height: 100rpx;
		position: absolute;
		bottom: 162rpx;
		left: 40rpx;
	}
</style>