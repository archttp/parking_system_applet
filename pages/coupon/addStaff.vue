<template>
	<view>
		<input @input="inputChange" class="input" placeholder="请输入员工手机号" placeholder-class="placeholder"></input>
		<view class="Prompt">注：需手机号注册过小程序</view>
		<view :class="buttomStatus?'pay_active':'pay'" @click="next">下一步</view>
	</view>
</template>

<script>
	import {
		addCouponActivityStaff
	} from '../../network/api.js'
	export default {
		data() {
			return {
				value: '',
				couponActivityId: ''
			}
		},
		onLoad(e) {
			this.couponActivityId = e.couponActivityId
		},
		computed: {
			buttomStatus: function() {
				if (this.value) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			async next() {
				if (!this.value) {
					return
				}
				var res = await addCouponActivityStaff({
					phone: this.value,
					couponActivityId: this.couponActivityId
				})
				if (res.code == 10002) {
					uni.showToast({
						title: '添加成功',
						icon: 'success'
					})
				} else {
					uni.showToast({
						title: res.message,
						icon: 'none'
					})
				}
			},
			inputChange(e) {
				console.log(e);
				var {
					value
				} = e.detail
				this.value = value
			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.pay {
		width: 686rpx;
		height: 100rpx;
		background: #488cf5;
		border-radius: 16rpx;
		opacity: 0.4;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 100rpx;
		text-align: center;
		margin: 126rpx 0 0 32rpx;
	}

	.pay_active {
		@extend .pay;
		background: #488cf5;
		opacity: 1;
	}

	.placeholder {
		height: 44rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.3);
		line-height: 44rpx;
	}

	.input {
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;
		margin-top: 24rpx;
		padding-left: 24rpx;
		box-sizing: border-box;
	}

	.Prompt {
		width: 480rpx;
		height: 34rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.3);
		line-height: 34rpx;
		margin: 16rpx 0 0 24rpx;
	}
</style>