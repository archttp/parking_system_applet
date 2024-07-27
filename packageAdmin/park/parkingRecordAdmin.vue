<template>
	<view>
		<view class="searchBox">
			<view class="uni-list-cell-db">展示搜索</view>
			<switch @change='switchChange' :checked='switchChecked' style="margin-left: 20rpx;" />
		</view>
		<uni-popup ref="popup" background-color="#fff" @change='popupChange'>
			<view class="example-body">
				<uni-section title="支付方式" type="line">
					<uni-data-select
						v-model="queryForm.paymentAgencyShortName"
						:localdata="paymentAgencyList"
						@change="paymentAgencyChange"
					></uni-data-select>
				</uni-section>
			</view>
			<view class="example-body">
				<uni-section title="车辆类型" type="line">
					<uni-data-select
						v-model="queryForm.carType"
						:localdata="carTypeList"
					></uni-data-select>
				</uni-section>
			</view>
			<div class="example-info">
				在场车辆：<switch @change='carInParkChange' :checked='carInPark' style="margin-left: 20rpx;" />
				无入时间：<switch @change='noInTimeChange' :checked='noInTime' style="margin-left: 20rpx;" />
			</div>
			<div class="example-info">
				僵尸车辆：<switch @change='longTimeParkingChange' :checked='longTimeParking' style="margin-left: 20rpx;" />
			</div>
			<div class="example-info">车牌号</div>
			<view class="example-body">
				<input type="text" v-model="queryForm.numberPlate" placeholder="请输入车牌号"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<div class="example-info">入场时间</div>
			<view class="example-body">
				<uni-datetime-picker v-model="inTime" type="datetimerange" rangeSeparator="至" />
			</view>
			<div class="example-info">出场时间</div>
			<view class="example-body">
				<uni-datetime-picker v-model="outTime" type="datetimerange" rangeSeparator="至" />
			</view>
			<button type="primary" style="margin: 30rpx 0 50rpx 20rpx;width: 710rpx;" @click="onSearch">确认</button>
		</uni-popup>
		<uni-table :stripe="true" emptyText="暂无更多数据">
			<uni-tr>
				<uni-th align="center" width="128" class="a">车牌号</uni-th>
				<uni-th align="center" width="180">入场时间</uni-th>
				<uni-th align="center" width="180">出场时间</uni-th>
				<uni-th align="center" width="180">时长</uni-th>
				<uni-th align="center" width="90">费用</uni-th>
				<uni-th align="center" width="140">车辆类型</uni-th>
				<uni-th align="center" width="140">支付方式</uni-th>
				<uni-th align="center" width="140">家庭组</uni-th>
				<uni-th align="center" width="140">车主</uni-th>
				<uni-th align="center" width="140">车位号</uni-th>
			</uni-tr>
			<uni-tr v-for="item,index of list" :key='item.id'>
				<uni-td align="center">{{item.numberPlate}}</uni-td>
				<uni-td align="center">{{getTimeText(item.inTime)}}</uni-td>
				<uni-td align="center">{{getTimeText(item.outTime)}}</uni-td>
				<uni-td align="center">{{getTimeDifference(item.inTime,item.outTime)}}</uni-td>
				<uni-td align="center">{{item.amountsPayable}}</uni-td>
				<uni-td align="center">{{item.carTypeName}}</uni-td>
				<uni-td align="center">{{item.paymentAgencyName}}</uni-td>
				<uni-td align="center">{{item.homeGroup}}</uni-td>
				<uni-td align="center">{{item.visitUnit}}</uni-td>
				<uni-td align="center">{{item.parkingSpaceNumber}}</uni-td>
			</uni-tr>
		</uni-table>
	</view>
</template>

<script>
	import {
		handleFilterParams,
		zh_timeFormat,
		formatTimestamp,
		timeDifference
	} from '../../utils/index.js'
	import {
		cfAdminCarParkUseLogGet,
		getPaymentAgencyListByQuery,
		cfAdminCarParkList,
		cfAdminCarTypeList,
	} from '../../network/api.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				list: [],
				paymentAgencyList: [],
				carTypeList: [],
				range: '',
				inTime: [],
				outTime: [],
				numberPlate: '',
				switchChecked: false,
				stopGetUseLog: false,	//是否停止拉取数据，用户下滑拉取数据时，如果没有新数据返回，禁止拉取
				carInPark: false,	//是否搜索在场车辆
				noInTime: false,	//是否搜索无入场记录车辆
				longTimeParking: false,	//是否搜索僵尸车车辆
				queryForm: {
					page: 1,
					size: 20,
					numberPlate: null,
					carParkId: null,
					paymentAgencyShortName: null,
					carType: null,
					inTime: null,
					outTime: null,
					minInTime: null,
					maxInTime: null,
					minOutTime: null,
					maxOutTime: null,
					payTime: null,
				}
			}
		},
		onLoad(e) {
			this.queryForm.carParkId = e.carParkId
			this.getCarTypeList()
			this.getPaymentAgencyList()
			this.getList()
		},
		methods: {
			switchChange(e) {
				if (e.detail.value) {
					this.$refs.popup.open('bottom')
				} else {
					this.$refs.popup.close()
				}
			},
			carInParkChange(e) {
				this.carInPark = e.detail.value
			},
			noInTimeChange(e) {
				this.noInTime = e.detail.value
			},
			longTimeParkingChange(e) {
				this.longTimeParking = e.detail.value
			},
			onSearch() {
				this.stopGetUseLog = false
				this.list = []
				this.queryForm.page = 1
				this.getList()
				this.$refs.popup.close()
			},
			popupChange(e) {
				console.log(e);
				if (e.show) {
					this.switchChecked = true
				} else {
					this.switchChecked = false
				}
			},
			async getList() {
				if(this.stopGetUseLog){
					return
				}
				uni.showLoading({
					title: '加载中',
					icon: 'none'
				})
				if (this.inTime.length > 0) {
					this.queryForm.minInTime = dayjs(this.inTime[0]).valueOf()
					this.queryForm.maxInTime = dayjs(this.inTime[1]).valueOf()
				}else{
					this.queryForm.minInTime = null
					this.queryForm.maxInTime = null
				}

				if (this.outTime.length > 0) {
					this.queryForm.minOutTime = dayjs(this.outTime[0]).valueOf()
					this.queryForm.maxOutTime = dayjs(this.outTime[1]).valueOf()
				}else{
					this.queryForm.minOutTime = null
					this.queryForm.maxOutTime = null
				}

				if(!this.queryForm.numberPlate){
					this.queryForm.numberPlate = null
				}
				if(!this.queryForm.carParkId){
					this.queryForm.carParkId = null
				}
				if(!this.queryForm.paymentAgencyShortName){
					this.queryForm.paymentAgencyShortName = null
				}
				if(!this.queryForm.carType){
					this.queryForm.carType = null
				}
				if(this.queryForm.inTime===null){
					this.queryForm.inTime = null
				}
				if(!this.queryForm.outTime===null){
					this.queryForm.outTime = null
				}
				if(!this.queryForm.payTime===null){
					this.queryForm.payTime = null
				}
				if(this.carInPark){
					this.queryForm.payTime = 0
				}else{
					this.queryForm.outTime = null
				}
				if(this.noInTime){
					this.queryForm.inTime = 0
				}else{
					this.queryForm.inTime = null
				}
				if(this.longTimeParking){
					//查询该停车场信息
					const {
						data,
						code
					} = await cfAdminCarParkList({
						id: this.queryForm.carParkId,
						fields: 'stranded_vehicles_defined_time',
						page: 1,
						size: 1
					})
					if(code==10002){
						console.log('查询到停车场信息',dayjs().valueOf())
						this.queryForm.minInTime = 1
						this.queryForm.payTime = 0
						this.queryForm.maxInTime = dayjs().valueOf()-data[0].strandedVehiclesDefinedTime
					}else{
						if(!this.carInPark){
							this.queryForm.minInTime = null
							this.queryForm.payTime = null
						}
						this.queryForm.maxInTime = null
					}
				}else{
					if(!this.noInTime){
						this.queryForm.minInTime = null
						this.queryForm.payTime = null
					}
					this.queryForm.maxInTime = null
				}
				let newQueryForm = {};
				let keys = Object.keys(this.queryForm);
				keys.forEach((key) => {
					if(this.queryForm[key]!==null){
						newQueryForm[key] = this.queryForm[key]
					}
				});
				const {
					data,
					code
				} = await cfAdminCarParkUseLogGet(newQueryForm)
				
				uni.hideLoading()
				if(!data || data.length<this.queryForm.size){
					this.stopGetUseLog = true
				}
				if (code == 10002) {
					this.list = this.list.concat(data)
					this.queryForm.page = this.queryForm.page + 1
					for (let index = 0; index < data.length; index++) {
						this.carTypeList.forEach(carType => {
							if(carType.flagKey==data[index].carType){
								data[index]['carTypeName'] = carType.name
							}
						});
						this.paymentAgencyList.forEach(paymentAgencyment => {
							if(paymentAgencyment.paymentAgencyName==data[index].paymentAgencyShortName){
								data[index]['paymentAgencyName'] = paymentAgencyment.name
							}
						});
					}
				}

			},
			async getPaymentAgencyList(){
				const {
					data,
					code
				} = await getPaymentAgencyListByQuery({
					page: 1,
					size: 200
				})
				for (let index = 0; index < data.length; index++) {
					data[index]['value'] = data[index].paymentAgencyName
					data[index]['text'] = data[index].name
				}
				this.paymentAgencyList = data;
			},
			async getCarTypeList(){
				const {
					data,
					code
				} = await cfAdminCarTypeList({
					page: 1,
					size: 200
				})
				for (let index = 0; index < data.length; index++) {
					data[index]['value'] = data[index].flagKey
					data[index]['text'] = data[index].name
				}
				this.carTypeList = data;
			},
			timeFormat(e) {
				return zh_timeFormat(e)
			},
			getTimeText(time, type) {
				return formatTimestamp(time)
			},
			getTimeDifference(inTime, outTime) {
				return timeDifference(inTime, outTime)
			},
			paymentAgencyChange(paymentAgency){
				
			}
		},
		onReachBottom() {
			this.getList()
		}
	}
</script>

<style lang="scss">
	.example-body {
		width: 670rpx;
		margin-left: 40rpx;
	}

	.example-info {
		margin: 20rpx 0 10rpx 40rpx;
	}
	.searchBox{
		display: flex;
		align-items: center;
		.uni-list-cell-db{
			margin-left: 40rpx;
		}
	}
</style>
