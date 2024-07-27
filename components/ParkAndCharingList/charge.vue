<template>
	<view>
		<view class="listItem flex-col bb" v-for="item,index in list" :key="item.id" @click="intoChargeDetail(item)">
			<view class="name single-line">{{item.stationName || item.title}}</view>
			<view class="address flex">
				<view v-show="index == 0">距离最近</view>
				<view class="single-line" :style="index > 0 ? 'margin-left:0;' : ''">{{item.address}}</view>
			</view>
			<view class="spaces flex flex-row-between">
				<view>停车费: {{item.stationName == null ? '暂无数据' : '免停' + item.freeParkTime / 60000 + '分钟'}}</view>、
				<view class="flex">
					<image src="../../static/images/man@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
					<view style="margin-left: 8rpx">
						{{item.stationName == null ? '暂无数据' : item.usedSlowChargeNumber + '/' + item.slowChargeNumber}}
					</view>
					<image src="../../static/images/kuai@2x.png" mode=""
						style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
					<view style="margin-left: 8rpx">
						{{item.stationName == null ? '暂无数据' : item.usedFastChargeNumber + '/' + item.fastChargeNumber}}
					</view>
				</view>
			</view>
			<view class="price flex flex-col-center flex-row-between">
				<view style="color: #f86161">
					<text style="font-size: 24rpx">￥</text>
					<text
						:style="item.stationName == null ? 'font-size: 24rpx' : 'font-size: 48rpx'">{{item.stationName == null ? '暂无数据' : item.serviceFee}}</text>
				</view>
				<view class="flex distance">
					<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx"></image>
					<view style="text-align: right;">
						{{item.stationName == null ? (item._distance / 1000).toFixed(2) : (item.distance / 1000).toFixed(2)}}km
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: [
			'list'
		],
		data() {
			return {

			};
		},
		methods: {
			intoChargeDetail(item) {
				// 判断是否为内部 还是 外部 车场
				if (item.stationName == null) {
					uni.showActionSheet({
						itemList: ['导航去此停车场'],
						success: ({
							tapIndex
						}) => {
							if (tapIndex === 0) {
								uni.openLocation({
									latitude: item.location.lat,
									longitude: item.location.lng,
									name: item.title,
									address: item.address
								});
							}
						}
					})
				} else {
					uni.navigateTo({
						url: '/pages/chargeDetail/index?id=' + item.id
					});
				}
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