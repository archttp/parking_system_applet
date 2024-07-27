<template>
	<view>
		<button v-if="!isLogin" class='free-btn-bordernone' @click="aliLogin"
			style='width:100%;height:100%;top:0;left:0;z-index:99999;position: fixed;'>
		</button>
	</view>
</template>

<script>
	import {
		aliAppid
	} from '../../common/config.js';
	import {
		getAliMinBaseUserInfoByCode
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
			aliLogin(e) {
				uni.showLoading({
					title: '请稍等'
				})
				uni.getAuthCode({
					scopes: ['auth_user'],
					success: async (res) => {
						if (res.authCode) {
							var loginRes = await getAliMinBaseUserInfoByCode({
								authCode: res.authCode,
								appid: aliAppid
							})
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
							}
						}
					},
				});
			},
		}
	}
</script>

<style>

</style>