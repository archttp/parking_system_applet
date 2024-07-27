<template>
	<view>
		<div class="Box flex-col bb">
			<view class="nums" v-if="!isLogin">请点击任意位置登陆</view>
			<view class="nums" v-if="couponDetail.sourceType == 1">{{couponDetail.quantity}} 次</view>
			<view class="nums" v-if="couponDetail.sourceType == 2">{{couponDetail.quantity}} 元</view>
			<view class="nums" v-if="couponDetail.sourceType == 3">{{couponDetail.quantity / 3600000}} 小时</view>
			<view class="title">停车场停车优惠券</view>
			<view class="itemClass">请于：{{eTime}} 前领取</view>
			<view class="itemClass">使用方式：自动抵扣</view>
			<view class="add" @click="plateShow = true">{{status ? '已领取' : '立即领取'}}</view>
		</div>

		<plate-input v-if="plateShow" :plate="plateNo" @close="plateShow=false" @export="setPlate"></plate-input>
		<!-- #ifdef MP-WEIXIN -->
		<wxmpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<alimpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
	</view>
</template>

<script>

	let interstitialAd = null;

	import {
		getListByIdAnd,
		drawCouponByQrCode
	} from '../../network/api.js'
	import dayjs from 'dayjs'
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	import {
		wxmpLogin
	} from '../../components/wxmpLogin/wxmpLogin.vue'
	import {
		alimpLogin
	} from '../../components/alimpLogin/alimpLogin.vue'
	import {
		getCouponWxMpAdId
	} from '../../common/config.js'

	export default {
		components: {
			plateInput,
			wxmpLogin,
			alimpLogin
		},
		data() {
			return {
				codeId: '',
				randomCode: '',
				sTime: '',
				eTime: '',
				plateNo: '',
				couponDetail: {
					sourceType: 0
				},
				plateShow: false,
				isLogin: false,
				status: 0, // 0未领取 1已领取
			}
		},
		onLoad(e) {
			const q = decodeURIComponent(e.q)
			const info = this.extractCodeIdAndRandomCode(q)
			this.codeId = info.codeId
			this.randomCode = info.randomCode

			if (uni.getStorageSync('token')) {
				this.isLogin = true
				this.getCouponInfo()
			} else {
				this.isLogin = false
			}

			// #ifdef MP-WEIXIN
			// 在页面onLoad回调事件中创建插屏广告实例
			if (uni.createInterstitialAd) {
			  interstitialAd = uni.createInterstitialAd({
			    adUnitId: getCouponWxMpAdId
			  })
			  interstitialAd.onLoad(() => {})
			  interstitialAd.onError((err) => {})
			  interstitialAd.onClose(() => {})
			}

			// 在适合的场景显示插屏广告
			if (interstitialAd) {
			  interstitialAd.show().catch((err) => {
			    console.error(err)
			  })
			}
			// #endif
		},
		methods: {
			changeLoginStatus(e) {
				if (e) {
					this.isLogin = true
					this.getCouponInfo()
				} else {
					this.isLogin = false
				}
			},
			setPlate(plate) {
				if (plate.length >= 7) this.plateNo = plate
				this.plateShow = false
				uni.showModal({
					title: '提示',
					content: `领取到${plate} 您确定吗？`,
					success: async ({
						confirm
					}) => {
						if (confirm) {
							const {
								data,
								code,
								message
							} = await drawCouponByQrCode({
								randomCode: this.randomCode,
								qrCodeId: this.codeId,
								targetObject: this.plateNo,
							})
							if (code === 10002) {
								this.plateShow = false
								this.status = 1
								uni.showToast({
									title: '领取成功',
									icon: 'none'
								})
							} else {
								uni.showToast({
									title: message,
									icon: 'none'
								})
							}
						}
					}
				})
			},
			async getCouponInfo() {
				const {
					data,
					code
				} = await getListByIdAnd({
					randomCode: this.randomCode,
					id: this.codeId
				})
				console.log(data);
				if (code === 10002) {
					this.couponDetail = data
					this.getCnTime()
				} else {
					uni.showToast({
						title: '加载优惠券信息失败',
						icon: "none"
					})
				}
			},
			getCnTime() {
				const createTime = Number(this.couponDetail.createTime)
				const expirationTime = Number(this.couponDetail.expirationTime)
				this.sTime = dayjs(createTime).format('YYYY-MM-DD')
				this.eTime = dayjs(expirationTime).format('YYYY-MM-DD HH:mm:ss')
			},
			extractCodeIdAndRandomCode(url) {
				const codeIdMatch = url.match(/codeId\/(\d+)/);
				const randomCodeMatch = url.match(/RandomCode\/([^;/]+)/);
				const codeId = codeIdMatch ? codeIdMatch[1] : null;
				const randomCode = randomCodeMatch ? randomCodeMatch[1] : null;
				return {
					codeId,
					randomCode
				};
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
	}

	.Box {
		width: 670rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 16rpx 22rpx 0rpx rgba(10, 36, 99, 0.07);
		border-radius: 24rpx;
		margin: 92rpx 0 0 40rpx;
		padding: 62rpx 40rpx;

		.nums {
			height: 84rpx;
			font-size: 60rpx;
			font-weight: 600;
			color: #DEB19B;
			line-height: 84rpx;
			align-self: center;
		}

		.title {
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #323233;
			line-height: 50rpx;
			margin-top: 16rpx;
			align-self: center;
			margin-bottom: 48rpx;
		}

		.itemClass {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.7);
			line-height: 40rpx;
			max-width: 590rpx;
			margin-bottom: 24rpx;
		}

		.add {
			width: 590rpx;
			height: 100rpx;
			background: #DEB19B;
			border-radius: 16rpx;
			height: 100rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 100rpx;
			text-align: center;
			margin-top: 184rpx;
		}
	}
</style>