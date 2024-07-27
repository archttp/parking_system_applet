<template>
	<view>
		<image class="topBg poa" src="../../static/images/BG2@2x.png"></image>
		<view class="poa contentBox flex-col" v-if="shopList.length==0">
			<view class="name">{{notDataTip}}</view>
		</view>
		<view class="poa contentBox flex-col" v-if="shopList.length>0">
			<picker @change="bindPickerChange" :range="shopListName">
				<view class="flex">
					<view class="name">{{info.title}}</view>
					<image src="../../static/images/下拉-copy.png"
						style="width: 36rpx;height: 36rpx;margin-top: 58rpx;margin-left: 10rpx;" mode=""></image>
				</view>
			</picker>

			<!-- <view class="flex">
				<view class="name">{{info.title}}</view>
				<image src="../../static/images/下拉-copy.png"
					style="width: 36rpx;height: 36rpx;margin-top: 58rpx;margin-left: 10rpx;" mode=""></image>
			</view> -->

			<view class="contentInfo flex-col flex-col-center">
				<!-- <u-tabs :list="list1" @change="click" :current='current'></u-tabs> -->
				<view style="width: 686rpx;height: 88rpx;background-color:#EEEEEF ;"
					class="flex flex-col-center flex-row-center">
					<view style="width: 228rpx;height: 88rpx;text-align: center;line-height: 88rpx;"
						@click="changeCurrent(index)"
						:style="current == index ? 'background:#FFFFFF;font-weight: 900;' : 'opacity: .7;'"
						v-for="(item,index) in list1" :key="item.name">{{item.name}}</view>
				</view>
				<view class="myVolume">我的停车券</view>
				<view class="num" v-if="info && current == 0">{{(info.remainingQuantity + info.autoGiveAwayOverageQuota) || 0}}元</view>
				<view class="num" v-if="info && current == 1">{{((info.remainingTime / 3600000) || 0).toFixed(2)}}小时
				</view>
				<view class="num" v-if="info && current == 2">{{(info.remainingTimes) || 0}}次</view>
				<view class="line"></view>
				<view class="flex option por">
					<view class="line1 poa"></view>
					<!-- <view class="line2 poa"></view> -->
					<navigator :url="'./buyParkingTicket?shopInfo=' + JSON.stringify(info)" hover-class="none">
						<view>购买停车券</view>
					</navigator>
					<!-- 	<navigator url="setParkingTicket/index" hover-class="none">
						<view @click="onSetParkingTicket">设置停车券</view>
					</navigator> -->
					<navigator :url="'./giveAway?id=' + info.id" hover-class="none">
						<view @click="onSetParkingTicket">赠送停车券</view>
					</navigator>
				</view>
			</view>
			<view class="giveAwayNumBox flex">
				<view class="num1">查看送券记录<!-- ：{{!todayIssued ? '0' : todayIssued}} --></view>
				<view class="intoDetail" @click="intoSendCouponsList">点击查看</view>
			</view>
			<view class="flex">
				<view class="shopAssistantTilte">我的店员</view>
				<view class="intoDetail" style="margin-top: 36rpx;margin-left: 216rpx;" @click="intoAddShopAssistant">
					添加店员</view>
			</view>
			<view v-if="shopAssistantList.length == 0" class="noShopAssistant flex-col flex-row-center flex-col-center">
				<image src="../../static/images/noshopAssistant.png"></image>
				<view class="prompt">您还未添加店员哦</view>
				<view class="addShopAssistant" @click="intoAddShopAssistant">添加店员</view>
			</view>
			<view v-else class="flex-col">
				<view class="flex shopAssistantItem flex-col-center" v-for="(item,index) of shopAssistantList"
					:key="item" @click="onShopAssistantList(item)">
					<image :src="item.staffAvatarURL" class="avatar" v-if="item.staffAvatarURL"></image>
					<image src="../../static/images/user.png" class="avatar" v-else></image>
					<view class="name_item">{{item.note ? item.note : item.staffName}}</view>
					<!-- <view class="todayGiveaway">今日送券:{{item.sameDayCouponCount}}</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCouponActivityListByQuery,
		getCouponActivityStaffListByQuery,
		deleteCouponActivityStaff,
		getCouponActivityToDaySum
	} from '../../network/api.js'
	export default {
		data() {
			return {
				shopAssistantList: [],
				info: '',
				notDataTip: '',
				todayIssued: 0,
				current: 0,
				list1: [{
					name: '金额券',
				}, {
					name: '时长券',
				}, {
					name: '次数券'
				}],
				shopList: [],
				shopListName: []
			}
		},
		onLoad() {

		},
		onShow() {
			// this.getMyEmployee()
			this.getShopList()
		},
		methods: {
			async getCouponActivityToDaySumFn() {
				var res = await getCouponActivityToDaySum({
					page: 1,
					size: 200,
					couponActivityId: this.info.id
				})
				if (res.code === 10002) {
					this.todayIssued = res.data
				} else {
					this.todayIssued = 0
				}
			},
			bindPickerChange(e) {
				this.info = this.shopList[e.detail.value]
			},
			changeCurrent(index) {
				this.current = index
			},
			click(item) {
				console.log('item', item);
				this.current = item
			},
			onSetParkingTicket() {
				uni.setStorageSync('parkingTicketActivityId', this.info.id)
			},
			onShopAssistantList(item) {
				uni.showActionSheet({
					itemList: ['编辑','删除'],
					success: async ({
						tapIndex
					}) => {
						if(tapIndex == 0){
							uni.setStorageSync('parkingTicketActivityId', this.info.id)
							uni.setStorageSync('staffLimit', JSON.stringify(item))
							uni.navigateTo({
								url: 'editStaff'
							})
						}else if (tapIndex == 1) {
							const {
								data,
								code,
								message
							} = await deleteCouponActivityStaff(item.id)
							if (code == 10002) {
								this.getCouponActivityStaffList()
							} else {
								uni.showToast({
									title: message,
									icon: 'none'
								})
							}
						}
					}
				})
			},
			async getShopList() {
				var res = await getCouponActivityListByQuery({
					page: 1,
					size: 200
				})
				if (res.code == 10002) {
					this.shopList = res.data
					this.shopListName = res.data.map(i => i.title)
					this.info = res.data[0]
					// this.getDetail(res.data[0].id)
					this.getCouponActivityStaffList()
					this.getCouponActivityToDaySumFn()
				}else{
					this.notDataTip = '没有可用的发券账户，请联系管理人员开通！';
				}
			},
			async getCouponActivityStaffList() {
				var res = await getCouponActivityStaffListByQuery({
					page: 1,
					size: 200,
					couponActivityId: this.info.id
				})
				if (res.code == 10002) {
					this.shopAssistantList = res.data
				} else {
					this.shopAssistantList = []
				}
			},
			async getDetail(id) {
				var res = await this.$u.api.activityDetail({
					activityId: id,
				})
				console.log(333, res)
				if (res.code == 10002) {
					if (res.data.todayIssued != null) {
						this.todayIssued = res.data.todayIssued
					}
					// this.info = res.data
				}
			},
			intoAddShopAssistant() {
				uni.navigateTo({
					url: '/pages/coupon/addStaff?couponActivityId=' + this.info.id
				})
			},
			async getMyEmployee() {
				var res = await this.$u.api.getMyStaffList({
					page: 1,
					size: 9999
				})
				console.log(res);
				if (res.code == 10002) {
					this.shopAssistantList = res.data
				} else {
					this.shopAssistantList = []
				}
			},
			intoSendCouponsList() {
				uni.navigateTo({
					url: '/pages/coupon/sendCouponsList?couponActivityId=' + this.info.id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.topBg {
		width: 750rpx;
		height: 346rpx;
		// background: #488cf5;
		left: 0;
		top: 0;
	}

	.contentBox {
		left: 0;
		top: 0;
		z-index: 1;

		.name {
			height: 56rpx;
			font-size: 40rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 56rpx;
			margin: 48rpx 0 0 36rpx;
		}

		.contentInfo {
			width: 686rpx;
			// height: 332rpx;
			background: #FFFFFF;
			border-radius: 18rpx;
			margin: 48rpx 0 0 32rpx;
			overflow: hidden;

			.myVolume {
				width: 140rpx;
				height: 40rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #86540B;
				line-height: 40rpx;
				margin-top: 30rpx;
			}

			.num {
				height: 76rpx;
				font-size: 76rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #2C2C2C;
				line-height: 76rpx;
				margin-top: 8rpx;
				text-align: center;
			}

			.line {
				width: 686rpx;
				height: 2rpx;
				background: #EAEAEA;
				margin-top: 54rpx;
			}

			.option {
				width: inherit;
				display: flex;
				justify-content: space-around;

				view {
					width: 228rpx;
					height: 88rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #323233;
					line-height: 88rpx;
					text-align: center;
				}

				.line1 {
					left: 342rpx;
					width: 2rpx;
					height: 38rpx;
					background: #D8D8D8;
					border-radius: 2rpx;
					border: 2rpx solid #EAEAEA;
					top: 26rpx;
				}

				// .line2 {
				// 	@extend .line1;
				// 	left: 342rpx; 
				// }
			}
		}
	}

	.giveAwayNumBox {
		width: 686rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 22rpx 0 0 32rpx;

		.num1 {
			width: 302rpx;
			height: 36rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 36rpx;
			margin: 32rpx 0 0 32rpx;
		}
	}

	.shopAssistantTilte {
		width: 338rpx;
		height: 36rpx;
		font-size: 34rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #323233;
		line-height: 36rpx;
		margin: 48rpx 0 0 36rpx;
	}

	.noShopAssistant {
		width: 682rpx;
		height: 380rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 10rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
		border-radius: 16rpx;
		margin: 32rpx 0 0 36rpx;

		image {
			width: 220rpx;
			height: 108rpx;
		}

		.prompt {
			width: 192rpx;
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.7);
			line-height: 34rpx;
			margin-top: 16rpx;
		}

		.addShopAssistant {
			width: 184rpx;
			height: 64rpx;
			border-radius: 40rpx;
			border: 2rpx solid #488cf5;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #488cf5;
			line-height: 64rpx;
			text-align: center;
			margin-top: 48rpx;
		}
	}

	.shopAssistantItem {
		margin-left: 32rpx;
		margin-top: 34rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.name_item {
			// max-width: 102rpx;
			height: 48rpx;
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 48rpx;
			margin-left: 16rpx;
		}

		.todayGiveaway {
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #C24E29;
			line-height: 40rpx;
			margin-left: 348rpx;
		}
	}

	.intoDetail {
		width: 140rpx;
		height: 56rpx;
		border-radius: 40rpx;
		border: 2rpx solid #488cf5;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #488cf5;
		line-height: 56rpx;
		text-align: center;
		margin-left: 182rpx;
		margin-top: 22rpx;
	}
</style>