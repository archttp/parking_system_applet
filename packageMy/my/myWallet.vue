<template>
	<view>
		<div class="line"></div>
		<div class="box">
			<div class="title">钱包明细</div>
			<div class="content u-flex" style='flex-wrap: wrap;'>
				<div class="left u-flex-col" v-for="(item,index) in list" :key='item.id'>
					<div class="balance">{{item.scoreType == 'cny' ? '人民币' : item.scoreType}}</div>
					<div class="amount">{{item.balance}}</div>
					<div class="u-flex">
						<button class="recharge" @click='onRecharge' type='primary'>充值</button>
						<!-- <button class="withdraw" @click='onRecharge' type='warn' disabled>提现</button> -->
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		cfAccountGet
	} from '../../network/api.js'
	export default {
		data() {
			return {
				amount: '10.00',
				list: [],
				typeList: [],
				htmls: ''
			}
		},
		onShow() {
			this.cfAccountGetFn()
		},
		methods: {
			async cfAccountGetFn() {
				const {
					data,
					code,
					message
				} = await cfAccountGet()
				if (code == 10002) {
					this.list = data
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			onRecharge() {
				uni.navigateTo({
					url: '/packageMy/my/recharge'
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #F8F9FB;
		width: 750rpx;
	}

	.line {
		background: #EAEAEA;
		width: 750rpx;
		height: 2rpx;
	}

	.box {
		width: 670rpx;
		// height: 292rpx;
		background: #FFFFFF;
		border-radius: 8rpx;
		margin: 30rpx 0 0 40rpx;

		.title {
			width: 100%;
			height: 110rpx;
			border-bottom: 2rpx solid #eaeaea;
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 110rpx;
			padding-left: 20rpx;
		}

		.content {
			.left {
				width: 334rpx;
				height: 210rpx;
				border: 1rpx solid #eaeaea;

				.balance {
					height: 36rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(50, 50, 51, 0.5);
					line-height: 36rpx;
					margin: 24rpx 0 0 20rpx;
				}

				.amount {
					height: 50rpx;
					font-size: 36rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #323233;
					line-height: 50rpx;
					margin: 12rpx 0 0 20rpx;
				}

				.u-flex {
					margin-top: 10rpx;

					.recharge {
						height: 60rpx;
						width: 120rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						background-color: #5393F5;
						line-height: 60rpx;
						margin: 0 0 0 20rpx !important;
					}

					.withdraw {
						margin-left: 20rpx;
						height: 60rpx;
						width: 120rpx;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						// color: rgba(245, 113, 72, 0.1);
						line-height: 60rpx;
						margin: 0 0 0 20rpx !important;
					}
				}
			}


			.right {
				width: 334rpx;
				height: 180rpx;
				border-right: 2rpx solid #eaeaea;

				.balance {
					height: 36rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(50, 50, 51, 0.5);
					line-height: 36rpx;
					margin: 24rpx 0 0 20rpx;
				}

				.amount {
					height: 50rpx;
					font-size: 36rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #323233;
					line-height: 50rpx;
					margin: 12rpx 0 0 20rpx;
				}
			}
		}
	}
</style>