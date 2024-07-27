<template>
	<view>
		<view class="bgBox">
			<view class="flex">
				<image class="backIcon" src="../../static/images/jiantouLeft.png" mode="" @click="intoBack"></image>
				<view class="navTitle">车场详情</view>
			</view>
			<view class="infoBox flex-col bb">
				<view class="name">{{parkInfo.name}}</view>
				<view class="address flex">
					<view>{{parkInfo.address}}</view>
				</view>
				<view class="spaces flex">
					<image src="../../static/images/time@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
					<view style="margin-left: 8rpx">免停时长：{{(parkInfo.freeTime / 60000).toFixed(0)}}分钟</view>
					<image src="../../static/images/chewei@2x.png" mode=""
						style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
					<view style="margin-left: 8rpx">{{parkInfo.parkingSpaceNumber}} |
						可用{{parkInfo.parkingSpaceNumber - parkInfo.usedParkingSpaceNumber}}</view>
				</view>
				<view class="price flex flex-col-center flex-row-between">
					<view class="flex distance">
						<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx">
						</image>
						<view>距你{{(parkInfo.distance / 1000).toFixed(2)}}km公里</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="flex flex-row-between" style="margin-top: 32rpx;">
					<view class="flex-col flex-col-center" v-for="item in iconStatusArr" :key="item.icon">
						<image :src="'../../static/images/' + item.icon + '.png'" mode=""
							style="width: 48rpx;height: 48rpx;">
						</image>
						<view style="font-size: 22rpx;font-weight: 400;color: #323233;margin-top: 8rpx;">{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="imageBox">
			<scroll-view :scroll-x="true" style="width: 100%;height: 100%;display: flex; white-space:nowrap;">
				<image class="scrollViewImage" :src="item" v-for="item,index in parkInfo.newImageUrl" :key="item"
					@click="previewImage(index)"></image>
			</scroll-view>
		</view>
		<view class="feeBox bb">
			<view class="name">临停费用</view>
			<!-- <view class="feeBox_item1 bb">24:00:00-06:00:00临时车只出不进</view> -->
			<view class="feeBox_item2 bb flex flex-row-between" v-for="item in rulesList" :key="item.id">
				<view style="font-size: 24rpx;color: #434343;font-weight: 500;">
					{{item.startTimeString + ' - ' + item.endTimeTimeString}}
				</view>
				<view style="font-size: 24rpx;color: #434343;font-weight: 500;">￥{{item.fee}}/小时</view>
			</view>
		</view>
		<uni-safe-area>
			<view class="bottomBox bb flex flex-col-center flex-row-between">
				<view class="left flex flex-col-center flex-row-center" @click="onNavigation">
					<image src="../../static/images/feiji@2x.png" mode=""></image>
					<view class="text">导航</view>
				</view>
				<view class="right flex flex-col-center flex-row-center" @click="onOpenMonthlyCard">
					<image src="../../static/images/VIP@2x.png" mode=""></image>
					<view class="text">开通月卡</view>
				</view>
			</view>
		</uni-safe-area>
	</view>
</template>

<script>
	import {
		getCarParkInfoById,
		getChargingRulesListByQuery
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
				parkId: '',
				parkInfo: {
					name: '',
					address: '',
					freeTime: '',
					parkingSpaceNumber: '',
					usedParkingSpaceNumber: '',
					distance: 0,
				},
				rulesList: [],
				locationInfo: {
					longitude: "",
					latitude: "",
				},
			}
		},
		onLoad(e) {
			this.parkId = e.id
			this.getLocation()
			// this.fenchData()
			// this.fenchRulesData()
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
			onOpenMonthlyCard() {
				uni.navigateTo({
					url: '/pages/monthlyCard/choosePackage?parkId=' + this.parkId + '&parkName=' + this.parkInfo
						.name
				})
			},
			intoBack() {
				uni.navigateBack()
			},
			onNavigation() {
				uni.openLocation({
					latitude: this.parkInfo.positionY,
					longitude: this.parkInfo.positionX,
					name: this.parkInfo.name,
					address: this.parkInfo.address,
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
				} = await getChargingRulesListByQuery({
					carParkId: this.parkId,
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
				} = await getCarParkInfoById({
					carParkId: this.parkId,
					positionX: this.locationInfo.longitude,
					positionY: this.locationInfo.latitude,
				})
				console.log(data, code);
				if (code == 10002) {
					this.parkInfo = data
					if (this.parkInfo.imageUrl) {
						this.parkInfo.newImageUrl = this.parkInfo.imageUrl.split(',')
					}
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
					urls: this.parkInfo.newImageUrl
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
			padding: 20rpx 24rpx;
		}

		.feeBox_item1 {
			width: 622rpx;
			height: 64rpx;
			background: rgba(255, 103, 103, 0.15);
			border-radius: 10rpx;
			border: 2rpx solid rgba(255, 103, 103, 0.32);
			margin-top: 24rpx;
			font-size: 24rpx;

			font-weight: 400;
			color: #FF6767;
			line-height: 64rpx;
			padding-left: 26rpx;
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
					height: 57rpx;
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
</style>