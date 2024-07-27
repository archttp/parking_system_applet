<template>
	<view>
		<view class="addCarBox flex flex-row-center flex-col-center bb" @click="intoSelectParkingLot">
			<image src="../../static/images/Add_pink.png"></image>
			<view class="text">去开卡</view>
		</view>

		<view class="mySetMeal por flex-col" v-if="!parkingCardList.length">
			<view class="title1">我的停车套餐卡</view>
			<view class="title2">您还未升级停车场套餐卡，快快体验吧</view>
			<image src="http://file.cfeng.wang/Upgrade.png" class="upgrade" @click="intoSelectParkingLot"></image>
			<!-- 装饰图片 -->
			<image src="../../static/images/zs.png" class="zs poa"></image>
		</view>

		<view v-else>
			<view class="mySetMeal por flex-col" v-for="item in parkingCardList" :key='item.id'>
				<view
					style="height: 44rpx;font-size: 32rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #323233;line-height: 44rpx;margin: 32rpx 0 0 40rpx;">
					{{item.packageProductName}}
				</view>
				<view class="flex" style="margin-top: 20rpx;">
					<view
						style="font-size: 28rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #323233;line-height: 40rpx;margin-left: 40rpx;">
						{{item.numberPlate}}
					</view>
					<view class="expirationPrompt">{{calculation(item.endTime)}}</view>
				</view>
				<div class="carParkName">{{item.carParkName}}</div>
				<image src="http://file.cfeng.wang/Renew.png" class="poa"
					style="width: 220rpx;height: 108rpx;right: 0;bottom: 0;" @click="onRenew(item)"></image>
				</image>
				<!-- 装饰图片 -->
				<image src="../../static/images/zs.png" class="zs poa"></image>
			</view>
		</view>




	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import {
		getMyCarParkPackageProductListByQuery
	} from '../../network/api.js'
	export default {
		data() {
			return {
				parkingCardList: []
			}
		},
		onLoad() {
			this.parkingCard()
		},
		methods: {
			// 点击续费
			async onRenew(item) {
				uni.navigateTo({
					url: '/pages/monthlyCard/pay?id=' +item.packageProductId + '&licensePlate=' + item.numberPlate + '&packageId=' + item.id
				})
			},
			calculation(endTime) {
				if (dayjs().valueOf() > endTime) {
					return '已过期'
				}
				var nTime = new Date()
				var time = Math.floor((endTime - nTime) / (1000 * 60 * 60 * 24))
				if (time < 0) return ''
				return time + '天到期'
			},
			async parkingCard() {
				var {
					code,
					data
				} = await getMyCarParkPackageProductListByQuery({
					page: 1,
					size: 999
				})
				if (code === 10002) {
					this.parkingCardList = data
				}
			},
			intoSelectParkingLot() {
				uni.navigateTo({
					url: '/pages/monthlyCard/index'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
	}

	.expirationPrompt {
		height: 32rpx;
		border-radius: 4rpx;
		border: 2rpx solid #FF5151;
		font-size: 20rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FF5151;
		line-height: 32rpx;
		margin-left: 16rpx;
		padding: 0 5rpx;
	}

	.carParkName {
		width: 590rpx;
		height: 72rpx;
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.5);
		line-height: 36rpx;
		margin: 8rpx 0 0 40rpx;
	}

	.addCarBox {
		width: 670rpx;
		height: 136rpx;
		background: rgba(222, 177, 155, 0.08);
		border-radius: 12rpx;
		border: 3rpx dashed #DEB19B;
		margin: 46rpx 0 0 40rpx;
		margin-bottom: 32rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}

		.text {
			height: 50rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #DEB19B;
			line-height: 50rpx;
		}
	}

	.mySetMeal {

		width: 670rpx;
		height: 328rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 22rpx 0rpx rgba(151, 151, 151, 0.2);
		border-radius: 16rpx;
		margin: 0rpx 0 32rpx 32rpx;

		.zs {
			width: 176rpx;
			height: 176rpx;
			top: 0;
			right: 0;
		}

		.title1 {
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 44rpx;
			margin-left: 32rpx;
			margin-top: 32rpx;
		}

		.title2 {
			height: 36rpx;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.5);
			line-height: 36rpx;
			margin-left: 32rpx;
			margin-top: 12rpx;
		}

		.upgrade {
			width: 242rpx;
			height: 108rpx;
			margin-left: 8rpx;
			margin-top: 24rpx;
		}
	}
</style>