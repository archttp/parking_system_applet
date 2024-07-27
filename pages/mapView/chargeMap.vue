<template>
	<view>
		<map id="map" :markers="chargingMarkers" @markertap='markertap' show-location
			:longitude="locationInfo.longitude" :latitude="locationInfo.latitude" :scale="scale"></map>
		<view class="listcurrently flex-col bb" @click="intoParkingLotDetail">
			<view class="name single-line">{{currently.stationName || currently.title}}</view>
			<view class="address flex">
				<view class="single-line">{{currently.address}}</view>
			</view>
			<view class="spaces flex flex-row-between" v-if="currently.stationName">
				<view>停车费: {{currently.stationName == null ? '暂无数据' : '免停' + currently.freeParkTime / 60000 + '分钟'}}
				</view>、
				<view class="flex">
					<image src="../../static/images/man@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
					<view style="margin-left: 8rpx">
						{{currently.stationName == null ? '暂无数据' : currently.usedSlowChargeNumber + '/' + currently.slowChargeNumber}}
					</view>
					<image src="../../static/images/kuai@2x.png" mode=""
						style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
					<view style="margin-left: 8rpx">
						{{currently.stationName == null ? '暂无数据' : currently.usedFastChargeNumber + '/' + currently.fastChargeNumber}}
					</view>
				</view>
			</view>
			<view class="price flex flex-col-center flex-row-between">
				<view style="color: #f86161">
					<text style="font-size: 24rpx">￥</text>
					<text
						:style="currently.stationName == null ? 'font-size: 24rpx' : 'font-size: 48rpx'">{{currently.stationName == null ? '暂无数据' : currently.serviceFee}}</text>
				</view>
				<view class="flex distance">
					<image src="../../static/images/导航@2x.png" mode="" style="width: 32rpx; height: 32rpx"></image>
					<view style="text-align: right;">
						{{currently.distance / 1000}}km
					</view>
				</view>
			</view>
		</view>

		<view class="myLocal flex flex-col-center flex-row-center" @click="controltap">
			<image src="../../static/images/dingwei@2x.png" mode=""></image>
		</view>
	</view>
</template>


<script>
	import {
		cfChargingStationGet
	} from '../../network/api.js'
	import {
		qqmapKey
	} from '../../common/config.js'

	var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
	var qqmapsdk = new QQMapWX({
		key: qqmapKey
	});

	export default {
		data() {
			return {
				locationInfo: {
					longitude: "",
					latitude: "",
				},
				insideChargingStation: [],
				externalChargingStation: [],
				chargingMarkers: [],
				currently: {
					name: '',
					address: '',
					freeTime: 0,
					parkingSpaceNumber: 0,
					usedParkingSpaceNumber: 0,
					currentPrice: 0,
					distance: 0
				},
				isInternal: false,
				scale: 14,
				stationType: ''
			};
		},
		onLoad(e) {
			this.stationType = e.stationType
			this.getLocation();
		},
		methods: {
			// 回到当前位置
			controltap(e) {
				let mpCtx = wx.createMapContext('map')
				mpCtx.moveToLocation()
			},
			markertap(e) {
				console.log(e)
				var index = e.detail.markerId
				// 如果时内部停车场
				if (this.isInternal) {
					this.currently = this.insideChargingStation[index]
				} else {
					// this.chooseExternalParking = []
					// this.chooseExternalParking.push(this.externalParking[index])
				}
			},
			intoParkingLotDetail(currently) {
				uni.navigateTo({
					url: '/pages/chargeDetail/index?id=' + this.currently.id
				});
			},
			distance(e) {
				if (e < 1000) {
					return e + 'm '
				} else {
					return e / 1000 + 'km '
				}
			},
			getLocation() {
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						console.log("当前位置的经度：" + res.longitude);
						console.log("当前位置的纬度：" + res.latitude);
						this.locationInfo.longitude = res.longitude;
						this.locationInfo.latitude = res.latitude;
						this.getCfChargeList()
					},
				});
			},
			async getCfChargeList() {
				const {
					data,
					code
				} = await cfChargingStationGet({
					positionX: this.locationInfo.longitude,
					positionY: this.locationInfo.latitude,
					distance: 1000,
					page: 1,
					size: 100,
					stationType: this.stationType
				})
				console.log(data, code);
				if (code == 10002) {
					this.isInternal = true
					this.currently = data[0]
					this.insideChargingStation = data
					this.refreshMarkers(data, 'cf')
				} else {
					this.getOtherChargingStation()
				}
			},
			getOtherChargingStation() {
				qqmapsdk.search({
					keyword: '充电站',
					location: `${this.locationInfo.latitude},${this.locationInfo.longitude}`,
					success: (res) => {
						if (res.status === 0) {
							this.externalChargingStation = res.data
							this.refreshMarkers(res.data, 'tx')
						}
					},
					fail: function(err) {
						console.log(err);
					}
				})
			},
			// datas: 循环的数据 dataType: 数据来源 deviveType:充电还是停车
			refreshMarkers(datas, dataType) {
				const markers = [];
				if (dataType === 'cf') {
					datas.forEach((v, idx) => {
						markers.push({
							'id': idx,
							'latitude': v.positionY,
							'longitude': v.positionX,
							'title': v.stationName,
							'iconPath': 'http://file.cfeng.wang/charge.png',
							'width': '32',
							'height': '32',
							callout: {
								content: v.stationName,
								color: '#FFFFFF',
								fontSize: 12,
								bgColor: '#301819',
								padding: 10,
								borderRadius: 20,
							}
						})
					})
					this.chargingMarkers = markers
				} else if (dataType === 'tx') {
					datas.forEach((v, idx) => {
						markers.push({
							'id': idx,
							'latitude': v.location.lat,
							'longitude': v.location.lng,
							'title': v.title,
							'iconPath': 'http://file.cfeng.wang/charge.png',
							'width': '32',
							'height': '32',
							callout: {
								content: v.title,
								color: '#FFFFFF',
								fontSize: 12,
								bgColor: '#301819',
								padding: 10,
								borderRadius: 20,
							}
						})
					})
					this.chargingMarkers = markers
				}
			},
		},
	};
</script>
<style lang="scss">
	map {
		width: 100vw;
		height: 100vh;
	}

	.myLocal {
		width: 100rpx;
		height: 100rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.08), 0rpx 0rpx 2rpx 0rpx rgba(0, 0, 0, 0.08);
		border-radius: 16rpx;
		position: fixed;
		top: 548rpx;
		right: 32rpx;

		image {
			width: 48rpx;
			height: 48rpx;
		}
	}

	.listcurrently {
		width: 686rpx;
		background: #ffffff;
		border-radius: 10rpx;
		padding: 32rpx;
		position: fixed;
		bottom: 100rpx;
		left: 30rpx;

		.name {
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #323233;
			line-height: 50rpx;
		}

		.address {
			margin-top: 8rpx;

			view:nth-child(1) {
				width: 514rpx;
				height: 32rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #434343;
				line-height: 34rpx;
			}
		}

		.spaces {
			height: 32rpx;
			font-size: 24rpx;

			font-weight: 400;
			color: #323233;
			line-height: 32rpx;
			margin-top: 16rpx;
		}
	}
</style>