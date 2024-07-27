<template>
	<view>
		<view class="alike headPortraits bb" @click="album">
			<view class="left">
				我的头像
			</view>
			<view class="right">
				<view>
					<image :src="userinfo.avatarUrl?userinfo.avatarUrl:'../../static/images/user.png'"></image>
				</view>
			</view>
		</view>

		<view class="alike bb" style="margin-top:0;" @click="album">
			<view class="left">
				我的昵称
			</view>
			<view class="right">
				<view class="">{{ userinfo.nickName }}</view>
				<image src="../../static/images/left2x.png" style="width: 24rpx;height: 48rpx;margin-left: 10rpx;">
				</image>
			</view>
		</view>

		<view class="alike mobile bb" @click="openMyMobile">
			<view class="left">
				手机号
			</view>
			<view class="right">
				<view class="">{{ userinfo.phone ? userinfo.phone : '未绑定' }}</view>
				<image src="../../static/images/left2x.png" style="width: 24rpx;height: 48rpx;margin-left: 10rpx;">
				</image>
			</view>
		</view>

		<view class="logoutButton flex flex-row-center flex-col-center" @click="onLogout">
			<view class="text">退出登录</view>
		</view>
		<OpendateWindow v-model="showdate" @send="getSonValue"></OpendateWindow>
	</view>
</template>
<script>
	import OpendateWindow from '@/components/opendate-Window/opendate-Window.vue'
	import {
		getMyInfo,
		modifyPersonalInformation
	} from '../../network/api.js'

	export default {
		components: {
			OpendateWindow
		},
		data() {
			return {
				userinfo: {
					avatarUrl: '',
					nickName: '',
					phone: ''
				},
				showdate: false
			}
		},
		onShow() {
			this.getMyUserInfo()
		},
		methods: {
			async getMyUserInfo() {
				uni.showLoading({
					title: '正在加载~'
				})
				const {
					data,
					code
				} = await getMyInfo()
				uni.hideLoading()
				if (code == 10002) {
					this.userinfo.avatarUrl = data.avatarUrl
					this.userinfo.nickName = data.nickName
					this.userinfo.phone = data.phone
				}
			},
			async getSonValue(res) {
				console.log('获取用户', res)
				const {
					data,
					code,
					message
				} = await modifyPersonalInformation({
					avatar: res.avatarId,
					nickName: res.nickName
				})
				if (code == 10002) {
					this.getMyUserInfo()
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			onLogout() {
				uni.showModal({
					title: '提示',
					content: '您确认退出登录吗?',
					success: ({
						confirm
					}) => {
						if (confirm) {
							uni.clearStorageSync()
							uni.showToast({
								title: '操作成功',
								icon: 'success'
							})
							setTimeout(function() {
								uni.switchTab({
									url: '/packageMy/my/my'
								})
							}, 1500);
						}
					}
				})

			},
			// async getUserinfo(){
			// 	var res = await this.$u.api.findById({
			// 		uid : uni.getStorageSync('user').id,
			// 		simpleQuery:'yes'
			// 	})
			// 	console.log(123,res);
			// },
			album() {
				this.showdate = true
				// const that = this
				// uni.chooseImage({
				// 	count: 1, //默认9
				// 	success: function({
				// 		tempFiles
				// 	}) {
				// 		const files = tempFiles[0].path
				// 		console.log(files);
				// 		uni.showLoading({
				// 			title: '请稍等',
				// 			icon: 'none'
				// 		});
				// 		uni.uploadFile({
				// 			url: `${baseUrl}/file/upload`,
				// 			filePath: files,
				// 			name: 'file',
				// 			formData: {
				// 				businesskey: 'file'
				// 			},
				// 			header: {
				// 				Authorization: 'Bearer ' + that.vuex_token
				// 			},
				// 			success: async (res) => {
				// 				uni.hideLoading()
				// 				const ress = JSON.parse(res.data)
				// 				if (ress.code === 10002) {
				// 					const {
				// 						data,
				// 						code,
				// 						message
				// 					} = await that.$u.api.customerBaseUpdate({
				// 						avatar: ress.data.filePath
				// 					})
				// 					if (code === 10002) {
				// 						uni.showToast({
				// 							title: message,
				// 							icon: 'none'
				// 						})
				// 						this.userinfo.avatar = data.avatar
				// 						uni.setStorageSync('user', this.userinfo)
				// 					} else {
				// 						uni.showToast({
				// 							title: '更换头像失败',
				// 							icon: 'none'
				// 						})
				// 					}
				// 				} else {
				// 					uni.showToast({
				// 						title: '图片上传失败',
				// 						icon: 'none'
				// 					})
				// 				}
				// 			}
				// 		})
				// 	}
				// });
			},
			openMyMobile() {
				uni.navigateTo({
					url: "/packageMy/my/changePhone/index"
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}

	.logoutButton {
		width: 690rpx;
		height: 96rpx;
		background: #6794f6;
		border-radius: 10rpx;
		position: fixed;
		bottom: 52rpx;
		left: 30rpx;

		.text {
			width: 128rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ffffff;
			line-height: 44rpx;
			margin-left: 6rpx;
		}
	}

	.alike {
		width: 750rpx;
		padding: 26rpx 3vw;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 34rpx;

		.left {
			height: 44rpx;
			font-size: 32rpx;

			font-weight: 400;
			color: rgba(50, 50, 51, 0.7);
			line-height: 44rpx;
		}

		.right {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			>view {
				color: rgba(50, 50, 51, 0.5);
				font-size: 30rpx;

				image {

					width: 104rpx;
					height: 104rpx;
					border-radius: 50rpx;
				}
			}

			.iconfont {
				color: #0A2463;
				font-size: 32rpx;
				font-weight: 600;
				margin-left: 20rpx;
			}

		}
	}

	.headPortraits {
		border-bottom: 2rpx solid #EFEFEF;
	}

	.mobile {
		margin-top: 20rpx;
	}

	.region-box {
		>view {
			width: 90vw;
			margin: 0rpx 5vw;
			height: 100rpx;
			color: #0A2463;
			font-size: 32rpx;
			line-height: 100rpx;
			text-align: center;
			border-bottom: 2rpx solid #EFEFEF;
			font-weight: 600;
		}

		.cancel {
			color: #0A2463;
			opacity: 0.5;
		}
	}
</style>