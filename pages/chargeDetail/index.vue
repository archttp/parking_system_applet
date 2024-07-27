<template>
	<view>
		<view class="bgBox">
			<view class="flex">
				<image class="backIcon" src="../../static/images/jiantouLeft.png" mode="" @click="intoBack"></image>
				<view class="navTitle">车场详情</view>
			</view>
			<view class="infoBox flex-col bb">
				<view class="name">{{ changeInfo.stationName }}</view>
				<view class="address flex">
					<view class="single-line">{{ changeInfo.address }}</view>
				</view>
				<view class="spaces flex flex-row-between">
					<view class="flex">
						停车费：免费停车{{ (changeInfo.freeParkTime / 60000).toFixed(0) }}分钟
					</view>

					<view class="flex">
						<image src="../../static/images/man@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
						<view style="margin-left: 8rpx">
							{{
                changeInfo.stationName == null ? '暂无数据' : changeInfo.usedSlowChargeNumber + '/' + changeInfo.slowChargeNumber
              }}
						</view>
						<image src="../../static/images/kuai@2x.png" mode=""
							style="width: 32rpx; height: 32rpx; margin-left: 14rpx" />
						<view style="margin-left: 8rpx">
							{{
                changeInfo.stationName == null ? '暂无数据' : changeInfo.usedFastChargeNumber + '/' + changeInfo.fastChargeNumber
              }}
						</view>
					</view>
				</view>
				<view class="price flex flex-col-center flex-row-between">
					<view class="flex distance">
						<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx">
						</image>
						<view>距你{{(changeInfo.distance / 1000).toFixed(2)}}km</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="flex flex-row-between" style="margin-top: 32rpx;">
					<view class="flex-col flex-col-center" v-for="item in iconStatusArr" :key="item.icon">
						<image :src="'../../static/images/' + item.icon + '.png'" mode=""
							style="width: 48rpx;height: 48rpx;">
						</image>
						<view style="font-size: 22rpx;font-weight: 400;color: #323233;margin-top: 8rpx;">{{ item.name }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="imageBox">
			<scroll-view :scroll-x="true" style="width: 100%;height: 100%;display: flex; white-space:nowrap;">
				<image class="scrollViewImage" :src="item" v-for="item,index in changeInfo.newImageUrl" :key="item"
					@click="previewImage(index)"></image>
			</scroll-view>
		</view>
		<view class="feeBox bb">
			<view class="name">忙闲情况</view>
			<view class="flex flex-row-between" style="margin-top: 54rpx;">
				<view class="flex-col flex-col-center">
					<view class="changeStatusBox_text flex">
						<view style="line-height: 42rpx;">闲</view>
						<view style="font-size: 42rpx;color: #000;font-weight: 900;margin-left: 6rpx;">
							{{changeInfo.usedFastChargeNumber}}
						</view>
						<view style="line-height: 42rpx;margin-left: 6rpx;">/{{changeInfo.fastChargeNumber}}</view>
					</view>
					<view class="changeStatusBox_red">快桩空闲</view>
				</view>
				<view class="flex-col flex-col-center">
					<view class="changeStatusBox_text flex">
						<view style="line-height: 42rpx;">闲</view>
						<view style="font-size: 42rpx;color: #000;font-weight: 900;margin-left: 6rpx;">
							{{changeInfo.usedSlowChargeNumber}}
						</view>
						<view style="line-height: 42rpx;margin-left: 6rpx;">/{{changeInfo.slowChargeNumber}}</view>
					</view>
					<view class="changeStatusBox_blue">慢桩空闲</view>
				</view>
				<view class="flex-col flex-col-center">
					<view
						style="line-height: 22rpx;font-size: 42rpx;color: #000;font-weight: 900;text-align: center;height: 66rpx;">
						-
					</view>
					<view class="changeStatusBox_gray">即将充满</view>
				</view>
			</view>
		</view>
		<view class="feeBox bb">
			<view class="name">充电费用</view>
			<view class="feeBox_item1 bb flex flex-col-center">
				<view style="margin-left: 32rpx;">
					收费时段
				</view>
				<view style="margin-left: 156rpx;">充电费</view>
				<view style="margin-left: 26rpx;">=</view>
				<view style="margin-left: 34rpx;">电费</view>
				<view style="margin-left: 50rpx;">服务费</view>
			</view>

			<view class="feeBox_item2 bb flex flex-col-center" v-for="item in rulesList" :key="item.id">
				<view style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 24rpx;">
					{{ item.startTimeString + ' - ' + item.endTimeTimeString }}
				</view>
				<view
					style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 62rpx;width: 60rpx;text-align: center;">
					{{item.fee + item.serviceFee}}
				</view>
				<view
					style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 72rpx;width: 60rpx;text-align: center;">
					{{item.fee}}
				</view>
				<view
					style="font-size: 24rpx;color: #434343;font-weight: 500;margin-left: 56rpx;width: 60rpx;text-align: center;">
					{{item.serviceFee}}
				</view>
			</view>
		</view>
		<view class="feeBox bb" v-if="changeInfo.stationType !== 1">
			<view class="name">停车费</view>
			<view class="flex" style="margin-top: 40rpx;">
				<view class="feeBoxItem1 bb">停车费</view>
				<view class="feeBoxItem2 bb">免费停车 {{changeInfo.freeParkTime / 60000}} 分钟</view>
			</view>
			<view class="feeBoxText">该站点充电即可免费停车 {{changeInfo.freeParkTime / 60000}}分钟（充电启动前，请确认输入车牌是否准确）</view>
		</view>
		<uni-safe-area>
			<view class="bottomBox bb flex flex-col-center flex-row-between">
				<view class="left flex flex-col-center flex-row-center" @click="onNavigation">
					<image src="../../static/images/feiji@2x.png" mode=""></image>
					<view class="text">导航</view>
				</view>

				<view class="right flex flex-col-center flex-row-center" @click="onScanChange">
					<image src="../../static/images/VIP@2x(3).png" mode=""></image>
					<view class="text">开始充电</view>
				</view>
			</view>
		</uni-safe-area>
	</view>
</template>

<script>
	import {
		cfChargingStationGetInfoById,
		getChargeRulesListByQuery
	} from '../../network/api.js'

	export default {
		data() {
			return {
				iconStatusArr: [{
					name: '充电桩',
					icon: 'cdz@2x',
					status: false
				}, {
					name: '便利店',
					icon: 'bianlidian@2x',
					status: false
				}, {
					name: '卫生间',
					icon: 'wsj@2x',
					status: false
				}, {
					name: '休息室',
					icon: 'xxs@2x',
					status: false
				}, {
					name: '雨棚',
					icon: 'yupeng@2x',
					status: false
				}, {
					name: '简餐',
					icon: 'jz@2x',
					status: false
				}, {
					name: '人工值守',
					icon: 'rgzs@2x',
					status: false
				}],
				chargeId: '',
				changeInfo: {
					name: '',
					address: '',
					freeTime: '',
					parkingSpaceNumber: '',
					usedParkingSpaceNumber: '',
					distance: 0,
					freeParkTime: 0,
					usedFastChargeNumber: 0,
					fastChargeNumber: 0,
					usedSlowChargeNumber: 0,
					slowChargeNumber: 0,
				},
				rulesList: [],
				locationInfo: {
					longitude: "",
					latitude: "",
				},
			}
		},
		onLoad(e) {
			this.chargeId = e.id
			this.getLocation()
		},
		methods: {
			getLocation() {
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						console.log("当前位置的经度：" + res.longitude);
						console.log("当前位置的纬度：" + res.latitude);
						this.locationInfo.longitude = res.longitude;
						this.locationInfo.latitude = res.latitude;
						this.fenchData()
						this.fenchRulesData()
					},
				});
			},
			onScanChange() {
				uni.showActionSheet({
					itemList: ['扫码充电', '查看充电桩'],
					success: ({
						tapIndex
					}) => {
						if (tapIndex === 0) {
							uni.scanCode({
								success: (scanRes) => {
									console.log(scanRes);
								}
							})
						} else if (tapIndex === 1) {
							if (this.changeInfo.stationType === 2) {
								uni.navigateTo({
									url: '/pages/chargeDetail/electricVehicleStart?chargeId=' + this
										.chargeId
								})
							} else {
								uni.navigateTo({
									url: '/pages/chargeDetail/bicycleStart?chargeId=' + this
										.chargeId
								})
							}
						}
					}
				})
			},
			intoBack() {
				uni.navigateBack()
			},
			onNavigation() {
				uni.openLocation({
					latitude: this.changeInfo.positionY,
					longitude: this.changeInfo.positionX,
					name: this.changeInfo.stationName,
					address: this.changeInfo.address,
					success: function() {
						console.log('success');
					}
				});
			},
			async fenchRulesData() {
				const {
					data,
					code,
					message
				} = await getChargeRulesListByQuery({
					chargingStationId: this.chargeId,
					page: 1,
					size: 100
				})
				console.log(data, code);
				if (code == 10002) {
					this.rulesList = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			async fenchData() {
				const {
					data,
					code
				} = await cfChargingStationGetInfoById({
					id: this.chargeId,
					positionX: this.locationInfo.longitude,
					positionY: this.locationInfo.latitude,
				})
				console.log(data, code);
				if (code == 10002) {
					this.changeInfo = data
					this.changeInfo.newImageUrl = this.changeInfo.imageUrl.split(',')
				} else {
					uni.showToast({
						title: '获取停车场详情失败',
						icon: 'none'
					})
					setTimeout(function() {
						uni.navigateBack()
					}, 1500);
				}
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.changeInfo.newImageUrl
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
		padding-bottom: 200rpx;
	}

	.bottomBox {
		width: 750rpx;
		height: 165rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -12rpx 14rpx 0rpx rgba(222, 220, 238, 0.5);
		position: fixed;
		left: 0;
		bottom: 0;
		padding: 0 32rpx;
		overflow: hidden;
		padding-bottom: 20rpx;

		.left {
			width: 332rpx;
			height: 100rpx;
			background: rgba(03, 148, 246, 0.18);
			border-radius: 10rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			.text {
				height: 50rpx;
				font-size: 36rpx;
				font-weight: 600;
				color: #6794F6;
				line-height: 50rpx;
				margin-left: 12rpx;
			}
		}

		.right {
			width: 332rpx;
			height: 100rpx;
			background: #6794F6;
			border-radius: 10rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			.text {
				height: 50rpx;
				font-size: 36rpx;
				font-weight: 600;
				color: #FFFFFF;
				line-height: 50rpx;
				margin-left: 12rpx;
			}
		}
	}

	.imageBox {
		width: 686rpx;
		height: 216rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin-left: 32rpx;
	}

	.feeBox {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		margin: 32rpx 0 0 32rpx;
		padding: 32rpx;

		.feeBox_item2 {
			width: 622rpx;
			height: 70rpx;
			background: #F8F8F8;
			border-radius: 8rpx;
			margin-top: 28rpx;
			// padding: 20rpx 24rpx;
		}

		.feeBox_item1 {
			width: 622rpx;
			height: 70rpx;
			background: rgba(103, 148, 246, 0.1);
			border-radius: 8rpx;
			border: 2rpx solid #6794F6;
			margin-top: 24rpx;
			font-size: 24rpx;
			color: #6794F6;
			font-weight: 400;
			// padding: 20rpx 24rpx 16rpx 24rpx;
		}

		.name {
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #323233;
			line-height: 50rpx;
		}
	}

	.scrollViewImage {
		width: 262rpx;
		height: 152rpx;
		border-radius: 16rpx;
		margin: 32rpx 0 0 32rpx;
		display: inline-block;
	}

	.price {
		margin-top: 24rpx;

		.distance {
			view:nth-child(2) {
				height: 34rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #434343;
				line-height: 34rpx;
				margin-left: 8rpx;
			}
		}
	}

	.changeStatusBox_text {
		height: 66rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.5);
		line-height: 34rpx;
	}

	.changeStatusBox_red {
		width: 120rpx;
		height: 44rpx;
		background: rgba(255, 158, 158, .34);
		border-radius: 22rpx;
		font-size: 22rpx;
		font-weight: 600;
		color: #FF7777;
		line-height: 44rpx;
		text-align: center;
	}

	.changeStatusBox_blue {
		background: rgba(168, 179, 255, .34);
		color: #8393FD;
		@extend .changeStatusBox_red;
	}

	.changeStatusBox_gray {
		background: rgba(190, 194, 223, .34);
		color: #A1A3B1;
		@extend .changeStatusBox_red;
	}

	.bgBox {
		width: 750rpx;
		height: 666rpx;
		background: linear-gradient(360deg, #F5F7FF 0%, #A6C1FB 100%);

		.backIcon {
			width: 64rpx;
			height: 64rpx;
			margin: 100rpx 0 0 32rpx;
		}

		.navTitle {
			width: 160rpx;
			height: 56rpx;
			font-size: 40rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 56rpx;
			margin: 100rpx 0 0 190rpx;
		}

		.infoBox {
			width: 686rpx;
			height: 415rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			margin: 60rpx 0 0 32rpx;
			padding: 32rpx;

			.line {
				width: 630rpx;
				opacity: 0.43;
				border: 2rpx dashed #979797;
				margin: 42rpx 0 0 0;
			}

			.name {
				height: 50rpx;
				font-size: 36rpx;
				font-weight: 600;
				color: #323233;
				line-height: 50rpx;
			}

			.address {
				margin-top: 8rpx;

				view:nth-child(1) {
					width: 514rpx;
					height: 32rpx;
					font-size: 24rpx;

					font-weight: 400;
					color: #434343;
					line-height: 34rpx;
				}
			}

			.spaces {
				height: 32rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
				margin-top: 16rpx;
			}
		}
	}

	.feeBoxItem1 {
		width: 92rpx;
		height: 50rpx;
		background: linear-gradient(138deg, #A0C6FB 0%, #6794F6 100%);
		border-radius: 6rpx 0rpx 0rpx 6rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 50rpx;
		text-align: center;
	}

	.feeBoxItem2 {
		height: 50rpx;
		border-radius: 0rpx 6rpx 6rpx 0;
		border: 2rpx solid #6794F6;
		font-size: 24rpx;
		font-weight: 400;
		color: #6D99F7;
		line-height: 50rpx;
		text-align: center;
		padding: 0 16rpx;
	}

	.feeBoxText {
		width: 622rpx;
		height: 70rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #434343;
		line-height: 34rpx;
		margin-top: 24rpx;
	}
</style>