<template>
	<view>
		<!-- <view class="bgBox flex por">
			<view class="flex-col" style="margin-top: 150rpx;">
				<view class="textone">你好！</view>
				<view class="texttwo">请提供以下信息以继续您的操作</view>
			</view>
			<image class="poa" src="../../static/images/renwu@2x.png" mode=""
				style="width: 334rpx;height: 280rpx;top:52rpx;right:32rpx"></image>
		</view> -->
		<view class="contentBox bb">
			<view class="parkInutBox flex flex-col-center">
				<view class="title">抬头</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerName" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入公司单位名称" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">税号</view>
				<input type="text" v-model="taxNo" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入税号" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">地址</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerAddress" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入单位地址" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">电话</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerPhone" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入电话号码" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">银行</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerBank" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入开户银行" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">账户</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerAccount" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入银行账户" >
			</view>
			<view class="parkInutBox flex flex-col-center">
				<view class="title">邮箱</view>
				<input type="text" v-model="outputInvoiceIssuePreInvoice.buyerEmail" style="width: 360rpx;height: 108rpx;text-align: left;"
					placeholder="请输入邮箱" >
			</view>
			<view class="uni-list" style="margin-top: 44px;">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in invoiceTypeList" :key="item.value" style="float: left;margin-left: 50px;">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="nextButton" @click="next">提交开票</view>
	</view>
</template>

<script>
	import {
		issuingInvoices
	} from '../../network/api.js'
	export default {
		data() {
			return {
				orderId: '',
				taxNo: '',
				formatPushType: true,
				formatGenerate: true,
				outputInvoiceIssuePreInvoice: {
					priceTaxMark: 1,
					invoiceTypeCode: '6',
					invoiceType: 0,
					buyerName: '',
					buyerTaxNo: '',
					buyerAddress: '',
					buyerPhone: '',
					buyerEmail: '',
					buyerAccount: '',
					buyerBank: '',
					invoiceDetailsList: [
						{
							goodsCode: '3040801010000000000'
						}
					]
					
				},
				invoiceTypeList: [{
                    value: '6',
                    name: '普票',
					checked: 'true'
                },
				{
                    value: '5',
                    name: '专票',
                }]
			}
		},
		onLoad(e) {
			this.orderId = e.orderId
		},
		methods: {
			async next() {
				const {
					data,
					code,
					message,
					mixMessage
				} = await issuingInvoices(this._data)
				if (code === 10002) {
					uni.showToast({
						title: '开票成功',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: message+"-"+mixMessage,
						icon: 'none'
					})
				}
			},
			radioChange: function(evt) {
				this.outputInvoiceIssuePreInvoice.invoiceTypeCode = evt.detail.value
			},
		}
	}
</script>

<style lang="scss">
	.round {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #D0D1D5;
		border-radius: 50%;
	}

	.round_ac {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #6794F6;
		border-radius: 50%;
	}

	.contentBox {
		width: 686rpx;
		// height: 372rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		position: relative;
		top: 10rpx;
		left: 32rpx;
		padding: 34rpx 32rpx;
	}

	.parkInutBox {
		width: 622rpx;
		height: 108rpx;
		background: #F5F7FB;
		border-radius: 10rpx;

		.title {
			width: 120rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-weight: 600;
			color: #323233;
			line-height: 44rpx;
			margin-left: 32rpx;
		}
	}

	.nextButton {
		width: 686rpx;
		height: 100rpx;
		background: #6794F6;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.87);
		line-height: 100rpx;
		text-align: center;
		position: fixed;
		left: 32rpx;
		bottom: 92rpx;
	}

	.bgBox {
		width: 750rpx;
		height: 588rpx;
		background: linear-gradient(360deg, #F5F7FF 0%, rgba(240, 244, 255, 0) 27%, #91B1F9 66%, #6794F6 100%);
	}

	.textone {
		height: 66rpx;
		font-size: 48rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 66rpx;
		margin-left: 32rpx;
	}

	.texttwo {
		height: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.87);
		line-height: 40rpx;
		margin-left: 32rpx;
		margin-top: 4rpx;
	}
</style>