<template>
	<view>
		<view class="head">
			<view class="tab">
				<view :class="{ 'active': active==1 }" @click="swActive(1)" style="margin-left: 140rpx;">未使用</view>
				<view :class="{ 'active': active==0 }" @click="swActive(0)" style="margin-left: 76rpx;">已使用</view>
				<view :class="{ 'active': active==2 }" @click="swActive(2)" style="margin-left: 80rpx;">已过期</view>
			</view>
		</view>
		<view style="height: 120rpx;"></view>
		<view class="flex-col">
			<view class="couponBox por flex" @click="onCoupon(item)" v-for="item in couponList">
				<image :src="'../../static/images/' + (active == 1 ? 'couponUnused2' : 'couponNo') + '.png'"
					class="couponUnused"></image>
				<view class="price">
					{{item.couponType == 3 ? (item.denomination / 3600000).toFixed() : item.denomination}}{{item.couponType == 1 ?  '次' : item.couponType == 2 ? '元' : '小时'}}
				</view>

				<view class="info">
					<view class="title">
						{{item.couponType == 1 ?  '次数券' : item.couponType == 2 ? '金额券' : '时长券'}}
					</view>
					<view class="subtitle">
						赠送人：{{item.fromUserName}}
					</view>
					<view class="time">
						到期时间：{{ item.expireTime | formatTimestamp }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMyCoupon
	} from '../../network/api.js'
	import {
		formatTimestamp
	} from '../../utils/index.js'
	export default {
		data() {
			return {
				active: 1,
				couponList: []
			}
		},
		filters: {
			formatTimestamp
		},
		onLoad() {
			this.token = uni.getStorageSync("token");
			this.getCoupon(1);
		},
		methods: {
			onCoupon(item) {
				uni.navigateTo({
					url: './couponDetail?item=' + JSON.stringify(item)
				})
			},

			swActive(index) {
				this.active = index;
				this.couponList = [];
				if (index == 2) {
					this.getCouponPast();
				} else if (index == 1) {
					this.getCoupon();
				} else {
					this.getUsedCoupon();
				}
			},
			//获取我的优惠券过期的
			async getCouponPast() {
				uni.showLoading({
					title: '请稍等',
					mask: true
				})
				var res = await getMyCoupon({
					page: 1,
					size: 100,
					status: 1, 
					maxExpireTime: new Date().getTime()
				})
				if (res.code == 10002) {
					this.couponList = res.data
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			},
			//获取我正常的优惠券
			async getCoupon() {
				uni.showLoading({
					title: '请稍等',
					mask: true
				})
				var res = await getMyCoupon({
					page: 1,
					size: 100,
					status: 1,
					minExpireTime: new Date().getTime()
				})
				if (res.code == 10002) {
					this.couponList = res.data;
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			},
			//获取我已经使用的优惠券
			async getUsedCoupon() {
				uni.showLoading({
					title: '请稍等',
					mask: true
				})
				var res = await getMyCoupon({
					page: 1,
					size: 100,
					status: 0
				})
				if (res.code == 10002) {
					this.couponList = res.data;
				} else {
					uni.showToast({
						title: res.message,
						icon: "none"
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
	}




	.head {
		position: fixed;
		top: 0upx;
		width: 750rpx;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 16rpx 22rpx 0rpx rgba(10, 36, 99, 0.05);
		border-radius: 0rpx 0rpx 32rpx 32rpx;

		.title {
			background: url(https://html5page.oss-cn-shanghai.aliyuncs.com/myCoupon.png);

			background-repeat: no-repeat;
			background-size: 100% 100%;
			height: 300upx;
			width: 94vw;
			padding: 3vw;
			padding-top: 8vw;

			.back {

				image {
					width: 48upx;
					height: 48upx;
				}
			}
		}

		.tab {
			display: flex;
			flex-direction: row;
			// justify-content: space-around;
			width: 750rpx;
			color: rgba(10, 36, 99, 0.5);
			font-size: 32upx;
			font-weight: 600;
			height: 120rpx;

			>view {
				color: rgba(222, 177, 155, 0.5);
				height: 120rpx;
				line-height: 120rpx;
				border-bottom: 5upx solid #FFFFFF;
			}

			>.active {
				color: #DEB19B;
				border-bottom: 8upx solid #DEB19B;
			}
		}

	}

	.couponBox {
		width: 650rpx;
		height: 256rpx;
		margin: 40rpx 0 0 40rpx;

		.couponUnused {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}

		.price {
			width: 216rpx;
			height: 216rpx;
			font-size: 56rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 216rpx;
			z-index: 1;
			align-self: flex-start;
			text-align: center;
		}

		.info {
			width: 454rpx;
			height: 216rpx;
			z-index: 1;
			align-self: flex-start;

			.title {
				width: 336rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #323233;
				line-height: 44rpx;
				margin: 46rpx 0 0 24rpx;
			}

			.subtitle {
				width: 336rpx;
				height: 40rpx;
				font-size: 20rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(50, 50, 51, 0.3);
				line-height: 40rpx;
				margin-left: 24rpx;
			}

			.time {
				width: 350rpx;
				height: 40rpx;
				font-size: 20rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(50, 50, 51, 0.3);
				line-height: 40rpx;
				margin-left: 24rpx;
			}
		}
	}
</style>