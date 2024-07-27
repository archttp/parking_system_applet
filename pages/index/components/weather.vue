<template>
	<view>
		<view class="weatherBox flex-col bb por">
			<view class="flex flex-col-center top">
				<view class="temperature">{{weatherInfo.tem}}℃</view>
				<view>{{weatherInfo.wea}}</view>
			</view>
			<view class="flex bottom">
				<view class="single-line">空气质量：{{weatherInfo.air}}</view>
			</view>
			<!-- 		<image src="../../../static/images/scan.png" style="width: 86rpx;height: 86rpx;right:32rpx;top:20rpx"
				class="poa" @click="onScan"></image> -->
		</view>
	</view>
</template>

<script>

	import {
		tianQiAppid, tianQiAppsecret, weatherURL
	} from '../../../common/config.js'

	export default {
		data() {
			return {
				weatherInfo: {
					tem: '',
					wea: '',
					air: '',
				},
			}
		},
		created() {
			this.getWeatherInfo()
		},
		methods: {
			getWeatherInfo() {
				uni.request({
					url: weatherURL+`/free/day?appid=`+tianQiAppid+`&appsecret=`+tianQiAppsecret+`&unescape=1`,
					success: (fenchRes) => {
						console.log(fenchRes);
						this.weatherInfo = fenchRes.data
					}
				})
			},
			onScan() {
				uni.showActionSheet({
					itemList: ['后台登录扫码'],
					success({
						tapIndex
					}) {
						if (tapIndex === 0) {
							uni.showLoading()
							uni.scanCode({
								success: ({
									errMsg,
									result
								}) => {
									uni.hideLoading()
									if (errMsg === 'scanCode:ok') {
										const info = JSON.parse(result)
										console.log(info);
										uni.showModal({
											title: '提示',
											content: '您确认登录吗?',
											success: async ({
												confirm
											}) => {
												if (confirm) {
													const scanLoginQrCodeRes =
														await scanLoginQrCode({
															qrCodeId: info.id,
															randomCode: info
																.randomCode,
														})
													if (scanLoginQrCodeRes.code ===
														10002) {
														const scanRes =
															await qrCodeLoginConfirmation({
																qrCodeId: scanLoginQrCodeRes
																	.data.id
															})
														uni.showToast({
															title: scanRes.message,
															icon: 'none'
														})
													} else {
														uni.showToast({
															title: scanLoginQrCodeRes
																.message,
															icon: 'none'
														})
													}
												}
											}
										})
									}
								}
							})
						}
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	.weatherBox {
		width: 750rpx;
		height: 160rpx;
		padding: 0 32rpx;

		.top {
			view:first-child {
				height: 84rpx;
				font-size: 60rpx;
				font-weight: 500;
				color: rgba(255, 255, 255, 0.87);
				line-height: 84rpx;
			}

			view:nth-child(2) {
				height: 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.87);
				line-height: 40rpx;
				margin-left: 16rpx;
			}
		}

		.bottom {
			view {
				width: 100%;
				height: 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.87);
				line-height: 40rpx;
			}
		}
	}
</style>