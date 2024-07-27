<template>
	<view>
		<view class="SubjectBox bb">
			<view class="flex flex-row-between bb" style="padding: 0 32rpx;margin-top: 48rpx;"
				@click="plateShow = true">
				<view class="inputItem">{{plateNoArr[0]}}</view>
				<view class="inputItem">{{plateNoArr[1]}}</view>
				<view class="inputItem">{{plateNoArr[2]}}</view>
				<view class="inputItem">{{plateNoArr[3]}}</view>
				<view class="inputItem">{{plateNoArr[4]}}</view>
				<view class="inputItem">{{plateNoArr[5]}}</view>
				<view class="inputItem">{{plateNoArr[6]}}</view>
				<view :class="plateNoArr.length > 7 ? 'inputItem' : 'inputItem_end'">
					{{plateNoArr.length > 7 ? plateNoArr[7] : '新能源'}}
				</view>
			</view>
			<headerTitle title="历史记录" />
			<view style="font-size: 24rpx;opacity: .7;margin-top: 16rpx;margin-left: 32rpx;">提示: 仅保存输入的前十条</view>
			<view class="flex bb flex-wrap" style="margin-top: 48rpx;padding: 0 32rpx;">
				<view class="historyBox" v-if="historyEnterLicensePlateList.length == 0">暂无</view>
				<view class="historyBox" v-for="item,index in historyEnterLicensePlateList" :key="index"
					@click="intoBillList(item)">{{item}}</view>
			</view>
			<view class="popupButton" @click="intoBillList()">
				查询账单</view>
		</view>
		<plate-input v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow=false"></plate-input>
		<!-- #ifdef MP-WEIXIN -->
		<wxmpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
		<!-- #ifdef MP-ALIPAY -->
		<alimpLogin @changeLoginStatus="changeLoginStatus" v-if="!isLogin" />
		<!-- #endif -->
	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	import headerTitle from '../../components/headerTitle.vue'
	import {
		wxmpLogin
	} from '../../components/wxmpLogin/wxmpLogin.vue'
	import {
		alimpLogin
	} from '../../components/alimpLogin/alimpLogin.vue'
	export default {
		components: {
			headerTitle,
			plateInput,
			wxmpLogin,
			alimpLogin
		},
		computed: {
			plateNoArr() {
				return this.plateNo.split('')
			}
		},
		data() {
			return {
				plateShow: false,
				plateNo: '',
				historyEnterLicensePlateList: [],
				isLogin: false
			}
		},
		onShow() {
			const historyEnterLicensePlate = uni.getStorageSync('historyEnterLicensePlate')
			if (historyEnterLicensePlate != null && historyEnterLicensePlate.length > 0) {
				this.historyEnterLicensePlateList = historyEnterLicensePlate
			}

			if (uni.getStorageSync('token')) {
				this.isLogin = true
			} else {
				this.isLogin = false
			}
		},
		methods: {
			changeLoginStatus(e) {
				if (e) {
					this.isLogin = true
				} else {
					this.isLogin = false
				}
			},
			intoBillList(plateNo = '') {
				//订阅消息模板
				// uni.requestSubscribeMessage({
				// 	tmplIds: ['lvPwUj1Rvooo05NYTo1_moLDFzYox3EcTqFTU57kPgA']
				// })
				if (plateNo) {
					uni.navigateTo({
						url: '/pages/pay/billList?licensePlateNumber=' + plateNo
					})
				} else {
					if (this.plateNo) {
						uni.navigateTo({
							url: '/pages/pay/billList?licensePlateNumber=' + this.plateNo
						})
					} else {
						uni.showToast({
							title: '车牌号为空',
							icon: 'none'
						})
					}
				}
			},
			setPlate(e) {
				this.plateNo = e;
				this.plateShow = false;
				const historyEnterLicensePlate = uni.getStorageSync('historyEnterLicensePlate')
				// 删除重复车牌号
				const index = historyEnterLicensePlate.indexOf(e);
				if (index !== -1) {
					historyEnterLicensePlate.splice(index, 1);
				}
				if (historyEnterLicensePlate === null || !historyEnterLicensePlate) {
					uni.setStorageSync('historyEnterLicensePlate', [e])
				} else {
					if (historyEnterLicensePlate.length > 9) {
						historyEnterLicensePlate.pop();
					}
					uni.setStorageSync('historyEnterLicensePlate', [e, ...historyEnterLicensePlate])
				}
				this.historyEnterLicensePlateList = uni.getStorageSync('historyEnterLicensePlate')
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F7FF;
	}

	.historyBox {
		width: 160rpx;
		height: 66rpx;
		border-radius: 8rpx;
		border: 2rpx solid #E5E5E5;
		font-size: 24rpx;

		font-weight: 400;
		color: #323233;
		line-height: 66rpx;
		text-align: center;
		margin: 0 16rpx 16rpx 0;
	}

	.SubjectBox {
		width: 686rpx;
		background: #FFFFFF;
		margin: 32rpx 0 0 32rpx;
		overflow: hidden;
		padding-bottom: 32rpx;
	}

	.inputItem {
		width: 64rpx;
		height: 64rpx;
		border-radius: 8rpx;
		border: 2rpx solid #6794F6;
		font-size: 36rpx;
		font-weight: 600;
		color: #323233;
		line-height: 64rpx;
		text-align: center;
	}

	.inputItem_end {
		@extend .inputItem;
		font-size: 16rpx;

		font-weight: 400;
		color: #A4A4A4;
	}

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
		margin-top: 128rpx;
		margin-left: 32rpx;
	}
</style>