<template>
	<view>
		<view class="listItem flex-col bb" v-for="item,index in list" :key="item.id"
			@click="intoParkingLotDetail(item)">
			<view class="name single-line">{{item.name}}</view>
			<view class="address flex">
				<view v-show="index == 0">距离最近</view>
				<view class="single-line" :style="index > 0 ? 'margin-left:0;' : ''">{{item.address}}</view>
			</view>
			<view class="spaces flex">
				<image src="../../static/images/time@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
				<view style="margin-left: 8rpx">免停时长：{{(item.freeTime / 60000).toFixed(0)}}分钟</view>
				<image src="../../static/images/chewei@2x.png" mode=""
					style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
				<view style="margin-left: 8rpx">车位{{item.parkingSpaceNumber}} |
					可用{{item.parkingSpaceNumber - item.usedParkingSpaceNumber}}</view>
			</view>
			<view class="price flex flex-col-center flex-row-between">
				<view style="color: #f86161">
					<text style="font-size: 24rpx">￥</text>
					<text style="font-size: 48rpx">{{(item.currentPrice).toFixed(2)}}</text>
					<text style="font-size: 24rpx; margin-left: 4rpx">{{ item.feeUnit==1?'次':'小时' }}</text>
				</view>
				<view class="flex distance">
					<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx"></image>
					<view style="text-align: right;">{{(item.distance / 1000).toFixed(2)}}km</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ParkAndCharingList",
		props: [
			'list'
		],
		data() {
			return {

			};
		},
		methods: {
			intoParkingLotDetail(item) {
				uni.navigateTo({
					url: '/pages/parkingLotDetail/parkingLotDetail?id=' + item.id
				});
			}
		}
	}
</script>

<style lang="scss">
	.listItem {
		width: 686rpx;
		background: #ffffff;
		border-radius: 10rpx;
		margin: 0 0 32rpx 32rpx;
		padding: 32rpx;

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
				width: 92rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: rgba(78, 146, 246, 0.13);
				border-radius: 4rpx;
				font-size: 20rpx;

				font-weight: 400;
				color: #4e92f6;
				text-align: center;
			}

			view:nth-child(2) {
				width: 514rpx;
				height: 32rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #434343;
				line-height: 34rpx;
				margin-left: 16rpx;
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
</style>