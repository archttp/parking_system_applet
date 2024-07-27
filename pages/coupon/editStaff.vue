<template>
	<view>
		<view class="userBox u-flex-r" @click="editStaffInfo">
			<image :src="userinfo?userinfo.staffAvatarURL:'../../static/images/user.png'" ></image>
			<view class="u-flex-c">
				<view class="name">{{userinfo.staffName}}</view>
				<view class="id">ID:{{userinfo.id}}</view>
			</view>
		</view>
		<u-line color="#f7f7f7" />
		<!-- <view class="TotalBox u-flex-r">
			<view class="left">修改名称</view>
			<navigator class="navigator" :url="'shopAssistant/setRemarks?id=' + userinfo.id" hover-class="none"> 
				<view class="u-flex-r u-abso" style="right:38rpx;">
					<image class="right_image" src="../../static/images/left2x.png"></image>
				</view>
			</navigator>
		</view> -->
		<view class="TotalBox u-flex-r" @click="gotoList('amountTodaySended')">
			<view class="left">今日发送金额 {{ userinfo.amountTodaySended }} /元</view>
		</view>
		<view class="TotalBox u-flex-r" @click="gotoList('amountHoursSended')">
			<view class="left">24小时发送金额 {{ userinfo.amountHoursSended }} /元</view>
		</view>
		<view class="TotalBox u-flex-r" @click="gotoList('timeTodaySended')">
			<view class="left">今日发送时长 {{ userinfo.timeTodaySended/3600000 }} /小时</view>
		</view>
		<view class="TotalBox u-flex-r" @click="gotoList('timeHoursSended')">
			<view class="left">24小时发送时长 {{ userinfo.timeHoursSended/3600000 }} /小时</view>
		</view>
		<view class="TotalBox u-flex-r" @click="gotoList('timesTodaySended')">
			<view class="left">今日发送次数 {{ userinfo.timesTodaySended }} /次</view>
		</view>
		<view class="TotalBox u-flex-r" @click="gotoList('timesHoursSended')">
			<view class="left">24小时发送次数 {{ userinfo.timesHoursSended }} /次</view>
		</view>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import {
		getCouponActivityStaffLimit
	} from '../../network/api.js'
	export default {
		data() {
			return {
				userinfo: '',
				remarks:'',
				total:[]
			}
		},
		onLoad(e) {
			this.userinfo = JSON.parse(uni.getStorageSync('staffLimit'))
		},
		onShow() {
			
		},
		methods:{
			async getInfo(){
					var res = await getCouponActivityStaffLimit({
						couponActivityId:uni.getStorageSync('parkingTicketActivityId'),
						staffId:this.userinfo.staffId
					})
					if(res.code == 10002){
						this.total = res.data
					}else{
						this.total = []
					}
			},
			editStaffInfo(){
				uni.navigateTo({
					url: '/pages/coupon/setSendCoupons?couponActivityId=' + this.userinfo.couponActivityId + "&fromUid=" + this.userinfo.staffId
				})
			},
			gotoList(type){
				let _url = '/pages/coupon/sendCouponsList?couponActivityId=' + this.userinfo.couponActivityId + '&fromUid=' + this.userinfo.staffId;
				switch(type){
					case 'amountTodaySended':	//今日发送金额
						let minTime = dayjs( (dayjs().format('YYYY-MM-DD '))+' 00:00:00' ).valueOf();
						_url += '&minCreateTime=' + minTime + '&couponType=2';
						break;
					case 'amountHoursSended':	//24小时发送金额
						minTime = dayjs().valueOf()-86400000;
						_url += '&minCreateTime=' + minTime + '&couponType=2';
						break;
					case 'timeTodaySended':	//今日发送时长
						minTime = dayjs( (dayjs().format('YYYY-MM-DD '))+' 00:00:00' ).valueOf();
						_url += '&minCreateTime=' + minTime + '&couponType=3';
						break;
					case 'timeHoursSended':	//24小时发送时长
						minTime = dayjs().valueOf()-86400000;
						_url += '&minCreateTime=' + minTime + '&couponType=3';
						break;
					case 'timesTodaySended':	//今日发送次数
						minTime = dayjs( (dayjs().format('YYYY-MM-DD '))+' 00:00:00' ).valueOf();
						_url += '&minCreateTime=' + minTime + '&couponType=1';
						break;
					case 'timesHoursSended':	//24小时发送次数
						minTime = dayjs().valueOf()-86400000;
						_url += '&minCreateTime=' + minTime + '&couponType=1';
						break;
				}
				uni.navigateTo({
					url: _url
				})
			},
			onDelete(){
				uni.showModal({
					title:'提示',
					content:'确定删除吗？',
					success: async (r) => {
						if(r.confirm){
							var id = this.userinfo.id
							var res = await this.$u.api.employerDeleteStaff_delete(id)
							if(res.code == 10002){
								this.$u.toast(res.message)
								setTimeout(()=>{
									uni.navigateBack()
								},1000)
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.deleteButton{
		width: 686rpx;
		height: 100rpx;
		border-radius: 16rpx;
		border: 2rpx solid #488cf5;
		position: absolute;
		left: 32rpx;
		bottom: 44rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #488cf5;
		line-height: 100rpx;
		text-align: center;
	}
	.userBox {
		width: 750rpx;
		height: 366rpx;
		background: #FFFFFF;
		margin-top: 32rpx;
	
		>image {
			width: 136rpx;
			height: 136rpx;
			margin: 40rpx 20rpx 0 42rpx;
			border-radius: 50%;
		}
	}
	.name {
		height: 40rpx;
		font-size: 40rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #323233;
		line-height: 40rpx;
		margin-top: 68rpx;
	}
	
	.id {
		height: 20rpx;
		font-size: 20rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(50, 50, 51, 0.3);
		line-height: 20rpx;
		margin-top: 20rpx;
	}
	.TotalBox {
		@extend .RemarksBox;
		margin-top: 24rpx;
	}
	.RemarksBox {
		width: 750rpx;
		height: 100rpx;
		background: #FFFFFF;
	
		.left {
			display: inline-block;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #323233;
			line-height: 44rpx;
			margin: 28rpx 0 0 24rpx;
		}
	
		.right {
			@extend .left;
			margin: 28rpx 0 0 360rpx;
			color: rgba(50, 50, 51, 0.5);
		}
	
		.right_image {
			width: 32rpx;
			height: 32rpx;
			margin: 34rpx 0 0 16rpx;
		}
		.u-flex-c {
			display: flex;
			flex-direction: column;
		}

		.u-flex-r {
			display: flex;
		}
		.navigator {
			float: left;
		}
	}
</style>
