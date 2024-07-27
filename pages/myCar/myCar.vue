<template>
	<view>
		<view class="addCarBox flex flex-col-center flex-row-center" @click="intoAddCar">
			<image src="../../static/images/my/Add@2x.png"></image>
			<view class="text">添加车辆</view>
		</view>
		<view v-if="list.length == 0" class="flex-col flex-col-center flex-row-center">
			<image src="../../../static/image/home/nocar.png" class="list_not"></image>
			<view class="no_title1">您还未绑定车牌哦</view>
		</view>
		<view v-else>
			<view class="flex-col">
				<view class="carBox flex-col por" v-for="(item,index) in list" :key="index">
					<view class="numberPlate">{{item.numberPlate}}</view>
					<!-- <view class="coupon">优惠券(3)</view> -->
					<!-- <view class="coupon" style="color: rgb(222, 177, 155);" @click="intoCarCoupon(item.numberPlate)">
						点击查看优惠券
					</view> -->
					<image src="../../static/images/my/delete@2x.png" @click="deleteCar(item)"></image>
				</view>
			</view>
			<!-- <view class="u-flex-c">
				<view v-for="(item,index) in list" :key="index" class="carBox u-flex-c">
					<view class="num u-rela"> 
						<image class="u-abso" @click="deleteCar(item)" src="../../../static/image/home/delete_white2x.png" style="width: 48rpx;height: 48rpx;top: 28rpx;right: 20rpx;" ></image>
					{{item.numberPlate}}</view>
					<view class="setMeal u-flex-r u-col-center">
						<view class="quickCardOpening" @click="intoCarCoupon(item.numberPlate)">查看优惠券</view>
					</view>
				</view>
			</view> -->
		</view>

	</view>
</template>

<script>
	import {
		cfCarParkCarGet,
		cfCarParkCarDelete
	} from '../../network/api.js'
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {

		},
		onShow() {
			this.getMyCarsByCondition()
		},
		methods: {
			// 点击查看车牌的优惠券
			intoCarCoupon(numberPlate) {
				uni.navigateTo({
					url: 'carCoupon?numberPlate=' + numberPlate
				});
			},
			deleteCar(item) {
				uni.showModal({
					title: '提示',
					content: '删除车牌后无法享受便捷停车服务，是否确认删除车牌？',
					cancelText: '确认删除',
					confirmText: '暂不删除',
					success: async showModalres => {
						if (showModalres.cancel) {
							var res = await cfCarParkCarDelete(item.id)
							if (res.code == 10002) {
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								})
								this.getMyCarsByCondition()
							} else {
								uni.showToast({
									title: res.message,
									icon: 'none'
								})
							}
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			async getMyCarsByCondition() {
				var res = await cfCarParkCarGet({
					page: 1,
					size: 100
				})
				console.log(res)
				if (res.code == 10002) {
					this.list = res.data
				} else {
					this.list = []
				}
			},
			intoAddCar() {
				uni.navigateTo({
					url: '/pages/addLicensePlate/addLicensePlate'
				})
			}
		}

	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
		padding-bottom: 200rpx;
	}

	.carBox {
		width: 670rpx;
		height: 190rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		border: 2rpx solid rgba(151, 151, 151, 0.08);
		margin-bottom: 40rpx;
		margin-left: 40rpx;

		.numberPlate {
			height: 190rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 190rpx;
			margin: 0 0 0 40rpx;
		}

		.coupon {
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #DEB19B;
			line-height: 44rpx;
			margin: 6rpx 0 0 40rpx;
		}

		image {
			width: 32rpx;
			height: 32rpx;
			position: absolute;
			top: 80rpx;
			right: 40rpx;
		}
	}

	.list_not {
		width: 220rpx;
		height: 108rpx;
		margin-top: 280rpx;
	}

	.no_title1 {
		width: 192rpx;
		height: 34rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.7);
		line-height: 34rpx;
		margin-top: 24rpx;
	}

	.no_title2 {
		width: 220rpx;
		height: 28rpx;
		font-size: 20rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.5);
		line-height: 28rpx;
		margin-top: 4rpx;
	}

	.addCarBox {
		width: 670rpx;
		height: 136rpx;
		background: rgba(72, 140, 245, 0.08);
		border-radius: 12rpx;
		border: 3rpx dashed #488CF5;
		margin: 46rpx 0 0 40rpx;
		margin-bottom: 32rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}

		.text {
			width: 144rpx;
			height: 50rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #488CF5;
			line-height: 50rpx;
		}
	}
</style>