<template>
	<view>
		<view v-if="list.length == 0" class="flex-col">
			<image src="../../static/images/list_not2x(1).png"
				style="width: 220rpx;height: 108rpx;margin: 206rpx 0 0 266rpx;"></image>
			<view class="notBill">没有相关记录</view>
		</view>
		<view v-else>
			<view class="stopCarList" @click="checkOrder(item)" v-for="(item, index) in list" :key="item.id">
				<view class="listTitle flex">
					<view class="listName">
						{{item.carParkName}}
					</view>
					<view class="listStatus" v-if="item.payTime == '0'">
						停车中
					</view>
					<view class="listStatus_old" v-else>
						已完成
					</view>
				</view>
				<view class="licensePlateNumber">
					车牌号：{{item.numberPlate}}
				</view>
				<view class="admissionTime flex flex-col-center">
					<view class="admissionTimeIcon"></view>
					<view class="time">
						入场时间：{{getTimeText(item.inTime)}}
					</view>
				</view>
				<view class="appearanceTime flex flex-col-center">
					<view class="appearanceTimeIcon"></view>
					<view class="time">
						出场时间：{{getTimeText(item.outTime)}}
					</view>
				</view>
			</view>
		</view>
		<bindPhonePopup ref="bindPhonePopupRef" @closePhoneShow='closePhoneShow' />
	</view>
</template>

<script>
	import bindPhonePopup from '../../components/bindPhonePopup/index.vue'
	import {
		cfCarParkUseLogGet
	} from '../../network/api.js'
	import {
		formatTimestamp
	} from '../../utils/index.js'

	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad(e) {
			this.licensePlateNumber = e.licensePlateNumber
			this.fenchData()
		},
		components: {
			bindPhonePopup
		},
		methods: {
			getTimeText(time, type) {
				return formatTimestamp(time)
			},
			async fenchData() {
				const {
					data,
					code
				} = await cfCarParkUseLogGet({
					numberPlate: this.licensePlateNumber,
					page: 1,
					size: 200
				})
				console.log(data, code);
				if (code === 10002) {
					this.list = data
				} else {
					this.list = []
				}
			},
			checkOrder(item) {
				const user = uni.getStorageSync('user')
				if (!user.phone) {
					this.$refs.bindPhonePopupRef.showPopup()
					return
				}
				uni.navigateTo({
					url: '/pages/pay/pay?carParkUseLogId=' + item.id
				})
			},
		}
	}
</script>

<style lang="scss">
	.stopCarList {
		width: 686rpx;
		height: 248rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 24rpx 0 0 32rpx;

		.listTitle {
			.listName {
				width: 484rpx;
				height: 40rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 40rpx;
				margin: 32rpx 0 0 32rpx;
			}

			.listStatus {
				width: 128rpx;
				height: 56rpx;
				border-radius: 28rpx;
				border: 2rpx solid #EF3864;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #EF3864;
				line-height: 56rpx;
				text-align: center;
				margin: 24rpx 0 0 12rpx;
			}

			.listStatus_old {
				@extend .listStatus;
				border: 2rpx solid #B0B9D0;
				color: #B0B9D0;
			}
		}

		.licensePlateNumber {
			width: 484rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 40rpx;
			margin: 8rpx 0 0 32rpx;
		}

		.admissionTime {
			margin-top: 16rpx;

			.admissionTimeIcon {
				width: 16rpx;
				height: 16rpx;
				background: #0A2463;
				border-radius: 50%;
				margin-left: 32rpx;
			}
		}

		.appearanceTime {
			margin-top: 16rpx;

			.appearanceTimeIcon {
				width: 16rpx;
				height: 16rpx;
				background: #F0AC35;
				border-radius: 50%;
				margin-left: 32rpx;
			}
		}

		.time {
			width: 590rpx;
			height: 32rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.5);
			line-height: 32rpx;
			margin-left: 16rpx;
		}
	}

	.notBill {
		width: 216rpx;
		height: 34rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.7);
		line-height: 34rpx;
		margin-top: 24rpx;
		margin-left: 268rpx;
		text-align: center;
	}
</style>