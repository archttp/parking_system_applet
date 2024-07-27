<template>
	<view>
		<!-- <view class="line"></view> -->
		<!-- <u-tabs :list="list1" active-color="#488cf5" :is-scroll="false" :current="current" @change="change"></u-tabs> -->
		<image :src="info.image" style="width: 610rpx;height: 610rpx;margin: 276rpx 0 0 70rpx;"></image>
		<!-- <image v-else :src="info.urlImage"  style="width: 360rpx;height: 360rpx;margin: 276rpx 0 0 196rpx;"></image> -->
		<view class="Refresh u-flex-r u-col-center u-row-center" @click="refresh">
			<view class="text">刷新二维码</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {
		createCouponQrcode
	} from '../../network/api.js'
	import {
		logoText,
		qrcodeIconPath,
	} from '../../common/config.js'
	import {
		getBase64FromLocalAsync
	} from '../../utils/index.js'
	export default {
		data() {
			return {
				typeId: '',
				info: '',
			}
		},
		onLoad(e) {
			this.params = JSON.parse(e.params)
			this.getQrCode()
		},
		methods: {
			refresh() {
				this.getQrCode()
			},
			async getQrCode() {
				var bases64Icon = getBase64FromLocalAsync(qrcodeIconPath);
				bases64Icon.then(async (resolve)=>{
					var res = await createCouponQrcode({
						...this.params,
						qrcodeModel: 'url',
						logoText: logoText,
						logoIconBase64: resolve.substr(resolve.indexOf(',')+1)
					})
					if (res.code == 10002) {
						res.data.image = this.getBase64ImageUrl(res.data.qr_code_images)
						this.info = res.data
						// this.$refs.uTips.show({
						// 	title: '生成成功 请让车主进小程序首页扫码领取',
						// 	type: 'success',
						// 	duration: '10000'
						// })
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					}
				});
			},
			//把base64转换成图片
			getBase64ImageUrl: function(data) {
				/// 获取到base64Data
				var base64Data = data;
				/// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
				base64Data = uni.arrayBufferToBase64(uni.base64ToArrayBuffer(base64Data));
				/// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
				const base64ImgUrl = "data:image/png;base64," + base64Data;
				/// 刷新数据
				return base64ImgUrl;
			},
		}
	}
</script>

<style lang="scss">
	.line {
		width: 750rpx;
		height: 20rpx;
		background-color: #f5f5f5;
	}

	.Refresh {
		width: 224rpx;
		height: 64rpx;
		border-radius: 40rpx;
		border: 2rpx solid #488cf5;
		margin: 44rpx 0 0 264rpx;

		.text {
			height: 64rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #488cf5;
			line-height: 64rpx;
			text-align: center;
		}
	}
</style>