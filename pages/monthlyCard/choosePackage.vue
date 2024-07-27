<template>
	<view>
		<view class="topBox por">
			<view class="cardInfoBox poa flex flex-col-center">
				<image src="../../static/images/VIP@2x (1).png" mode="" class="image1"></image>
				<view class="flex-col" style="margin-left: 32rpx;">
					<view class="parkName">停车卡</view>
					<view class="address single-line-2">{{parkName}}</view>
				</view>
				<image src="../../static/images/liji@2x.png" mode="" class="image2"></image>
			</view>
		</view>
		<view class="packageBox bb">
			<view class="packageItem flex flex-row-between flex-col-center por"
				:class="listIndex == index ? 'packageItem_ac' : ''" v-for="item,index in list" :key="item.id"
				@click="changeListIndex(index)">
				<image src="../../static/images/xianshi@2x.png" mode="" class="poa"
					style="width: 104rpx;height: 38rpx;left: -8rpx;top:-8rpx"></image>
				<view class="left">{{item.title}}</view>
				<view class="flex-col right">
					<view class="flex currentPrice">
						<view class="Symbols">￥</view>
						<view class="price">{{item.currentPrice}}</view>
					</view>
					<view class="originalPrice">¥ {{item.originalPrice}}</view>
				</view>
			</view>
		</view>
		<view class="packageBox bb">
			<view class="flex flex-col-center">
				<view class="line"></view>
				<view style="margin-left: 10rpx;">支付方式</view>
			</view>
			<view class="flex payTypeBox flex-col-center">
				<!-- #ifdef MP-WEIXIN -->
				<image src="../../static/images/wxPay@2x.png" mode="" class="weixinIcon"></image>
				<view class="weixinText">微信支付</view>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<image src="../../static/images/aliPayIcon.png" mode="" class="weixinIcon"></image>
				<view class="weixinText">支付宝支付</view>
				<!-- #endif -->
				<image src="../../static/images/bianzu8@2x.png" mode="" class="rightIcon"></image>
			</view>
		</view>
		<view class="nextBox" @click="showPopup">下一步</view>
		<uni-popup ref="popup">
			<view class="popupBox bb">
				<view style="font-size: 36rpx;font-weight: 600;color: #323233;margin-top: 64rpx;">选择车牌</view>
				<view style="font-size: 24rpx;font-weight: 400;color: rgba(50,50,51,0.5);margin-top: 16rpx;">购买月卡需先选择车牌哦
				</view>
				<view v-if="licensePlateList.length > 0">
					<view class="licensePlateBox">
						<scroll-view scroll-y="true" style="width: 100%;height: 100%;">
							<view class="licensePlateItem flex flex-col-center"
								:class="licensePlateIndex == index ? 'licensePlateItem_ac' : ''"
								v-for="item,index in licensePlateList" :key="item.id"
								@click="changeLicensePlateIndex(index)">
								<view class="licensePlate">{{item.numberPlate}}</view>
								<view class="realStatusText">{{getStatusText(item.status)}}</view>
							</view>
						</scroll-view>
					</view>
					<view class="flex flex-row-between">
						<view class="popupButton" style="width: 292rpx;margin-top: 32rpx;" @click="next">下一步</view>
						<view class="popupButton" @click="intoAddLicensePlate"
							style="width: 292rpx;margin-top: 32rpx;background: rgba(103,148,246,.18);color: #6794F6;">
							新增车牌</view>
					</view>
				</view>
				<view v-else>
					<image style="width: 220rpx;height: 108rpx;margin: 82rpx 0 0 200rpx;"
						src="../../static/images/quesheng@2x.png" mode=""></image>
					<view style="font-size: 30rpx;font-weight: 400;color: #CDCDCD;margin: 16rpx 0 0 128rpx;">...(-
						-)..您还未绑定车牌哦~</view>
					<view class="popupButton" @click="intoAddLicensePlate">添加车牌</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCarParkPackageProductListByQuery,
		cfCarParkCarGet
	} from '../../network/api.js'
	export default {
		data() {
			return {
				parkId: '',
				parkName: '',
				licensePlateList: [],
				list: [],
				listIndex: 0,
				licensePlateIndex: 0
			}
		},
		onShow() {
			this.getMyCarList()
		},
		onLoad(e) {
			console.log(e);
			this.parkId = e.parkId
			this.parkName = e.parkName
			this.fenchData()
			// this.$refs.popup.open('bottom')
		},
		methods: {
			changeListIndex(index) {
				this.listIndex = index
			},
			getStatusText(e) {
				if (e == 0) {
					return '未提交认证'
				} else if (e == 1) {
					return '审核中'
				} else if (e == 2) {
					return '正常'
				} else if (e == 3) {
					return '审核不通过'
				}
			},
			changeLicensePlateIndex(index) {
				this.licensePlateIndex = index
			},
			async getMyCarList() {
				const {
					data,
					code,
					message
				} = await cfCarParkCarGet({
					page: 1,
					size: 100
				})
				console.log(data, code);
				if (code == 10002) {
					this.licensePlateList = data
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
					code,
					message
				} = await getCarParkPackageProductListByQuery({
					carParkId: this.parkId,
					page: 1,
					size: 100
				})
				console.log(data, code);
				if (code == 10002) {
					this.list = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			next() {
				uni.navigateTo({
					url: '/pages/monthlyCard/pay?id=' + this.list[this.listIndex].id + '&licensePlate=' + this
						.licensePlateList[this.licensePlateIndex].numberPlate
				})
			},
			showPopup() {
				this.$refs.popup.open('bottom')
			},
			intoAddLicensePlate() {
				uni.navigateTo({
					url: '/pages/addLicensePlate/addLicensePlate'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
	}

	.licensePlateBox {
		width: 614rpx;
		height: 328rpx;
		margin: 32rpx 0 0 0;
	}

	.licensePlateItem {
		width: 610rpx;
		height: 136rpx;
		margin-bottom: 32rpx;
		background: #F8F9FB;
		border-radius: 12rpx;
		border: 2rpx solid rgba(151, 151, 151, 0.08);

		.licensePlate {
			height: 60rpx;
			font-size: 44rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 60rpx;
			margin-left: 32rpx;
		}

		.realStatusText {
			padding: 0 12rpx;
			height: 40rpx;
			background: #FFE3E5;
			border-radius: 21rpx;
			font-size: 16rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FF8686;
			line-height: 40rpx;
			text-align: center;
			margin-left: 16rpx;
		}
	}

	.licensePlateItem_ac {
		@extend .licensePlateItem;
		border: 2rpx solid #6794F6;
		background: rgba(103, 148, 246, 0.13);
	}

	.popupBox {
		width: 686rpx;
		height: 684rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-left: 32rpx;
		overflow: hidden;
		margin-bottom: 76rpx;
		padding: 0 34rpx;

		.popupButton {
			width: 622rpx;
			height: 100rpx;
			background: #6794F6;
			border-radius: 10rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: rgba(255, 255, 255, 0.87);
			line-height: 100rpx;
			text-align: center;
			margin-top: 134rpx;
		}
	}

	.nextBox {
		width: 686rpx;
		height: 100rpx;
		background: #6794F6;
		border-radius: 10rpx;
		position: absolute;
		left: 32rpx;
		bottom: 116rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.87);
		line-height: 100rpx;
		text-align: center;
	}

	.payTypeBox {
		margin-top: 36rpx;

		.weixinIcon {
			width: 48rpx;
			height: 48rpx;
		}

		.weixinText {
			width: 200rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #323233;
			line-height: 40rpx;
			margin-left: 16rpx;
		}

		.rightIcon {
			width: 36rpx;
			height: 36rpx;
			margin-left: 320rpx;
		}
	}

	.line {
		width: 6rpx;
		height: 32rpx;
		background: #6996F6;
	}

	.packageBox {
		width: 686rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 32rpx;
		margin: 34rpx 0 0 32rpx;

		.packageItem {
			width: 622rpx;
			height: 226rpx;
			background: #FEF7EB;
			border-radius: 12rpx;
			margin-bottom: 16rpx;

			.left {
				width: 300rpx;
				height: 40rpx;
				font-size: 32rpx;
				font-weight: 600;
				color: #5D3300;
				line-height: 40rpx;
				margin-left: 32rpx;
			}

			.right {
				margin-right: 32rpx;

				.currentPrice {
					.Symbols {
						height: 64rpx;
						font-size: 24rpx;
						font-weight: 600;
						color: #EFB25A;
						line-height: 64rpx;
						align-self: baseline;
					}

					.price {
						@extend .Symbols;
						align-self: none;
						font-size: 56rpx;
					}
				}

				.originalPrice {
					font-size: 36rpx;
					font-weight: 600;
					color: #5D3300;
					text-decoration: line-through;
					text-align: right;
				}
			}
		}

		.packageItem_ac {
			border: 2rpx solid #E4B873;
			@extend .packageItem;
		}
	}

	.topBox {
		width: 750rpx;
		height: 266rpx;
		background: #1C2029;
	}

	.parkName {
		height: 44rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: #FFFFFF;
	}

	.address {
		width: 322rpx;
		height: 64rpx;
		font-size: 22rpx;

		font-weight: 400;
		line-height: 32rpx;
		color: #FFFFFF;
		opacity: .6;
		margin-top: 4rpx;
	}

	.cardInfoBox {
		width: 686rpx;
		height: 154rpx;
		background-image: url('../../static/images/care@2x.png');
		background-size: 100% 100%;
		bottom: 0;
		left: 32rpx;

		.image1 {
			width: 88rpx;
			height: 88rpx;
			margin-left: 36rpx;
		}

		.image2 {
			width: 148rpx;
			height: 56rpx;
			margin-left: 18rpx;
		}
	}
</style>