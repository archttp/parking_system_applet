<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<button v-if="!isLogin" class='free-btn-bordernone' @click="wxLogin"
			style='width:100%;height:100%;top:0;left:0;z-index:99999;position: fixed;'>
		</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		wxAppid
	} from '../../common/config.js';
	import {
		wxMpLogin
	} from '../../network/api.js'
	export default {
		name: "wxmpLogin",
		data() {
			return {
				isLogin: false,
				codeValue: ''
			};
		},
		created() {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
			if (uni.getStorageSync('token')) {
				this.isLogin = true
			} else {
				this.isLogin = false
			}
		},
		methods: {
			getCode() {
				wx.login({
					success: (res) => {
						console.log(123, res);
						this.codeValue = res.code
					}
				})
			},
			wxLogin(e) {
				uni.showLoading({
					title: '请稍等'
				})
				console.log(123);
				console.log(this.codeValue);
				uni.getUserProfile({
					desc: '保存用户数据',
					success: async ({
						iv,
						encryptedData
					}) => {
						var data = {
							iv,
							code: this.codeValue,
							loginType: 'mp',
							encryptedData,
							appid: wxAppid
						}
						var loginRes = await wxMpLogin(data)
						console.log('登陆个人信息', loginRes)
						uni.hideLoading()
						if (loginRes.code == 10002) {
							uni.setStorageSync('token', loginRes.token.access_token)
							uni.setStorageSync('user', loginRes.data)
							this.$emit('changeLoginStatus', true)
							// uni.navigateBack({
							// 	delta: 1
							// })
						} else {
							this.$emit('changeLoginStatus', false)
							uni.showToast({
								title: loginRes.message,
								icon: 'none'
							})
							this.getCode()
						}
					},
					fail(error) {
						console.log('获取用户信息失败',error)
					}
				})
			},
		}
	}
</script>

<style>

</style>