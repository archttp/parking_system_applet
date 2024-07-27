<template>
	<view>
		<view class="userInfoBox bb">
			<image src="../../static/images/user.png" class="avatarBox" v-if="!isLogin"></image>
			<image :src="userinfo.avatarUrl" class="avatarBox" v-else @click="changeAvatar"></image>
			<view class="name single-line">{{isLogin ? userinfo.nickName : '请登录'}}</view>
			<view class="address" @click="copyId">id: {{ userinfo.id || ' -' }}</view>
		</view>
		<view class="Subject">
			<!-- <view class="serveInfoBox flex flex-row-around">
				<view class="flex-col flex-col-center" style="margin-top: 30rpx;">
					<view style="font-size: 36rpx;font-weight: 600;color: #323233;">300天</view>
					<view style="font-size: 24rpx;font-weight: 400;color: #323233;">物业服务剩余</view>
				</view>
				<view class="line"></view>
				<view class="flex-col flex-col-center" style="margin-top: 30rpx;">
					<view style="font-size: 36rpx;font-weight: 600;color: #323233;">15天</view>
					<view style="font-size: 24rpx;font-weight: 400;color: #323233;">月卡有效期</view>
				</view>
			</view> -->
			<view class="commonFunctionsBox" style="height: 634rpx;">
				<view class="title">常用功能</view>
				<view class="flex flex-wrap">
					<view class="flex-col flex-col-center" style="width: 25%;margin: 48rpx 0 0 0;"
						v-for="item,index in CommonlyUsedFunctionsArr" :key="item.icon"
						@click="onCommonlyUsedFunction(index)">
						<image style="width: 48rpx;height: 48rpx;" :src="'../../static/images/my/' + item.icon + '.png'"
							mode=""></image>
						<view style="font-size: 20rpx;font-weight: 400;color: #323233;margin-top: 8rpx;">{{item.label}}
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<!-- <view class="commonFunctionsBox">
				<view class="title">APP功能</view>
				<view class="flex flex-wrap">
					<view class="flex-col flex-col-center" style="width: 25%;margin: 48rpx 0 0 0;"
						v-for="item in appFunctionsArr" :key="item.icon" @click="onAppFunction">
						<image style="width: 48rpx;height: 48rpx;" :src="'../../static/images/my/' + item.icon + '.png'"
							mode=""></image>
						<view style="font-size: 20rpx;font-weight: 400;color: #323233;margin-top: 8rpx;">{{item.label}}
						</view>
					</view>
				</view>
			</view> -->
			<!-- #endif -->
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<wxmpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<alimpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		wxmpLogin
	} from '../../components/wxmpLogin/wxmpLogin.vue'
	import {
		alimpLogin
	} from '../../components/alimpLogin/alimpLogin.vue'
	import {
		getMyInfo,
		scanLoginQrCode,
		qrCodeLoginConfirmation
	} from '../../network/api.js'
	export default {
		components: {
			wxmpLogin,
			alimpLogin
		},
		data() {
			return {
				appFunctionsArr: [{
					icon: 'home@2x',
					label: '我的家庭',
				}, {
					icon: 'parkinglot@2x',
					label: '车位管理',
				},{
					icon: 'switchuser@2x',
					label: '访客记录',
				}, {
					icon: 'home@2x',
					label: '商户认证',
				}],

				CommonlyUsedFunctionsArr: [{
						icon: 'propertysafety@2x',
						label: '临停缴费',
					}, {
						icon: 'swap@2x',
						label: '停车记录',
					},
					// #ifdef MP-WEIXIN
					{
						icon: 'thunderbolt@2x',
						label: '充电账单',
					},
					// #endif
					{
						icon: 'car@2x',
						label: '我的爱车',
					},
					// #ifdef MP-WEIXIN
					{
						icon: 'parkinglot@2x',
						label: '我的套餐',
					},
					{
						icon: 'YUAN@2x',
						label: '我的钱包',
					},
					// #endif
					{
						icon: 'parkinglot@2x',
						label: '应急出入闸',
					},
					{
						icon: 'switchuser@2x',
						label: '我的订单',
					},
					{
						icon: 'setting@2x',
						label: '系统设置',
					},
					{
						icon: 'moneycollect@2x',
						label: '发券中心',
					},
					{
						icon: 'gift@2x',
						label: '我的优惠券',
					},
					// #ifdef MP-WEIXIN
					{
						icon: 'moneycollect@2x',
						label: '停车储值卡',
					},
					{
						icon: 'moneycollect@2x',
						label: '充电储值卡',
					},
					{
						icon: 'parkinglot@2x',
						label: '我的车场',
					},
					// #endif
					// {
					// 	icon: 'scan',
					// 	label: '扫码',
					// }
					// {
					// 	icon: 'setting@2x',
					// 	label: '蓝牙测试',
					// }
				],
				code: '',
				isLogin: false,
				userinfo: {
					id: '',
					avatarUrl: '',
					nickName: '',
					phone: ''
				},
			}
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.isLogin = true
				this.getMyUserInfo()
			} else {
				this.isLogin = false
			}
		},
		methods: {
			copyId() {
				uni.setClipboardData({
					data: this.userinfo.id
				})
			},
			async getMyUserInfo() {
				const {
					data,
					code
				} = await getMyInfo()
				if (code == 10002) {
					this.userinfo.id = data.id
					this.userinfo.avatarUrl = data.avatarUrl
					this.userinfo.nickName = data.nickName
					this.userinfo.phone = data.phone
				}
			},
			changeLoginStatus(e) {
				if (e) {
					this.isLogin = true
					this.getMyUserInfo()
				} else {
					this.isLogin = false
				}
			},
			onAppFunction() {
				uni.showToast({
					title: '请前往各大应用市场下载 才风智慧app 体验',
					icon: 'none'
				})
			},
			onCommonlyUsedFunction(index) {
				const pages = [
					'/pages/parkPay_input/parkPay_input',
					'/pages/parkingRecords/parkingRecords',
					// #ifdef MP-WEIXIN
					'/pages/chargeDetail/order',
					// #endif
					'/pages/myCar/myCar',
					// #ifdef MP-WEIXIN
					'/pages/my/monthlyCardPackage',
					'/pages/my/myWallet',
					// #endif
					'/pages/my/emergency',
					'/pages/my/orderList',
					'/pages/my/setMyInfo',
					'/pages/coupon/index',
					'/pages/my/myCoupon',
					// #ifdef MP-WEIXIN
					'/pages/my/storedValueCard',
					'/pages/my/chargingStoredValueCard',
					'/pages/my/parkList',
					// #endif
					// '/pages/bluetoothTest/bluetoothTest'
				];
				// if (index == this.CommonlyUsedFunctionsArr.length - 1) {
				// 	this.onScan()
				// 	return
				// }
				if (index >= 0 && index < pages.length) {
					uni.navigateTo({
						url: pages[index]
					});
				} else {
					console.log("Invalid index");
				}
			},
			onScan() {
				uni.showActionSheet({
					itemList: ['后台登录扫码'],
					success({
						tapIndex
					}) {
						if (tapIndex === 0) {
							uni.showLoading()
							uni.scanCode({
								success: ({
									errMsg,
									result
								}) => {
									uni.hideLoading()
									if (errMsg === 'scanCode:ok') {
										const info = JSON.parse(result)
										uni.showModal({
											title: '提示',
											content: '您确认登录吗?',
											success: async ({
												confirm
											}) => {
												if (confirm) {
													const scanLoginQrCodeRes =
														await scanLoginQrCode({
															qrCodeId: info.id,
															randomCode: info
																.randomCode,
														})
													if (scanLoginQrCodeRes.code ===
														10002) {
														const scanRes =
															await qrCodeLoginConfirmation({
																qrCodeId: scanLoginQrCodeRes
																	.data.id
															})
														uni.showToast({
															title: scanRes.message,
															icon: 'none'
														})
													} else {
														uni.showToast({
															title: scanLoginQrCodeRes
																.message,
															icon: 'none'
														})
													}
												}
											}
										})
									}
								}
							})
						}
					}
				})
			},
			changeAvatar() {
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					success: (res) => {
						console.log(res);
						uni.editImage({
							src: res.tempFiles[0].tempFilePath
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
	}

	.Subject {
		position: absolute;
		top: 520rpx;
		left: 32rpx;
	}

	.commonFunctionsBox {
		width: 686rpx;
		height: 248rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		overflow: hidden;
		margin: 32rpx 0 32rpx 0;

		.title {
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #323233;
			line-height: 44rpx;
			margin: 32rpx 0 0 32rpx;
		}
	}

	.serveInfoBox {
		width: 686rpx;
		height: 142rpx;
		background: #FFFFFF;
		border-radius: 18rpx;
		position: relative;

		.line {
			width: 2rpx;
			height: 36rpx;
			background: #DDE0EC;
			border-radius: 1rpx;
			position: absolute;
			top: 54rpx;
			left: 342rpx;
		}
	}

	.userInfoBox {
		width: 750rpx;
		height: 582rpx;
		background-image: url('../../static/images/myBG@2x.png');
		background-size: 100% 100%;
		padding: 0 32rpx;
	}

	.avatarBox {
		width: 160rpx;
		height: 160rpx;
		border: 8rpx solid #FFFFFF;
		border-radius: 50%;
		margin-top: 174rpx;
		background: #FFFFFF;
	}

	.name {
		width: 100%;
		height: 66rpx;
		font-size: 48rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 66rpx;
		margin-top: 24rpx;
	}

	.address {
		height: 34rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #FFFFFF;
		line-height: 34rpx;
		margin-top: 12rpx;
	}
</style>