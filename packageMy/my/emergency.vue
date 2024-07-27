<template>
	<view>
		<picker @change="bindPickerChange" :value="index" :range="list">
			<view class="status flex" style="margin-top: 0;">
				<view class="left">选择通道</view>
				<view class="flex right flex-col-center">
					<view v-if="pickerIndex == 0" class="one">请选择</view>
					<view v-if="pickerIndex > 0" class="two">{{list[pickerIndex - 1]}}</view>
					<image src="../../static/images/Dropdown.png" class="image"></image>
				</view>
			</view>
		</picker>
		<view class="takeapicture flex-col flex-col-center flex-row-center" @click="takeapicture">
			<image src="../../static/images/camera@2x.png"></image>
			<view class="text">点击请拍摄车牌号</view>
		</view>
		<uni-popup ref="popup" @change="popupChange">
			<view class="popupBox bb">
				<view style="width: 100%;text-align: center;margin-top: 32rpx;">请让 {{payCarNumber}} 车主扫码支付</view>
				<image :src="'data:image/png;base64,' + payCodeImage"
					style="width: 80%;height: 80%;margin-left: 10%;margin-top: 32rpx;" mode="">
				</image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		baseUrl
	} from '../../common/config.js'
	import {
		cfCheckPointGetListByQuery,
		parkingDataReporting
	} from '../../network/api.js'
	export default {
		data() {
			return {
				show: false,
				selector: [],
				pickerIndex: 0,
				payCodeImage: '',
				payCarNumber: ''
			}
		},
		onLoad() {
			this.getList()
		},
		computed: {
			list() {
				return this.selector.map(i => i.name)
			}
		},
		methods: {
			popupChange(e) {
				if (!e.show) {
					this.payCarNumber = ''
					this.payCodeImage = ''
				}
			},
			bindPickerChange(e) {
				this.pickerIndex = Number(e.detail.value) + 1
			},
			getList() {
				uni.getLocation({
					success: async (location) => {
						console.log(location);
						var {
							latitude,
							longitude
						} = location
						var res = await cfCheckPointGetListByQuery({
							page: 1,
							size: 20,
							distance: 1000,
							positionX: longitude,
							positionY: latitude
						})
						console.log(res);
						if (res.code == 10002) {
							this.pickerIndex = 1
							this.selector = res.data
						} else {
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
						}
					}
				})

			},
			takeapicture() {
				uni.chooseImage({
					count: 1,
					sourceType: ['camera'],
					sizeType: ['original'],
					success: async (res) => {
						console.log(res);
						const params = {
							image: res.tempFilePaths[0]
						}
						uni.showLoading({
							title: '请稍等',
							icon: 'none'
						});
						console.log({
							checkPointId: this.list[this.pickerIndex - 1],
							file: params.image
						});
						// const {
						// 	data,
						// 	code
						// } = await parkingDataReporting({
						// 	checkPointId: this.selector[this.pickerIndex - 1].id,
						// 	file: params.image
						// })
						uni.uploadFile({
							url: `${baseUrl}/internetOfThingsAdmin/cfCheckPoint/parkingDataReporting`,
							filePath: params.image,
							name: 'file',
							formData: {
								checkPointId: this.selector[this.pickerIndex - 1].id,
								file: params.image
							},
							header: {
								Authorization: uni.getStorageSync('token')
							},
							success: (res) => {
								uni.hideLoading()
								console.log(JSON.parse(res.data));
								var ress = JSON.parse(res.data)
								if (ress.code == 10002) {
									// uni.navigateTo({
									// 	url: 'emergencyOrderDetail?datas=' +
									// 		encodeURIComponent(JSON
									// 			.stringify(ress.data))
									// });

									if (ress.data.feeQrcode) {
										this.$refs.popup.open('bottom')
										this.payCodeImage = ress.data.feeQrcode
										this.payCarNumber = ress.data.numberPlate
									} else {
										uni.showToast({
											title: '二维码为空',
											icon: 'none'
										});
									}
								} else {
									uni.showToast({
										title: ress.message,
										icon: 'none'
									});
								}
							}
						})
					},
					fail(e) {
						console.log(e);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
	}

	.popupBox {
		width: 686rpx;
		height: 684rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-left: 32rpx;
		overflow: hidden;
		margin-bottom: 76rpx;
		padding: 0 34rpx;
	}

	.status {
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;
		margin-top: 24rpx;
		justify-content: space-between;

		.left {
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.7);
			line-height: 44rpx;
			margin: 28rpx 0 0 32rpx;
		}

		.right {
			margin-right: 32rpx;

			.one {
				width: 96rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(50, 50, 51, 0.5);
				line-height: 44rpx;

			}

			.two {
				height: 48rpx;
				font-size: 34rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 48rpx;
			}

			.image {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}

	.takeapicture {
		width: 670rpx;
		height: 360rpx;
		background: #FFFFFF;
		border-radius: 18rpx;
		margin: 24rpx 0 0 40rpx;

		image {
			width: 64rpx;
			height: 64rpx;
		}

		.text {
			width: 256rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #9B9C9E;
			line-height: 44rpx;
			margin-top: 12rpx;
		}
	}
</style>