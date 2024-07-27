<template>
	<view>
		<view class="searchBox">
			<view class="inputBox flex flex-col-center">
				<image mode="" src="../../static/images/searchIcon.png"></image>
				<input v-model="name" placeholder="搜索附近的停车场" type="text" @confirm="onSearch">
			</view>
		</view>
		<headerTitle title="推荐车场" />
		<view v-for="item in parkList" :key="item.id" class="parkBox flex flex-row-between">
			<view class="flex-col left">
				<view class="single-line">{{ item.name }}</view>
				<view class="single-line">{{ item.address }}</view>
			</view>
			<image v-if="item.sellingPackage" class="right" src="../../static/images/kaika2.png"
				@click="intoChoosePackage(item.id,item.name)">
			</image>
			<image v-else class="right" src="../../static/images/kaika1.png"></image>
		</view>
	</view>
</template>

<script>
	import headerTitle from '../../components/headerTitle.vue'
	import {
		cfCarParkGet
	} from '../../network/api.js'
	import {
		operatorsId
	} from '../../common/config.js'

	export default {
		components: {
			headerTitle
		},
		data() {
			return {
				positionX: '',
				positionY: '',
				name: '',
				parkList: []
			}
		},
		onLoad() {
			this.getLocation();
		},
		methods: {
			onSearch(e) {
				const value = e.detail.value
				this.name = value
				this.getCfParkLotList()
			},
			getLocation() {
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						this.positionX = res.longitude;
						this.positionY = res.latitude;
						this.getCfParkLotList()
					},
				});
			},
			async getCfParkLotList() {
				const {
					data,
					code
				} = await cfCarParkGet({
					page: 1,
					size: 200,
					name: this.name,
					adminer: operatorsId
				})
				if (code == 10002) {
					this.parkList = data
				}
			},
			intoChoosePackage(id, name) {
				uni.navigateTo({
					url: '/pages/monthlyCard/choosePackage?parkId=' + id + '&parkName=' + name
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.parkBox {
		width: 686rpx;
		height: 76rpx;
		margin-left: 32rpx;
		margin-top: 40rpx;

		.left {
			:nth-child(1) {
				width: 516rpx;
				height: 40rpx;
				font-size: 28rpx;

				font-weight: 400;
				color: #323233;
				line-height: 40rpx;
			}

			:nth-child(2) {
				width: 516rpx;
				height: 32rpx;
				font-size: 22rpx;

				font-weight: 400;
				color: rgba(50, 50, 51, 0.5);
				line-height: 32rpx;
			}
		}

		.right {
			width: 138rpx;
			height: 64rpx;
		}
	}

	.searchBox {
		width: 750rpx;
		height: 128rpx;
		background-color: #F5F7FF;
		overflow: hidden;

		.inputBox {
			width: 686rpx;
			height: 80rpx;
			background: #FFFFFF;
			border-radius: 40rpx;
			border: 1rpx solid #DADEEA;
			margin: 24rpx 0 0 32rpx;

			image {
				width: 48rpx;
				height: 48rpx;
				margin-left: 34rpx;
			}

			input {
				height: 100%;
				margin-left: 16rpx;
			}
		}
	}
</style>