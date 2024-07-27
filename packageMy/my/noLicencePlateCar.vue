<template>
	<view>
		<image src="http://file.cfeng.wang/scancodeBg.png"
			style="width: 710rpx;height: 712rpx;margin: 118rpx 0 0 40rpx;"></image>
		<view class="onButton" @click="onAdmission">开闸/降锁</view>

		<!-- #ifdef MP-WEIXIN -->
		<wxmpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<alimpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->

		<bindPhonePopup ref="bindPhonePopupRef" @closePhoneShow='closePhoneShow' />

	</view>
</template>

<script>
	import {
		applyFoPassage
	} from '../../network/api.js'
	import wxmpLogin from '../../components/wxmpLogin/wxmpLogin.vue'
	import alimpLogin from '../../components/alimpLogin/alimpLogin.vue'
	import bindPhonePopup from '../../components/bindPhonePopup/index.vue'

	export default {
		components: {
			alimpLogin,
			wxmpLogin,
			bindPhonePopup
		},
		data() {
			return {
				isLogin: false,
				checkPointId: '',
				code: '',
				scene: '',
				deviceId: ''
			}
		},
		onLoad(e) {
			if (uni.getStorageSync('token')) {
				this.isLogin = true
			} else {
				this.isLogin = false
			}
			const q = decodeURIComponent(e.q)
			console.log(this.extractSceneAndDeviceId(q));
			const queryInfo = this.extractSceneAndDeviceId(q)
			this.scene = queryInfo.scene
			this.deviceId = queryInfo.deviceId
		},

		methods: {
			changeLoginStatus(e) {
				if (e) {
					this.isLogin = true
				} else {
					this.isLogin = false
				}
			},
			// 扫码开关闸
			async onAdmission() {
				const user = uni.getStorageSync('user')
				if (!user.phone) {
					this.$refs.bindPhonePopupRef.showPopup()
					return
				}


				const {
					data,
					code,
					message
				} = await applyFoPassage({
					deviceId: this.deviceId,
					scene: this.scene
				})
				uni.showToast({
					title: message,
					icon: 'none'
				});
				if (code === 10002) {
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}, 1500);
				}
			},
			extractSceneAndDeviceId(url) {
				const pattern = /scene\/([a-zA-Z]+)\/deviceId\/(\d+)/;
				const matches = url.match(pattern);
				if (!matches) {
					return null;
				}
				const scene = matches[1];
				const deviceId = matches[2];
				return {
					scene,
					deviceId,
				};
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FAFCFF;
	}

	.onButton {
		width: 590rpx;
		height: 100rpx;
		background: #488CF5;
		border-radius: 200rpx;
		margin: 156rpx 0 0 80rpx;
		font-size: 36rpx;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 100rpx;
		text-align: center;
	}
</style>