<template>
	<page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
	<view>
		<view :style="navIndex === 2 ? 'height:650rpx' : navIndex === 1 ? 'height:876rpx' : ''" class="mapBox por">
			<view :style="navIndex === 2 ? 'height:400rpx' : ''" class="bg poa"></view>
			<view class="mainBox poa">
				<weather />
				<view class="flex navBox bb">
					<view :class="navIndex === 0 ? 'ac' : 'notAc'" @click="changeNavIndex(0)">停车</view>
					<view :class="navIndex === 1 ? 'ac' : 'notAc'" @click="changeNavIndex(1)">充电</view>
					<!-- #ifdef MP-WEIXIN -->
					<!-- <view :class="navIndex === 2 ? 'ac' : 'notAc'" @click="changeNavIndex(2)">小区服务</view> -->
					<!-- #endif -->
				</view>
				<view v-if="navIndex === 0">
					<view class="mapBox">
						<!-- #ifdef MP-WEIXIN -->
						<map :latitude="locationInfo.latitude" :longitude="locationInfo.longitude"
							:markers="parkMarkers" :scale="13" class="map por" name="" show-location>
							<cover-view class="mapZoomInBox poa flex flex-col-center flex-row-center"
								@click="onZoomInMap">
								<cover-image src="../../static/images/arrawsalt@2x.png"
									style="width: 48rpx; height: 48rpx"></cover-image>
							</cover-view>
						</map>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="map por" @click="onZoomInMap">
							<image class="poa" style="width: 100%;height: 356rpx;" src="../../static/images/Content.png"
								mode="aspectFill" />
							<view class="mapZoomInBox poa flex flex-col-center flex-row-center">
								<image src="../../static/images/arrawsalt@2x.png" style="width: 48rpx; height: 48rpx">
								</image>
							</view>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="monthlyCardButton flex flex-row-center flex-col-center"
							@click="intoOpenMonthlyCard">
							<image mode="aspectFit" src="../../static/images/VIP@2x.png"
								style="width: 50rpx; height: 48rpx">
							</image>
							<view class="text">开通月卡</view>
						</view>
						<!-- #endif -->
					</view>
				</view>
				<view v-if="navIndex == 1">
					<view class="mapBox" style="height: 454rpx;">
						<view class="flex" style="background-color: #f5f5f5;">
							<view @click="changeChargeIndex(0)" :class="{'bgWhite' : chargeIndex === 0}"
								style="width: 358rpx;height: 88rpx;line-height: 88rpx;text-align: center;">电动汽车</view>
							<view @click="changeChargeIndex(1)" :class="{'bgWhite' : chargeIndex === 1}"
								style="width: 358rpx;height: 88rpx;line-height: 88rpx;text-align: center;">
								电动自行车
							</view>
						</view>

						<!-- #ifdef MP-WEIXIN -->
						<map :latitude="locationInfo.latitude" :longitude="locationInfo.longitude"
							:markers="chargingMarkers" :scale="13" class="map por" name="" show-location
							style="margin-top: 0;">
							<cover-view class="mapZoomInBox poa flex flex-col-center flex-row-center"
								@click="onZoomInMap">
								<cover-image src="../../static/images/arrawsalt@2x.png"
									style="width: 48rpx; height: 48rpx"></cover-image>
							</cover-view>
						</map>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="map por" @click="onZoomInMap">
							<image class="poa" style="width: 100%;height: 356rpx;" src="../../static/images/Content.png"
								mode="aspectFill" />
							<view class="mapZoomInBox poa flex flex-col-center flex-row-center">
								<image src="../../static/images/arrawsalt@2x.png" style="width: 48rpx; height: 48rpx">
								</image>
							</view>
						</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
		<view v-if="navIndex == 0">
			<external :list="externalParking" />
			<inside :list="insideParking" />
		</view>
		<view v-if="navIndex == 1 && chargeIndex == 0">
			<charge :list="insideChargingStation" />
			<charge :list="externalChargingStation" />
		</view>
		<view v-if="navIndex == 1 && chargeIndex == 1">
			<charge :list="cfChargeBikeList" />
		</view>
		<view v-if="navIndex == 2" class="flex-col flex-col-center">
			<image mode="aspectFit" src="../../static/images/shoujiapp.png" style="width: 450rpx;height: 347rpx;">
			</image>
			<view style="font-size: 24rpx;opacity: .7;margin-top: 32rpx;">请前往各大应用市场下载 才风智慧app 体验</view>
		</view>


		<uni-popup ref="popup" @change="change">
			<view class="popupBox bb">
				<view style="font-size: 36rpx;font-weight: 600;color: #323233;margin-top: 64rpx;">订单进行中…</view>
				<view style="font-size: 24rpx;font-weight: 400;color: rgba(50,50,51,0.5);margin-top: 16rpx;">
					您有订单正在进行中，请查看
				</view>
				<view>
					<view class="licensePlateBox">
						<scroll-view scroll-y="true" style="width: 100%;height: 100%;">
							<view class="licensePlateItem flex flex-col-center flex-row-between">
								<view class="flex-col">
									<view class="flex flex-col-center">
										<view class="licensePlate">京A3654P</view>
										<view class="realStatusText">未实名</view>
									</view>
									<view
										style="font-size: 24rpx;font-weight: 400;color: #323233;margin: 4rpx 0 0 34rpx;">
										入场时间 05.27
										13:59:11
									</view>
								</view>
								<image mode="aspectFit" src="../../static/images/kaika.png"
									style="width: 140rpx;height: 64rpx;margin-right: 28rpx;" @click="intoPay"></image>
							</view>
						</scroll-view>
					</view>
					<view class="flex flex-row-between">
						<view class="popupButton" @click="intoAddLicensePlate">
							添加车牌
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- #ifdef MP-WEIXIN -->
		<wxmpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<!-- <alimpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" /> -->
		<!-- #endif -->
		<bindPhonePopup ref="bindPhonePopupRef" @closePhoneShow='closePhoneShow' />
	</view>
</template>

<script>
	let interstitialAd = null;
	import {
		cfCarParkGet,
		cfChargingStationGet
	} from '../../network/api.js'
	import {
		wxmpLogin
	} from '../../components/wxmpLogin/wxmpLogin.vue'
	import {
		alimpLogin
	} from '../../components/alimpLogin/alimpLogin.vue'
	import {
		qqmapKey
	} from '../../common/config.js'
	import bindPhonePopup from '../../components/bindPhonePopup/index.vue'
	import inside from '../../components/ParkAndCharingList/inside.vue'
	import external from '../../components/ParkAndCharingList/external.vue'
	import charge from '../../components/ParkAndCharingList/charge.vue'
	import weather from './components/weather.vue'
	import {
		homeWxMpAdId
	} from '../../common/config.js'
	import {
		operatorsId
	} from '../../common/config.js'


	var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
	var qqmapsdk = new QQMapWX({
		key: qqmapKey
	});
	export default {
		components: {
			inside,
			external,
			charge,
			weather,
			wxmpLogin,
			alimpLogin,
			bindPhonePopup
		},
		data() {
			return {
				isLogin: false,
				phoneShow: false,
				navIndex: 0,
				chargeIndex: 0, // 电动车类型tab切换
				locationInfo: {
					longitude: "",
					latitude: "",
				},
				show: false,
				externalParking: [],
				externalChargingStation: [],
				insideParking: [],
				insideChargingStation: [],
				parkMarkers: [],
				chargingMarkers: [],
				weatherInfo: {
					tem: '',
					wea: '',
					air_pm25: '',
					air_level: '',
				},
				cfChargeBikeList: []
			};
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.isLogin = true
				// this.getMyUserInfo()
			} else {
				this.isLogin = false
			}
		},
		onLoad() {
			this.getLocation();
			this.adLoad();
		},
		methods: {
			adLoad() {
				// #ifdef MP-WEIXIN
				// 在页面onLoad回调事件中创建插屏广告实例
				if (uni.createInterstitialAd) {
				interstitialAd = uni.createInterstitialAd({
					adUnitId: homeWxMpAdId
				})
					interstitialAd.onLoad(() => {})
					interstitialAd.onError((err) => {})
					interstitialAd.onClose(() => {})
				}

				// 在适合的场景显示插屏广告
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
				// #endif
			},
			intoOpenMonthlyCard() {
				const user = uni.getStorageSync('user')
				if (!user.phone) {
					this.$refs.bindPhonePopupRef.showPopup()
					return
				}
				uni.navigateTo({
					url: '/pages/monthlyCard/index'
				})
			},
			changeLoginStatus(e) {
				if (e) {
					this.isLogin = true
				} else {
					this.isLogin = false
				}
			},
			clearData() {
				this.externalParking = []
				this.externalChargingStation = []
				this.insideParking = []
				this.insideChargingStation = []
				this.cfChargeBikeList = []
				this.parkMarkers = []
				this.chargingMarkers = []
			},
			changeChargeIndex(index) {
				this.clearData()
				this.chargeIndex = index
				if (index == 0) {
					this.getCfChargeList()
				}
				if (index === 1) {
					// 获取电动二轮充电站
					this.getCfChargeBikeList()
				}
			},
			intoPay() {
				uni.navigateTo({
					url: '/pages/pay/pay'
				})
			},
			change(e) {
				console.log(e);
				this.show = e.show
			},
			intoParkingLotDetail() {
				uni.navigateTo({
					url: '/pages/parkingLotDetail/parkingLotDetail'
				});
			},
			changeNavIndex(index) {
				this.clearData()
				this.navIndex = index;
				if (index == 0) {
					this.getCfParkLotList()
				}
				if (index == 1) {
					if (this.chargeIndex == 0) {
						this.getCfChargeList()
					} else {
						// 获取电动二轮充电站
						this.getCfChargeBikeList()
					}
				}
			},
			onZoomInMap() {
				if (this.navIndex == 0) {
					uni.navigateTo({
						url: "/pages/mapView/index",
					});
				} else {
					const stationType = this.chargeIndex == 0 ? 2 : 1
					uni.navigateTo({
						url: "/pages/mapView/chargeMap?stationType=" + stationType,
					});
				}
			},
			async getCfParkLotList() {
				const {
					data,
					code
				} = await cfCarParkGet({
					positionX: this.locationInfo.longitude,
					positionY: this.locationInfo.latitude,
					distance: 1000,
					page: 1,
					size: 100,
					adminer: operatorsId
				})
				if (code == 10002) {
					this.insideParking = data
					this.refreshMarkers(data, 'cf', 'park')
					// this.getOtherParkLot()
				} else {
					this.getOtherParkLot()
				}
			},
			// 电动自行车列表
			async getCfChargeBikeList() {
				const {
					data,
					code
				} = await cfChargingStationGet({
					positionX: this.locationInfo.longitude,
					positionY: this.locationInfo.latitude,
					distance: 1000,
					page: 1,
					size: 100,
					stationType: 1,
					adminer: operatorsId
				})
				console.log(data, code);
				if (code == 10002) {
					this.cfChargeBikeList = data
					this.refreshMarkers(data, 'cf', 'charging')
				} else {

				}
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
					stationType: 2,
					adminer: operatorsId
				})
				if (code == 10002) {
					this.insideChargingStation = data
					this.refreshMarkers(data, 'cf', 'charging')
				} else {
					this.getOtherChargingStation()
				}
			},
			getLocation() {
				uni.getLocation({
					type: "wgs84",
					success: (res) => {
						this.locationInfo.longitude = res.longitude;
						this.locationInfo.latitude = res.latitude;
						this.getCfParkLotList()
					},
				});
			},
			getOtherChargingStation() {
				qqmapsdk.search({
					keyword: '充电站',
					location: `${this.locationInfo.latitude},${this.locationInfo.longitude}`,
					success: (res) => {
						if (res.status === 0) {
							this.externalChargingStation = res.data
							this.refreshMarkers(res.data, 'tx', 'charging')
						}
					},
					fail: function(err) {
						console.log(err);
					}
				})
			},
			getOtherParkLot() {
				qqmapsdk.search({
					keyword: '停车场',
					location: `${this.locationInfo.latitude},${this.locationInfo.longitude}`,
					success: (res) => {
						if (res.status === 0) {
							this.externalParking = res.data
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
				const iconPath = deviveType === 'park' ? 'http://file.cfeng.wang/parking_icon.png' :
					'http://file.cfeng.wang/charge.png'
				if (dataType === 'cf') {
					datas.forEach((v, idx) => {
						markers.push({
							'id': idx,
							'latitude': v.positionY,
							'longitude': v.positionX,
							'title': v.name,
							'iconPath': iconPath,
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
							'iconPath': iconPath,
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
	page {
		background: #f5f7ff;
		padding-bottom: 16rpx;
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
			font-family: PingFangSC-Medium, PingFang SC, serif;
			font-weight: 500;
			color: #323233;
			line-height: 60rpx;
			margin-left: 32rpx;
		}

		.realStatusText {
			width: 80rpx;
			height: 40rpx;
			background: #FFE3E5;
			border-radius: 21rpx;
			font-size: 16rpx;

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
			margin-top: 40rpx;
		}
	}

	.mapBox {
		width: 100vw;
		height: 950rpx;
	}

	.bg {
		width: 100vw;
		height: 670rpx;
		background: linear-gradient(360deg, #ceddff 0%, #6794f6 100%);
		top: 0;
		left: 0;
		transition: all .2s;
	}

	.mainBox {
		top: 140rpx;

		.navBox {
			width: 100vw;
			padding: 0 32rpx;

			.ac {
				height: 60rpx;
				font-size: 44rpx;
				font-weight: 600;
				color: #ffffff;
				line-height: 60rpx;
				margin-right: 48rpx;
			}

			.notAc {
				@extend .ac;
				opacity: 0.3;
			}
		}

		.mapBox {
			width: 686rpx;
			height: 524rpx;
			background: #ffffff;
			border-radius: 16rpx;
			margin-left: 32rpx;
			overflow: hidden;
			margin-top: 42rpx;

			.map {
				margin: 8rpx 0 0 8rpx;
				width: 670rpx;
				height: 356rpx;
				border-radius: 12rpx;
				filter: blur(0px);
			}

			.monthlyCardButton {
				width: 622rpx;
				height: 96rpx;
				background: #6794f6;
				border-radius: 10rpx;
				margin: 32rpx 0 0 24rpx;

				.text {
					width: 128rpx;
					height: 44rpx;
					font-size: 32rpx;

					font-weight: 500;
					color: #ffffff;
					line-height: 44rpx;
					margin-left: 6rpx;
				}
			}
		}
	}

	.listItem {
		width: 686rpx;
		background: #ffffff;
		border-radius: 10rpx;
		margin: 0 0 32rpx 32rpx;
		padding: 32rpx;

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
				width: 92rpx;
				height: 32rpx;
				line-height: 32rpx;
				background: rgba(78, 146, 246, 0.13);
				border-radius: 4rpx;
				font-size: 20rpx;

				font-weight: 400;
				color: #4e92f6;
				text-align: center;
			}

			view:nth-child(2) {
				width: 514rpx;
				height: 32rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #434343;
				line-height: 34rpx;
				margin-left: 16rpx;
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

	.price {
		margin-top: 24rpx;

		.distance {
			view:nth-child(2) {
				height: 34rpx;
				font-size: 24rpx;

				font-weight: 400;
				color: #434343;
				line-height: 34rpx;
				margin-left: 8rpx;
			}
		}
	}

	.mapZoomInBox {
		width: 80rpx;
		height: 80rpx;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(0, 0, 0, 0.08),
			0rpx 0rpx 2rpx 0rpx rgba(0, 0, 0, 0.08);
		border-radius: 16rpx;
		right: 32rpx;
		bottom: 32rpx;
	}

	.bgWhite {
		background-color: #fff;
	}
</style>