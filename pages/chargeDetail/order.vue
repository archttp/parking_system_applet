<template>
	<view>
		<view v-if="list.length == 0" class="flex-col">
			<image src="../../static/images/list_not2x(1).png"
				style="width: 220rpx;height: 108rpx;margin: 206rpx 0 0 266rpx;"></image>
			<view class="notBill">您还没有记录哦</view>
		</view>
		<view v-else>
			<view class="Box bb" v-for="item in list" :key="item.id" @click.stop="intoCharging(item)">
				<view class="nameBox flex flex-row-between flex-col-center">
					<view class="name single-line">{{item.chargingStationName}}</view>
					<!-- <view class="time">{{item.startTime | formatTimestamp}}</view> -->
				</view>
				<view class="line"></view>
				<view class="time2">开始时间：{{item.startTime | formatTimestamp}}</view>
				<view class="time2" style="margin-top: 12rpx;">充电时间：{{getTimeDifference(item)}}</view>
				<view class="price">消费金额：{{item.chargingFee + item.serviceFee}}元</view>
				<view class="line" style="margin-top: 24rpx;"></view>
				<view class="flex">
					<view class="endButton" @click.stop="stopCharge(item.id)" v-if="item.chargingStatus === 2">结束充电
					</view>
					<view class="statusButton_blue" style="margin-left:470rpx;" v-if="item.chargingStatus === 1">启动中
					</view>
					<view class="statusButton_blue" v-if="item.chargingStatus === 2">充电中</view>
					<view class="statusButton_gray" style="margin-left:470rpx;" v-if="item.chargingStatus === 4">启动失败
					</view>
					<view class="statusButton_gray" style="margin-left:470rpx;" v-if="item.chargingStatus === 5">系统故障
					</view>
					<view class="statusButton_gray" v-if="item.chargingStatus === 3"
						:style="item.chargingStatus === 3 ? 'margin-left:470rpx;' : ''">已完成</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getChargingUseLogListByQuery,
		stopChargingApi
	} from '../../network/api.js'
	import {
		formatTimestamp,
		timeDifference
	} from '../../utils/index.js'
	export default {
		data() {
			return {
				list: []
			}
		},
		filters: {
			formatTimestamp
		},
		onShow() {
			this.fenchData()
		},
		onPullDownRefresh() {
			this.fenchData()
		},
		methods: {
			getTimeDifference(item) {
				if (!item.endTime) return '-'
				else return timeDifference(item.startTime, item.endTime)
			},
			intoCharging(item) {
				if (item.chargingStatus === 2) {
					uni.navigateTo({
						url: '/pages/chargeDetail/charging?chargeid=' + item.id
					})
				}
			},
			async stopCharge(id) {
				uni.showModal({
					title: '提示',
					content: '确定停止充电吗？',
					success: async ({
						confirm
					}) => {
						if (confirm) {
							const {
								data,
								code,
								message
							} = await stopChargingApi({
								chargingUseLogId: id,
							})
							if (code === 10002) {
								uni.showToast({
									title: '操作成功',
									icon: 'success'
								})
								this.fenchData()
							} else {
								uni.showToast({
									title: message,
									icon: 'icon'
								})
							}
						}
					}
				})

			},
			async fenchData() {
				const {
					data,
					code
				} = await getChargingUseLogListByQuery({
					page: 1,
					size: 200
				})
				console.log(data, code);
				uni.stopPullDownRefresh();
				if (code === 10002) {
					this.list = data
				} else {
					this.list = []
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
		padding-bottom: 30rpx;
	}

	.statusButton_blue {
		width: 134rpx;
		height: 60rpx;
		background: #488CF5;
		border-radius: 200rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 60rpx;
		text-align: center;
		margin: 24rpx 0 0 20rpx;
	}

	.statusButton_gray {
		@extend .statusButton_blue;
		background: #AEB6C2;
	}

	.endButton {
		width: 160rpx;
		height: 60rpx;
		border-radius: 200rpx;
		border: 2rpx solid #F58748;
		font-size: 28rpx;
		font-weight: 400;
		color: #F58748;
		line-height: 60rpx;
		text-align: center;
		margin: 24rpx 0 0 298rpx;
	}

	.time2 {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.6);
		line-height: 40rpx;
		margin-top: 24rpx;
	}

	.price {
		@extend .time2;
		margin-top: 12rpx;
	}

	.Box {
		width: 670rpx;
		height: 412rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		border: 2rpx solid #EFF0F2;
		margin: 32rpx 0 0 40rpx;
		padding: 0 32rpx 22rpx 32rpx;

		.nameBox {
			width: 100%;
			height: 112rpx;

			.name {
				width: 432rpx;
				height: 64rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #323233;
				line-height: 64rpx;
			}

			.time {
				width: 158rpx;
				height: 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(50, 50, 51, 0.6);
				line-height: 40rpx;
			}
		}
	}

	.line {
		width: 606rpx;
		height: 1rpx;
		background: #EAEAEA;
		opacity: .5;
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