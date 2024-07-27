<template>
	<view>
		<view class="title">{{goodsType[orderDetail.goodsType]}}</view>
		<view class="amount">{{amount}}</view>
		<view class="statusText">{{statusText}}</view>
		<div class="infoBox flex-col">
			<view class="flex">
				<view class="left">商品名称</view>
				<view class="right u-line-1">{{orderDetail.goodsName}}</view>
			</view>
			<view class="flex">
				<view class="left">订单号</view>
				<view class="right">{{orderDetail.id}}</view>
			</view>
			<view class="flex">
				<view class="left">订单时间</view>
				<view class="right">{{orderDetail.createTime | formatTimestamp}}</view>
			</view>
			<view class="flex">
				<view class="left">支付方式</view>
				<view class="right">{{paymentAgencyShortNameTitle}}</view>
			</view>
			<view class="InvoiceButton" @click="onInvoice" v-if="orderDetail.status==1 && orderDetail.invoiceLogId==0">开具发票</view>
		</div>

		<!-- #ifdef MP-WEIXIN -->
		<ad :unit-id="orderDetailWxMpAdId"></ad>
		<!-- #endif -->

	</view>
</template>

<script>
	import {
		formatTimestamp
	} from '../../utils/index.js'
	import {
		orderDetailWxMpAdId
	} from '../../common/config.js'
	export default {
		data() {
			return {
				orderDetail: '',
				PaymentAgencyList: [],
				statusTextArr: [
					'待支付',
					'已支付',
					'已发货',
					'已取消',
					'退款中',
					'已退款',
					'退货中',
					'已退货',
					'交易成功',
					'售后中',
					'售后已结束'
				],
				goodsType: ['', '停车', '充值', '洗车', '转账', '停车套餐', '车位预订', '优惠券活动充值', '汽车充电', '提现', '退款', '收款', '电动车充电',
					'用户角色'
				],
				paymentAgencyShortNameTitle: ''
			}
		},
		computed: {
			// 订单状态(0-待支付/1-已支付/2-已发货/3-已取消/4-一退款中/5-已退款/6-退货中/7-已退货/8-交易成功/9-售后中/10-售后已结束)
			amount() {
				var orderDetail = this.orderDetail
				return orderDetail.status == 0 ? orderDetail.amountsPayable : orderDetail.amountActuallyPaid
			},
			statusText() {
				return this.statusTextArr[this.orderDetail.status]
			},
		},
		onLoad(e) {
			this.orderDetail = uni.getStorageSync('orderDetail')
			switch(this.orderDetail.paymentAgencyShortName){
				case 'cash_pay_cny':
					this.paymentAgencyShortNameTitle = '现金支付';
					break
				case 'wei_xin_mp_pay_cny':
					this.paymentAgencyShortNameTitle = '微信小程序支付';
					break
				case 'wei_xin_app_pay_cny':
					this.paymentAgencyShortNameTitle = '微信APP支付';
					break
				case 'ali_mp_pay_cny':
					this.paymentAgencyShortNameTitle = '支付宝小程序支付';
					break
				case 'ali_app_pay_cny':
					this.paymentAgencyShortNameTitle = '支付宝APP支付';
					break
				case 'stored_card_pay_cny':
					this.paymentAgencyShortNameTitle = '储值卡支付';
					break
				case '异常支付':
					this.paymentAgencyShortNameTitle = 'abnormal_payment';
					break
				case '系统账户支付':
					this.paymentAgencyShortNameTitle = 'system_fund_account';
					break
				case '优惠券全额抵扣':
					this.paymentAgencyShortNameTitle = 'coupon';
					break
			}
		},
		filters: {
			formatTimestamp
		},
		methods: {
			onInvoice() {
				uni.navigateTo({
					url: '/pages/my/issuingInvoices?orderId='+this.orderDetail.id
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F7F7F7;
	}

	.title {
		width: 750rpx;
		text-align: center;
		height: 50rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #323233;
		line-height: 50rpx;
		margin-top: 32rpx;
	}

	.amount {
		width: 750rpx;
		text-align: center;
		height: 64rpx;
		font-size: 64rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #323233;
		line-height: 64rpx;
		margin-top: 8rpx;
	}

	.statusText {
		width: 750rpx;
		text-align: center;
		height: 50rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.5);
		line-height: 50rpx;
		margin-top: 10rpx;
	}

	.infoBox {
		width: 686rpx;
		min-height: 290rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		margin: 32rpx;
		height: 440rpx;

		.flex {
			margin-top: 48rpx;

			.left {
				width: 112rpx;
				height: 32rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
				margin-left: 20rpx;
			}

			.right {
				margin-left: 50rpx;
				text-align: right;
				width: 484rpx;
				height: 32rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
			}
		}

		.moreInfo {
			width: 100%;
			height: 96rpx;
			border-top: 2rpx solid #EAEAEA;
			;
			margin-top: 32rpx;

			.left {
				width: 112rpx;
				height: 32rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #323233;
				line-height: 32rpx;
			}

			.rightImg {
				width: 32rpx;
				height: 32rpx;
				margin-left: 496rpx;
			}
		}
	}
	.InvoiceButton {
		width: 622rpx;
		height: 100rpx;
		border-radius: 10rpx;
		border: 2rpx solid #6794F6;
		font-size: 36rpx;
		font-weight: 600;
		color: #6794F6;
		line-height: 100rpx;
		text-align: center;
		margin-top: 200rpx;
	}
</style>