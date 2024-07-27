<template>
	<view>
		<view class="title1">您好，</view>
		<view class="title2">{{isLogin ? '您已授权 正在处理~' : '请点击授权'}}</view>
		<!-- #ifdef MP-WEIXIN -->
		<button @click="wxLogin" class="authorize" :loading='isCode'>
			{{isLogin ? '您已授权' : '点击授权'}}
		</button>
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<button @click="aliLogin" class="authorize" :loading='isCode'>
			{{isLogin ? '您已授权' : '点击授权'}}
		</button>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		wxAppid,
		aliAppid
	} from '../../common/config.js'
	import {
		wxMpLogin,
		getLastCarParkUseLogByCheckPointId,
		getAliMinBaseUserInfoByCode,
		scanLoginQrCode,
		qrCodeLoginConfirmation
	} from '../../network/api.js'
	export default {
		data() {
			return {
				code: '',
				carpark_checkpoint_id: '',
				chargingStationId: '',
				portId: '',
				scanType: '',
				isLogin: false,
				carParkUseLogId: '',
				qrCodeId: '',
				randomCode: '',
				codeType: ''
			}
		},
		onShow(e) {
			// #ifdef MP-WEIXIN
			this.getCode()
			// #endif
		},
		onLoad(e) {
			const token = uni.getStorageSync('token')
			const q = decodeURIComponent(e.q)
			// 这里做数据存储使用 因为涉及未登录情况下 点击登录后再跳转的情况
			if (q) {
				if (q.includes('/evc/')) {
					const extractedIds = this.extractIdsFromUrl(q, 'evc');
					const {
						chargingStationId,
						portId
					} = extractedIds;
					this.setChargeDetails(chargingStationId, portId, 'evc');
				} else if (q.includes('/bcc/')) {
					const extractedIds = this.extractIdsFromUrl(q, 'bcc');
					const {
						chargingStationId,
						portId
					} = extractedIds;
					this.setChargeDetails(chargingStationId, portId, 'bcc');
				} else if (q.includes('/carParkFee/checkPointId/')) {
					this.scanType = 'carParkFee';
					this.carpark_checkpoint_id = q.split('/scene/carParkFee/checkPointId/')[1];
				} else if (q.includes('/carParkFee/carParkUseLogId/')) {
					this.scanType = 'carParkUseLogId';
					this.carParkUseLogId = q.split('/scene/carParkFee/carParkUseLogId/')[1];
				} else if (q.includes('/login/')) {
					const extractedIds = this.extractLoginFromUrl(q, 'login');
					const {
						qrCodeId,
						randomCode,
						codeType
					} = extractedIds;
					this.scanType = 'login';
					this.loginQrCodeId = qrCodeId;
					this.loginRandomCode = randomCode;
					this.loginCodeType = codeType;
				}else if (q.includes('/bindPhone')) {
					this.scanType = 'bindPhone';
				}
			}
			if (token) {
				this.isLogin = true;
				if (this.scanType === 'evc') {
					this.navigateToChargeDetail('scanCodeElectricVehicleStart');
				} else if (this.scanType === 'bcc') {
					this.navigateToChargeDetail('scanCodeBicycleStart');
				} else if (this.scanType === 'carParkFee') {
					this.showLoadingAndFetchCarParkUseLogId();
				} else if (this.scanType === 'carParkUseLogId') {
					this.navigateToPaymentPage('carParkUseLogId');
				} else if (this.scanType === 'login') {
					this.navigateToLoginPage();
				} else if (this.scanType === 'bindPhone') {
					this.navigateToBindPhonePage();
				}
			} else {
				this.isLogin = false;
			}
		},
		methods: {
			setChargeDetails(chargingStationId, portId, scanType) {
				this.chargingStationId = chargingStationId;
				this.portId = portId;
				this.scanType = scanType;
			},
			navigateToChargeDetail(pageName) {
				uni.reLaunch({
					url: `/pages/chargeDetail/${pageName}?chargeId=${this.chargingStationId}&portId=${this.portId}`
				});
			},
			showLoadingAndFetchCarParkUseLogId() {
				uni.showLoading({
					title: '正在查看账单~'
				});
				this.getCarParkUseLogId();
			},
			navigateToPaymentPage(paymentType) {
				uni.reLaunch({
					url: `/pages/pay/pay?${paymentType}=${this.carParkUseLogId}`
				});
			},
			async navigateToLoginPage () {
				const scanLoginQrCodeRes = await scanLoginQrCode({
						qrCodeId: this.loginQrCodeId,
						randomCode: this.loginRandomCode,
					})
				if (scanLoginQrCodeRes.code === 10002) {
					//二次确认登录
					qrCodeLoginConfirmation({
							qrCodeId: scanLoginQrCodeRes.data.id
						})
						uni.showModal({
							title: '提示',
							content: '扫码登录成功',
							success: async ({
								confirm
							}) => {
								uni.reLaunch({
									url: `/pages/index/index`
								});
							}
						})
				} else {
					uni.showModal({
						title: '提示',
						content: scanLoginQrCodeRes.message,
						success: async ({
							confirm
						}) => {
							uni.reLaunch({
								url: `/pages/index/index`
							});
						}
					})
				}
			},
			navigateToBindPhonePage() {
				uni.reLaunch({
					url: `/packageMy/my/changePhone/index`
				});
			},
			extractIdsFromUrl(url, model) {
				const paramsArray = url.split(model+'/')[1];
				const ids = paramsArray.split('-')
				return {
					chargingStationId: ids[0],
					portId: ids[1]
				};
			},
			extractLoginFromUrl(url, model) {
				const paramsArray = url.split(model+'/')[1];
				const ids = paramsArray.split('-')
				return {
					qrCodeId: ids[0],
					randomCode: ids[1],
					codeType: ids[2]
				};
			},
			async getCarParkUseLogId() {
				const {
					data,
					code
				} = await getLastCarParkUseLogByCheckPointId({
					checkPointId: this.carpark_checkpoint_id,
					limitTime: 300000
				})
				console.log(data, code);
				if (code == 10002 && data != null) {
					uni.reLaunch({
						url: '/pages/pay/pay?carParkUseLogId=' + data
					})
				} else {
					uni.showToast({
						title: '暂无账单 请手动输入车牌',
						icon: 'none'
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/parkPay_input/parkPay_input'
						})
					}, 1500);
				}
			},
			aliLogin() {
				if (this.isLogin) return
				var _ = this
				uni.getAuthCode({
					scopes: ['auth_user'],
					success: async (res) => {
						if (res.authCode) {
							var loginRes = await getAliMinBaseUserInfoByCode({
								authCode: res.authCode,
								appid: aliAppid
							})
							uni.hideLoading()
							if (loginRes.code === 10002) {
								uni.setStorageSync('user', loginRes.data);
								uni.setStorageSync('token', loginRes.token.access_token);
								_.isLogin = true;
								switch (_.scanType) {
									case 'carParkFee':
										_.getCarParkUseLogId();
										break;
									case 'bcc':
										_.navigateToChargeDetail('scanCodeBicycleStart');
										break;
									case 'evc':
										_.navigateToChargeDetail('scanCodeElectricVehicleStart');
										break;
									case 'carParkUseLogId':
										_.navigateToPaymentPage('carParkUseLogId');
										break;
									case 'login':
										_.navigateToLoginPage();
										break;
									case 'bindPhone':
										_.navigateToBindPhonePage();
										break;
									default:
										break;
								}
							} else {
								uni.showToast({
									title: '登录出错',
									icon: 'none'
								});
							}
						}
					},
				});
			},
			getCode() {
				wx.login({
					success: (res) => {
						console.log(res);
						this.code = res.code
					}
				})
			},
			wxLogin(e) {
				if (this.isLogin) return
				var _ = this
				uni.getUserProfile({
					desc: '保存用户数据',
					success: async ({
						iv,
						encryptedData
					}) => {
						var data = {
							iv,
							code: this.code,
							loginType: 'mp',
							encryptedData,
							appid: wxAppid
						}
						var loginRes = await wxMpLogin(data)
						console.log('登陆个人信息', loginRes)
						uni.hideLoading()
						// code 失效
						if (loginRes.code === 24017) {
							uni.showToast({
								title: 'code失效 请重试一次',
								icon: 'none'
							})
							_.getCode()
						} else if (loginRes.code == 10002) {
							uni.setStorageSync('user', loginRes.data);
							uni.setStorageSync('token', loginRes.token.access_token);
							_.isLogin = true;
							switch (_.scanType) {
								case 'carParkFee':
									_.getCarParkUseLogId();
									break;
								case 'bcc':
									_.navigateToChargeDetail('scanCodeBicycleStart');
									break;
								case 'evc':
									_.navigateToChargeDetail('scanCodeElectricVehicleStart');
									break;
								case 'carParkUseLogId':
									_.navigateToPaymentPage('carParkUseLogId');
									break;
								case 'login':
									_.navigateToLoginPage();
									break;
								case 'bindPhone':
									_.navigateToBindPhonePage();
									break;
								default:
									break;
							}
						} else {
							uni.showToast({
								title: '登陆出错',
								icon: 'none'
							})
							_.getCode()
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.title1 {
		height: 90rpx;
		font-size: 64rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #323233;
		line-height: 90rpx;
		margin: 240rpx 0 0 56rpx;
	}

	.title2 {
		height: 56rpx;
		font-size: 40rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #323233;
		line-height: 56rpx;
		margin: 12rpx 0 0 56rpx;
	}

	.authorize {
		width: 670rpx;
		height: 100rpx;
		background: #488CF5;
		border-radius: 12rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #fff;
		line-height: 100rpx;
		position: absolute;
		bottom: 162rpx;
		left: 40rpx;
	}
</style>