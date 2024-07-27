<template>
	<view>
		<view v-if="list.length == 0" style="margin-top: 300rpx;width: 750rpx;text-align: center;opacity: .7;">没有数据</view>
		<view v-if="list.length > 0">
			<view class="mySetMeal por flex-col" v-for="item in list" :key='item.shopId'>
				<view
					style="height: 44rpx;font-size: 38rpx;font-weight: 500;color: #323233;line-height: 44rpx;margin: 38rpx 0 0 40rpx;">
					{{item.shopName}}
				</view>
				<view class="flex" style="margin-top: 12rpx;">
					<view
						style="opacity: .7;font-size: 28rpx;font-weight: 500;color: #323233;line-height: 40rpx;margin-left: 40rpx;">
						支付笔数：{{item.payCounts}}
					</view>
				</view>
				<view class="flex" style="margin-top: 12rpx;">
					<view
						style="opacity: .7;font-size: 28rpx;font-weight: 500;color: #323233;line-height: 40rpx;margin-left: 40rpx;">
						收款金额：{{item.amountActuallyPaid}}
					</view>
				</view>
				
				<view class="applyButton" @click="onRenew(item)">查看详情</view>
				<!-- <image src="http://file.cfeng.wang/Renew.png" class="poa"
					style="width: 220rpx;height: 108rpx;right: 0;bottom: 0;" @click="onRenew(item)"></image> -->
				<!-- 装饰图片 -->
				<image src="../../static/images/zs.png" class="zs poa"></image>
			</view>
		</view>
		
		<!-- <view class="monthlyCardButton flex flex-row-center flex-col-center"
			@click="intoAdd">
			<image mode="aspectFit" src="../../static/images/VIP@2x.png"
				style="width: 50rpx; height: 48rpx">
			</image>
			<view class="text">创建车场</view>
		</view> -->
		<uni-popup ref="popup">
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
		</uni-popup>
	</view>
</template>

<script>
	import { getChargingStoredCardListByQuery,rechargingChargingStoredCard, deleteChargingStoredCard, getDailyIncomeStatisticsListByQuery } from '../../network/api.js'
	import { formatTimestamp } from '../../utils/index.js'
	import { wxAppid, aliAppid } from '../../common/config.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				list:[],
				applyInfo:{
					
				},
				priceValue:'',
				CommonlyUsedFunctionsArr: [ {
						icon: 'swap@2x',
						label: '停车记录',
					},{
						icon: 'car@2x',
						label: '车辆套餐',
					},
					{
						icon: 'parkinglot@2x',
						label: '设备控制',
					},
					{
						icon: 'setting@2x',
						label: '车场配置',
					}
				],
			}
		},
		filters:{formatTimestamp},
		onLoad(e) {
			this.getList()
			if(e.storedCardId && e.storedCardId>0){
				//说明是充值
				this.judgeRechage(e.storedCardId)
			}
		},
		mounted() {
			let that = this;
			uni.$on('getList', function(data) {
				that.getList();
			})
		},
		onUnload() {
			uni.$off('getList'); // 移除监听事件 
		},
		methods: {
			onRenew(e){
				this.applyInfo = e
				this.$refs.popup.open('bottom');
			},
			onDeleteRenew(e){
				this.applyInfo = e
			},
			async onDelete(){
				const {
					code,
					message
				} = await deleteChargingStoredCard(this.applyInfo.id)
				if (code === 10002) {
					this.closeDeletePopup()
					this.getList()
				} else {
					uni.showToast({
						title: message,
						icon: 'none'
					})
				}
			},
			onCommonlyUsedFunction(index) {
				const pages = [
					'/pages/parkingRecords/parkingRecordAdmin',
					'/pages/monthlyCard/packageAdmin',
					'/pages/chargeDetail/order',
					'/pages/myCar/myCar'
				];
				// if (index == this.CommonlyUsedFunctionsArr.length - 1) {
				// 	this.onScan()
				// 	return
				// }
				if (index >= 0 && index < pages.length) {
					if(index>1){
						uni.showToast({
							title: '老王熬夜加班开发中...ing',
							icon: 'none'
						})
						return;
					}
					uni.navigateTo({
						url: pages[index]+'?carParkId='+this.applyInfo.shopId
					});
				} else {
					console.log("Invalid index");
				}
			},
			async onApply(){
				let _platform = 'ali_mp';
				let _appid = aliAppid;
				// #ifdef MP-WEIXIN
				_platform = 'wx_mp';
				_appid = wxAppid;
				// #endif
				const { data, code } = await rechargingChargingStoredCard({
					platform:_platform,
					rechargeAmount:this.priceValue,
					id:this.applyInfo.id,
					appid:_appid
				})
				console.log(data);
				// #ifdef MP-WEIXIN
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					success: res => {
						console.log(res)
						if (res.errMsg == 'requestPayment:ok') {
							uni.showToast({
								title: '支付成功',
								icon: 'none'
							})
							this.getList()
							this.closePopup()
						}
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
						uni.showToast({
							title: '支付已取消',
							icon: 'none'
						})
					}
				});
				// #endif

				// #ifdef MP-ALIPAY
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: data.alipay_trade_create_response.trade_no,
						success: function(res) {
							if (res.resultCode == '9000') {
								uni.showToast({
									title: '支付成功',
									icon: 'none'
								})
								setTimeout(function() {
									uni.switchTab({
										url: '/packageMy/my/my'
									})
								}, 1500);
							} else {
								uni.showToast({
									title: res.memo,
									icon: 'none'
								})
							}
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
				});
				// #endif
			},
			closePopup() {
				this.$refs.popup.close()
			},
			intoAdd(){
				uni.navigateTo({
					url:'/packageMy/my/applyChargingStoredValueCard'
				})
			},
			async getList(){
				const { data, code } = await getDailyIncomeStatisticsListByQuery({
					minStartTime: dayjs().startOf('day').valueOf(),
    				maxEndTime: dayjs().endOf('day').valueOf(),
					goodsTypes: 0,
					statisticalModel: 'statistical_model_sum_day',
					paymentAgencyShortName: '',
					orderByDesc: 'amount_actually_paid',
					minShopId: 1,
					countAll: false,
					page: 1,
					size: 200
				})
				if(code === 10002){
					this.list = data
				}else{
					this.list = []
				}
			},
			async judgeRechage(storedCardId){
				const { data, code } = await getChargingStoredCardListByQuery({
					page:1,
					size:1,
					id:storedCardId
				})
				if(code === 10002){
					this.onRenew(data[0])
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		padding-top: 36rpx;
	}
	.applyButton{
		width: 140rpx;height: 80rpx;right: 26rpx;bottom: 26rpx;
		position: absolute;
		line-height: 80rpx;
		border-radius: 10rpx;
		color: #fff;
		text-align: center;
		background-color: #6794f6;
	}
	.applyButtonDelete{
		width: 96rpx;height: 80rpx;right: 126rpx;bottom: 26rpx;
		position: absolute;
		line-height: 80rpx;
		border-radius: 10rpx;
		color: #fff;
		text-align: center;
		background-color: #f44336;
	}
	.nextButton {
		width: 586rpx;
		height: 100rpx;
		background: #6794F6;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.87);
		line-height: 100rpx;
		text-align: center;
		margin: 26rpx 0 0 50rpx;
	}
	.deleteButton {
		width: 586rpx;
		height: 100rpx;
		background: #f44336;
		border-radius: 10rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.87);
		line-height: 100rpx;
		text-align: center;
		margin: 26rpx 0 0 50rpx;
	}
	.flex-wrap{
		width: 686rpx;
		height: 740rpx;
		background: #FFFFFF;
	}
	.popupBox2 {
		width: 686rpx;
		height: 384rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-left: 32rpx;
		overflow: hidden;
	
		.text1 {
			width: 252rpx;
			height: 50rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #323233;
			line-height: 50rpx;
			margin: 64rpx 0 0 34rpx;
		}
	
		.text2 {
			width: 500rpx;
			height: 50rpx;
			font-size: 28rpx;
			font-weight: 600;
			color: #f44336;
			line-height: 50rpx;
			margin: 64rpx 0 0 34rpx;
		}
	
		.intoOrder {
			width: 620rpx;
			height: 100rpx;
			background: #488CF5;
			border-radius: 16rpx;
			margin-top: 48rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 100rpx;
			text-align: center;
			margin-left: 33rpx;
		}
	}
	.mySetMeal {

		width: 670rpx;
		height: 328rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 22rpx 0rpx rgba(151, 151, 151, 0.2);
		border-radius: 16rpx;
		margin: 0rpx 0 32rpx 40rpx;

		.zs {
			width: 176rpx;
			height: 176rpx;
			top: 0;
			right: 0;
		}

		.title1 {
			height: 44rpx;
			font-size: 32rpx;
			
			font-weight: 500;
			color: #323233;
			line-height: 44rpx;
			margin-left: 32rpx;
			margin-top: 32rpx;
		}

		.title2 {
			height: 36rpx;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(50, 50, 51, 0.5);
			line-height: 36rpx;
			margin-left: 32rpx;
			margin-top: 12rpx;
		}

		.upgrade {
			width: 242rpx;
			height: 108rpx;
			margin-left: 8rpx;
			margin-top: 24rpx;
		}
	}
	.monthlyCardButton {
		width: 670rpx;
		height: 96rpx;
		background: #6794f6;
		border-radius: 10rpx;
		position: fixed;
		left: 40rpx;
		bottom: 66rpx;
		.text {
			width: 128rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #ffffff;
			line-height: 44rpx;
			margin-left: 12rpx;
		}
	}
</style>
