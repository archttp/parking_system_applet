<script>
	export default {
		onLaunch: function(options) {
			console.log('App Launch');
			console.log(options);
			if (options.query && options.query.qrCode) {
				console.info("Alipay scan parameter: " + options.query.qrCode);
				const qrCode = options.query.qrCode;
				if (qrCode.includes('/licensePlateRecognition/deviceId/')) {
					uni.reLaunch({
						url: '/packageMy/my/noLicencePlateCar?q=' + qrCode
					});
				} else if (qrCode.includes('/parkingLock/deviceId/')) {
					uni.reLaunch({
						url: '/packageMy/my/noLicencePlateCar?q=' + qrCode
					});
				} else {
					uni.reLaunch({
						url: '/pages/pay/scanCode?q=' + qrCode
					});
				}
			}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>


<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	image {
		background-size: 100% 100%;
	}

	// 设置整个项目的背景色
	page {
		background: #F5F7FF;
	}

	/*使用 button::after{ border: none; } 来去除边框*/
	.free-btn-bordernone {
		background: none !important;
		color: #fff !important;
	}

	.free-btn-bordernone::after {
		border: none;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}

	.single-line {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.single-line-2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-line-clamp: 2;
	}

	.single-line-3 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		-webkit-line-clamp: 3;
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.bb {
		box-sizing: border-box;
	}

	.por {
		position: relative;
	}

	.poa {
		position: absolute;
	}

	.flex {
		display: flex;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
	}

	.flex-row-center {
		justify-content: center;
	}

	.flex-col-center {
		align-items: center;
	}

	.flex-row-between {
		justify-content: space-between;
	}

	.flex-row-around {
		justify-content: space-around;
	}
</style>