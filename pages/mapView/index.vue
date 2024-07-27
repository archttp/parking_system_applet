<template>
	<view>
		<map id="map" :markers="parkMarkers" @markertap='markertap' show-location :longitude="locationInfo.longitude"
			:latitude="locationInfo.latitude" :scale="scale" @regionchange="regionchange"></map>
		<view class="listcurrently flex-col bb" @click="intoParkingLotDetail">
			<view class="name single-line">{{ isInternal ? currently.name : currently.title}}</view>
			<view class="address flex">
				<view class="single-line">{{currently.address}}</view>
			</view>
			<view v-if="isInternal">
				<view class="spaces flex">
					<image src="../../static/images/time@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
					<view style="margin-left: 8rpx">免停时长：{{(currently.freeTime / 60000).toFixed(0)}}分钟</view>
					<image src="../../static/images/chewei@2x.png" mode=""
						style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
					<view style="margin-left: 8rpx">车位{{currently.parkingSpaceNumber}} |
						可用{{currently.parkingSpaceNumber - currently.usedParkingSpaceNumber}}</view>
				</view>
				<view class="price flex flex-col-center flex-row-between">
					<view style="color: #f86161">
						<text style="font-size: 24rpx">￥</text>
						<text style="font-size: 48rpx">{{(currently.currentPrice).toFixed(2)}}</text>
						<text style="font-size: 24rpx; margin-left: 4rpx">/h</text>
					</view>
					<view class="flex distance">
						<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx">
						</image>
						<view style="text-align: right;">{{(currently.distance / 1000).toFixed(2)}}km</view>
					</view>
				</view>
			</view>
			<view v-if="!isInternal">
				<view class="spaces flex">
					<image src="../../static/images/time@2x.png" mode="" style="width: 32rpx; height: 32rpx" />
					<view style="margin-left: 8rpx">免停时长：暂无信息</view>
					<image src="../../static/images/chewei@2x.png" mode=""
						style="width: 32rpx; height: 32rpx; margin-left: 10rpx" />
					<view style="margin-left: 8rpx">车位：暂无信息</view>
				</view>
				<view class="price flex flex-col-center flex-row-between" style="margin-top: 12rpx;">
					<view style="color: #f86161">
						<text style="font-size: 24rpx">￥</text>
						<text style="font-size: 24rpx">暂无信息</text>
						<text style="font-size: 24rpx; margin-left: 4rpx">/h</text>
					</view>
					<view class="flex distance">
						<image src="../../static/images/daohang@2x.png" mode="" style="width: 32rpx; height: 32rpx">
						</image>
						<view style="text-align: right;">{{((currently._distance || 0) / 1000).toFixed(2)}}km</view>
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
		cfCarParkGet
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
				longitude: "",
				latitude: "",
				insideParking: [],
				externalParking: [],
				parkMarkers: [],
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
				scale: 14
			};
		},
		onLoad() {
			this.getLocation();
		},
		methods: {
			regionchange(e) {
				console.log(e);
				if (e.type == 'end') {
					// #ifdef MP-WEIXIN
					var latitude = e.detail.centerLocation.latitude
					var longitude = e.detail.centerLocation.longitude
					// #endif
					// #ifdef MP-ALIPAY
					var latitude = e.latitude
					var longitude = e.longitude
					// #endif
					this.longitude = longitude;
					this.latitude = latitude;
					this.getCfParkLotList()
				}
				this.currently = {}
			},
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
					this.currently = this.insideParking[index]
				} else {
					this.currently = this.externalParking[index]
					// this.chooseExternalParking = []
					// this.chooseExternalParking.push(this.externalParking[index])
				}
			},
			intoParkingLotDetail(item) {
				if (this.isInternal) {
					uni.navigateTo({
						url: '/pages/parkingLotDetail/parkingLotDetail?id=' + this.currently.id
					});
				} else {
					uni.openLocation({
						latitude: this.currently.location.lat,
						longitude: this.currently.location.lng,
						name: this.currently.title,
						address: this.currently.address
					});
				}
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
						this.getCfParkLotList()
					},
				});
			},
			async getCfParkLotList() {
				const {
					data,
					code
				} = await cfCarParkGet({
					positionX: this.longitude ? this.longitude : this.locationInfo.longitude,
					positionY: this.latitude ? this.latitude : this.locationInfo.latitude,
					distance: 1000,
					page: 1,
					size: 100
				})
				console.log(data, code);
				if (code == 10002) {
					this.isInternal = true
					this.insideParking = data
					this.currently = data[0]
					this.refreshMarkers(data, 'cf', 'park')
					// this.getOtherParkLot()
				} else {
					this.getOtherParkLot()
				}
			},
			getOtherParkLot() {
				qqmapsdk.search({
					keyword: '停车场',
					location: `${this.latitude ? this.latitude : this.locationInfo.latitude},${this.longitude ? this.longitude : this.locationInfo.longitude}`,
					success: (res) => {
						if (res.status === 0) {
							this.isInternal = false
							this.externalParking = res.data
							this.currently = res.data[0]
							this.refreshMarkers(res.data, 'tx', 'park')
						}
					},
					fail: function(err) {
						console.log(err);
					}
				})
			},
			refreshMarkers(datas, dataType, deviveType) {
				const markers = [];
				if (dataType === 'cf') {
					datas.forEach((v, idx) => {
						markers.push({
							'id': idx,
							'latitude': v.positionY,
							'longitude': v.positionX,
							'title': v.name,
							'iconPath': 'http://file.cfeng.wang/parking_icon.png',
							'width': '32',
							'height': '32',
							callout: {
								content: v.name,
								color: '#FFFFFF',
								fontSize: 12,
								bgColor: '#301819',
								padding: 10,
								borderRadius: 20,
							}
						})
					})
					if (deviveType === 'park') {
						this.parkMarkers = markers
					} else {
						this.chargingMarkers = markers
					}
				} else if (dataType === 'tx') {
					datas.forEach((v, idx) => {
						markers.push({
							'id': idx,
							'latitude': v.location.lat,
							'longitude': v.location.lng,
							'title': v.title,
							'iconPath': 'http://file.cfeng.wang/parking_icon.png',
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
					if (deviveType == 'park') {
						this.parkMarkers = markers
					} else {
						this.chargingMarkers = markers
					}
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