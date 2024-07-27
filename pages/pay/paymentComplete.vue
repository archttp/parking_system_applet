<template>
	<view>
		<view class="Box flex-col flex-col-center">
			<view class="flex" style="margin-top: 114rpx;">
				<image src="../../static/images/payIcon@2x.png" mode="" style="width: 48rpx;height: 50rpx;"></image>
				<view class="payText">支付成功</view>
			</view>
			<view class="priceBox">¥{{price || '0'}}</view>
			<view class="line"></view>
			<view class="flex" style="margin-top: 32rpx;">
				<view class="title1">订单信息</view>
				<view class="content1 bb single-line">{{parkName}}</view>
			</view>
			<view class="flex">
				<view class="title1">支付信息</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="content1 bb">微信支付</view>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<view class="content1 bb">支付宝支付</view>
				<!-- #endif -->
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="adBox">
				<ad :unit-id="orderCompletedWxMpAdId"></ad>
			</view>
			<!-- #endif -->
			<!-- <view class="InvoiceButton" @click="onInvoice">开具发票</view> -->
			<view class="DoneButton" @click="onDone">完成</view>
		</view>
	</view>
</template>

<script>

	import {
		orderCompletedWxMpAdId
	} from '../../common/config.js'

	export default {
		data() {
			return {
				price: '',
				parkName: ''
			}
		},
		onLoad(e) {
			this.price = e.price
			this.parkName = e.parkName
		},
		methods: {
			onInvoice() {
				// uni.navigateTo({
				// 	url: '/packageMy/my/issuingInvoices?orderId='+this.orderDetail.id
				// })
			},
			onDone() {
				uni.switchTab({
					url: '/packageMy/my/my'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
	}

	.adBox {
		width: 622rpx;
		margin-top: 50rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.Box {
		width: 686rpx;
		height: 1448rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 124rpx 0 0 32rpx;
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

	.DoneButton {
		width: 622rpx;
		height: 100rpx;
		background: #6794F6;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.87);
		line-height: 100rpx;
		text-align: center;
		margin-top: 28rpx;
	}

	.payText {
		height: 44rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #5FC865;
		line-height: 44rpx;
		margin-left: 8rpx;
	}

	.priceBox {
		height: 112rpx;
		font-size: 80rpx;
		font-weight: 600;
		color: #323233;
		line-height: 112rpx;
		margin-top: 40rpx;
	}

	.line {
		width: 622rpx;
		height: 2rpx;
		opacity: 0.07;
		border: 2rpx solid #323233;
		margin-top: 52rpx;
	}

	.title1 {
		width: 128rpx;
		height: 80rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #323233;
		line-height: 80rpx;
	}

	.content1 {
		width: 486rpx;
		height: 80rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.6);
		line-height: 80rpx;
		text-align: right;
		padding-left: 60rpx;
	}
</style>