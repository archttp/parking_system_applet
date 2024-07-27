<template>
	<view>
		<view class="bgBox flex por">
			<view class="flex-col" style="margin-top: 150rpx;">
				<view class="textone">你好！</view>
				<view class="texttwo">请提供以下信息以继续您的操作</view>
			</view>
			<image class="poa" src="../../static/images/renwu@2x.png" mode=""
				style="width: 334rpx;height: 280rpx;top:52rpx;right:32rpx"></image>
		</view>
		<view class="contentBox bb">
			<view class="parkInutBox flex flex-col-center">
				<view class="title">停车场</view>
				<input type="text" v-model="parkName" style="width: 360rpx;height: 130rpx;text-align: right;"
					placeholder="输入停车场名称" @input="carParkNameSearch" >
				<icon type="search" size="26" style="margin-left: 24rpx;" />
			</view>
			<view v-for="item,index in carParkList" :key="item.id" @click="changeIndex(index)"
				class="flex flex-row-between flex-col-center" style="width: 100%;height: 66rpx;margin-top: 32rpx;">
				<view>{{item.name}}</view>
				<view class="round" v-if="index !== indexValue"></view>
				<view class="round_ac flex flex-row-center flex-col-center" v-if="index === indexValue">
					<view style="width: 16rpx;height: 16rpx;background: #6794F6;border-radius: 50%;"></view>
				</view>
			</view>
			<view class="parkInutBox flex flex-col-center" style="margin-top: 32rpx;">
				<view class="title" >车牌号</view>
				<input @focus="plateShow = true" :value="plateNo" type="text"
					style="width: 440rpx;height: 130rpx;text-align: right;" placeholder="点击选择">
			</view>
		</view>
		<view class="nextButton" @click="next">下一步</view>
		<plate-input v-if="plateShow" :plate="plateNo" @close="plateShow=false" @export="setPlate"></plate-input>
	</view>
</template>

<script>
	import {
		cfCarParkGet,
		applyStoredCard
	} from '../../network/api.js'
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				carParkList: [],
				parkName: '',
				indexValue: null,
				plateShow: false,
				plateNo: ''
			}
		},
		methods: {
			async next() {
				if (this.indexValue === null) {
					uni.showToast({
						title: '请选择停车场'
					})
					return
				}
				if (!this.plateNo) {
					uni.showToast({
						title: '请选择车牌'
					})
					return
				}
				const {
					data,
					code,
					message
				} = await applyStoredCard({
					carParkId: this.carParkList[this.indexValue].id,
					plateNumber: this.plateNo
				})
				console.log(data, code);
				if (code === 10002) {
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1, // 返回层数，2则上上页
							success() {
								uni.$emit('getList',data)
							}
						})
					}, 1500)
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			setPlate(e) {
				this.plateNo = e;
				this.plateShow = false;
			},
			changeIndex(e) {
				this.indexValue = e
			},
			carParkNameSearch() {
				this.indexValue = null
				if (!this.parkName) {
					uni.showToast({
						title: '您还没有输入',
						icon: 'none'
					})
					return
				}
				cfCarParkGet({
					name: this.parkName,
					page: 1,
					size: 200
				}).then(res => {
					console.log(res);
					if (res.code === 10002) {
						this.carParkList = res.data
					} else {
						this.carParkList = []
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}
				})
			}
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
		top: -166rpx;
		left: 32rpx;
		padding: 34rpx 32rpx;
	}

	.parkInutBox {
		width: 622rpx;
		height: 130rpx;
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