<template>
	<view>
		<view class="address-window" :class="value === true ? 'on' : ''">
			<view class="title">
				<image class="title-logo" src="../../static/images/l-logo.png" mode=""></image>
				<view class="title-txt">
					本小程序 申请
				</view>
			</view>
			<view class="notes">
				<view class="notes-top">
					完善你的昵称、头像
				</view>
				<view class="notes-bot">
					注册、登录小程序
				</view>
			</view>
			<view class="userbox">
				<button class="mydata-arrow-right" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<view class="userbox-item">
						<image class="userbox-item-img" :src="avatarUrl?avatarUrl:headimg" mode=""></image>
						<view class="userbox-item-txt">
							点击选择头像
						</view>
					</view>
				</button>
				<view class="userbox-item">
					<view class="userbox-item-nicheng">
						昵称
					</view>
					<input class="userbox-item-input" type="nickname" v-model="nickName" @blur="getNickname"
						placeholder="请填写昵称">
				</view>
			</view>
			<view class="task-btn">
				<view class="left" @click="closeStudent">
					取消
				</view>
				<view class="left right" @click="authorize">
					授权
				</view>
			</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="value === false" @click="closeStudent"></view>
	</view>
</template>
<script>
	import {
		baseUrl
	} from '../../common/config.js'
	export default {
		name: 'StudentWindow',
		props: {
			value: Boolean,
			mydate: Object
		},
		data: function() {
			return {
				headimg: '../../static/images/user.png',
				avatarUrl: '',
				nickName: '',
				openid: '',

			};
		},
		mounted: function() {},
		methods: {
			async authorize() {
				let that = this;
				if (!that.avatarUrl) {
					uni.showToast({
						title: '请选择头像',
						icon: "none",
						duration: 1500
					})
					return
				}
				that.nickName = that.nickName.trim();
				if (!that.nickName) {
					uni.showToast({
						title: '请填写昵称',
						icon: "none",
						duration: 1500
					})
					return
				}
				uni.showLoading({
					title: "资料上传中···"
				})
				const filePath = that.avatarUrl // 选择图片的临时路径
				// const name = that.avatarUrl.substring(that.avatarUrl.lastIndexOf(".") + 1); // 获取图片格式 png jpg 等
				uni.uploadFile({
					url: `${baseUrl}/file/cfFile/upload`,
					filePath,
					name: 'file',
					formData: {
						businesskey: 'file',
						fileType: 1,
						scene: 'user_avatar'
					},
					header: {
						Authorization: uni.getStorageSync('token')
					},
					success: async (res) => {
						console.log(JSON.parse(res.data));
						const newRes = JSON.parse(res.data)
						if (newRes.code == 10002) {
							let obj = {}
							obj.avatarId = newRes.data.id
							obj.avatarUrl = newRes.data.fileName
							obj.nickName = this.nickName
							this.$emit("send", obj)
							this.$emit('input', false);
							uni.hideLoading()
						} else {
							uni.showToast({
								title: '未知错误',
								icon: 'none'
							})
						}

					}
				})
				// 点击授权将本地头像路径上传至云服务器获取头像网址，以下为uni云服务，使用者可自行更改上传方式
				// await uniCloud.uploadFile({
				// 	filePath, // 临时路径
				// 	cloudPath: Date.now() + "." + name, // 图像名称
				// 	success: res => {
				// 		that.avatarUrl = res.fileID
				// 		let obj = {}
				// 		obj.avatarUrl = this.avatarUrl
				// 		obj.nickName = this.nickName
				// 		this.$emit("send", obj)
				// 		this.$emit('input', false);
				// 	},
				// 	fail(err) {
				// 		uni.showToast({
				// 			title: '资料上传失败' + err,
				// 			icon: 'none',
				// 			duration: 3000
				// 		})
				// 		return;
				// 	},
				// 	complete() {
				// 		uni.hideLoading()
				// 	}
				// })

			},
			getNickname(e) {
				this.nickName = e.detail.value
			},
			async uploadImg(url) {
				let that = this;
				that.avatarUrl = url;
			},
			onChooseAvatar(e) {
				this.uploadImg(e.detail.avatarUrl)
			},
			closeStudent() {
				this.$emit('input', false);
			},
		}
	};
</script>
<style lang="scss" scoped>
	view,
	scroll-view,
	swiper,
	swiper-item,
	cover-view,
	cover-image,
	icon,
	text,
	rich-text,
	progress,
	button,
	checkbox,
	form,
	input,
	label,
	radio,
	slider,
	switch,
	textarea,
	navigator,
	audio,
	camera,
	image,
	video {
		box-sizing: border-box;
	}

	button {
		padding: 0upx;
		margin: 0upx;
		border: none;
		border-radius: 0upx;
		box-sizing: border-box;
		background-color: transparent;
	}

	button.button-hover {
		transform: translate(3rpx, 3rpx);
		background-color: transparent;
	}

	button::after {
		border: none
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		opacity: 0.5;
		z-index: 99;
	}

	.address-window {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 6666;
		padding: 32rpx 40rpx 200rpx;
		transform: translate3d(0, 100%, 0);
		-webkit-transform: translate3d(0, 100%, 0);
		-ms-transform: translate3d(0, 100%, 0);
		-moz-transform: translate3d(0, 100%, 0);
		-o-transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-webkit-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-moz-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-o-transition: all .3s cubic-bezier(.25, .5, .5, .9);
		border-radius: 24rpx 24rpx 0 0;
		box-shadow: 0px 0px 30rpx 30rpx rgba(107, 127, 153, 0.30);
		box-sizing: border-box;

		&.on {
			transform: translate3d(0, 0, 0);
			-webkit-transform: translate3d(0, 0, 0);
			-ms-transform: translate3d(0, 0, 0);
			-moz-transform: translate3d(0, 0, 0);
			-o-transform: translate3d(0, 0, 0);
		}

		.title {
			width: 100%;
			padding: 36rpx 10rpx 40rpx;
			box-sizing: border-box;
			overflow: auto;

			.title-logo {
				float: left;
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.title-txt {
				float: left;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 600;
				text-align: left;
				color: #000;
			}
		}

		.notes {
			width: 100%;

			.notes-top {
				width: 100%;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 600;
				text-align: left;
				color: #000;
			}

			.notes-bot {
				width: 100%;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 400;
				text-align: left;
				color: #666;
				margin-top: 10rpx;
			}
		}

		.userbox {
			width: 100%;
			border-top: 2rpx solid #ededed;
			margin-top: 30rpx;

			.mydata-arrow-right {
				border-color: #fff;
				padding: 0rpx !important;
				margin: 0rpx !important;
				border: none !important;
				border-radius: 0rpx !important;
				box-sizing: border-box !important;
				background-color: transparent !important;

			}

			.userbox-item {
				width: 100%;
				height: 112rpx;
				border-bottom: 2rpx solid #ededed;
				overflow: auto;

				.userbox-item-img {
					float: left;
					width: 70rpx;
					height: 70rpx;
					border-radius: 8rpx;
					margin-top: 20rpx;
					margin-right: 20rpx;
				}

				.userbox-item-txt {
					float: left;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					line-height: 112rpx;
					text-align: left;
					color: #666;
				}

				.userbox-item-nicheng {
					float: left;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					line-height: 112rpx;
					text-align: left;
					color: #000;
				}

				.userbox-item-input {
					float: left;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 400;
					line-height: 112rpx;
					text-align: left;
					color: #000;
					margin-top: 34rpx;
					margin-left: 36rpx;
				}
			}
		}

		.task-btn {
			width: 80%;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin: 44rpx auto 0;

			.left {
				float: left;
				width: 210rpx;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				background: #F2F2F2;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: center;
				color: #5DBC6F;

				&.right {
					float: right;
					background: #5DBC6F;
					color: #ffffff;
				}
			}
		}

	}
</style>