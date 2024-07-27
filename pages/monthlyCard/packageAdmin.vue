<template>
	<view>
		<view class="searchBox">
			<view class="uni-list-cell-db">展示搜索</view>
			<switch @change='switchChange' :checked='switchChecked' style="margin-left: 20rpx;" />
			<button @click="showDrawer('showLeft')"><text class="word-btn-white">新增</text></button>
		</view>
		<uni-popup ref="popup" background-color="#fff" @change='popupChange'>
			<view class="example-info">
				<uni-section title="状态" type="line">
					<uni-data-select
						v-model="queryForm.status"
						:localdata="statusList"
					></uni-data-select>
				</uni-section>
			</view>
			<view class="example-info">
				<uni-section title="车辆类型" type="line">
					<uni-data-select
						v-model="queryForm.carType"
						:localdata="carTypeList"
					></uni-data-select>
				</uni-section>
			</view>
			<view class="example-info">
				<uni-section title="套餐产品" type="line">
					<uni-data-select
						v-model="packageProductId"
						:localdata="packageProductList"
					></uni-data-select>
				</uni-section>
			</view>
			<view class="example-info">
				车牌号
				<input type="text" v-model="queryForm.numberPlate" placeholder="请输入车牌号"
				style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<view class="example-info">
				家庭组
				<input type="text" v-model="queryForm.groupFlag" placeholder="请输入家庭组"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<view class="example-info">
				手机号
				<input type="text" v-model="queryForm.phone" placeholder="请输入手机号"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<view class="example-info">
				车主名
				<input type="text" v-model="queryForm.carOwnerName" placeholder="请输入车主姓名"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<view class="example-info">
				房间号
				<input type="text" v-model="queryForm.roomNo" placeholder="请输入房间号"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
			</view>
			<div class="example-info">开始时间</div>
			<view class="example-body">
				<uni-datetime-picker v-model="startTime" type="datetimerange" rangeSeparator="至" />
			</view>
			<div class="example-info">结束时间</div>
			<view class="example-body">
				<uni-datetime-picker v-model="endTime" type="datetimerange" rangeSeparator="至" />
			</view>
			<button type="primary" style="margin: 30rpx 0 50rpx 20rpx;width: 710rpx;" @click="onSearch">确认</button>
		</uni-popup>
		<uni-table :stripe="true" emptyText="暂无更多数据">
			<uni-tr>
				<uni-th align="center" width="128" class="a">车牌号</uni-th>
				<uni-th align="center" width="180">开始时间</uni-th>
				<uni-th align="center" width="180">结束时间</uni-th>
				<uni-th align="center" width="140">车辆类型</uni-th>
				<uni-th align="center" width="140">手机号</uni-th>
				<uni-th align="center" width="140">家庭组</uni-th>
				<uni-th align="center" width="140">车主</uni-th>
				<uni-th align="center" width="140">车位号</uni-th>
				<uni-th align="center" width="140">房间号</uni-th>
			</uni-tr>
			<uni-tr @longpress="modifyLog(item)" v-for="item,index of list" :key='item.id'>
				<uni-td align="center">{{item.numberPlate}}</uni-td>
				<uni-td align="center">{{getTimeText(item.startTime)}}</uni-td>
				<uni-td align="center">{{getTimeText(item.endTime)}}</uni-td>
				<uni-td align="center">{{item.carTypeName}}</uni-td>
				<uni-td align="center">{{item.phone}}</uni-td>
				<uni-td align="center">{{item.homeGroup}}</uni-td>
				<uni-td align="center">{{item.visitUnit}}</uni-td>
				<uni-td align="center">{{item.parkingSpaceNumber}}</uni-td>
				<uni-td align="center">{{item.roomNo}}</uni-td>
			</uni-tr>
		</uni-table>
		<uni-drawer ref="showLeft" mode="left" width="400">
			<view class="close">
				<button @click="closeDrawer('showLeft')"><text class="word-btn-white">关闭</text></button>
				<button v-show="currentPackage" @click="deletePackage()"><text class="word-btn-white" style="color: red;">删除-{{ currentPackage.numberPlate }}-的套餐</text></button>
				<view class="example-info-form">
					<uni-section title="状态" type="line">
						<uni-data-select
							v-model="formData.status"
							:localdata="statusList"
						></uni-data-select>
					</uni-section>
				</view>
				<!-- <view class="example-info-form">
					<uni-section title="车辆类型" type="line">
						<uni-data-select
							v-model="formData.typeKey"
							:localdata="carTypeList"
						></uni-data-select>
					</uni-section>
				</view> -->
				<view class="example-info-form">
					<uni-section title="套餐产品" type="line">
						<uni-data-select
							v-model="formData.packageProductId"
							:localdata="packageProductList"
						></uni-data-select>
					</uni-section>
				</view>
				<view class="example-info-form">
					车牌号
					<input type="text" v-model="formData.numberPlate" placeholder="请输入车牌号"
					style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					手机号
					<input type="text" v-model="formData.phone" placeholder="请输入手机号"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					家庭组
					<input type="text" v-model="formData.groupFlag" placeholder="请输入家庭组"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					车主名
					<input type="text" v-model="formData.carOwnerName" placeholder="请输入车主姓名"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					房间号
					<input type="text" v-model="formData.roomNo" placeholder="请输入房间号"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					车位号
					<input type="text" v-model="formData.parkingSpaceNumber" placeholder="请输入车位号"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-info-form">
					备注
					<input type="text" v-model="formData.remarks" placeholder="请输入备注"
						style="padding-left:20rpx;border: 1rpx solid #dcdfe6;height: 80rpx;" class="numberPlateInput" />
				</view>
				<view class="example-body">
					<uni-datetime-picker v-model="startEndTime" type="datetimerange" rangeSeparator="至" />
				</view>
				<button type="primary" style="margin: 30rpx 0 50rpx 20rpx;width: 348px !important;" @click="submit">提交</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		zh_timeFormat,
		formatTimestamp,
		timeDifference
	} from '../../utils/index.js'
	import {
		cfAdminCarParkPackageList,
		cfAdminCarTypeList,
		adminDeleteCarParkPackage,
		cfAdminPackageProductList,
		cfAdminAddCarParkPackage,
		cfAdminUpdateCarParkPackage,
	} from '../../network/api.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				currentPackage: null,
				list: [],
				statusList: [
					{value: 0, text: '禁用'},
					{value: 1, text: '正常'},
					{value: 2, text: '停用'}
				],
				expiredStatusList: [
					{value: 0, text: '已过期'},
					{value: 1, text: '7天内到期'}
				],
				packageProductList: [],
				carTypeList: [],
				range: '',
				startTime: [],
				endTime: [],
				startEndTime: [],
				numberPlate: '',
				switchChecked: false,
				stopGetUseLog: false,	//是否停止拉取数据，用户下滑拉取数据时，如果没有新数据返回，禁止拉取
				expiredStatus: null,	//过期状态
				queryForm: {
					page: 1,
					size: 20,
					numberPlate: null,
					carParkId: null,
					status: null,
					carType: null,
					startTime: null,
					endTime: null,
					minStartTime: null,
					maxStartTime: null,
					minEndTime: null,
					maxEndTime: null,
					groupFlag: null,
					phone: null,
					carOwnerName: null,
					roomNo: null,
				},
				formData: {
					id: 1,
					carParkId: null,
					typeKey: null,
					startTime: null,
					endTime: null,
					numberPlate: null,
					phone: null,
					packageProductId: null,
					carOwnerName: null,
					groupFlag: null,
					parkingSpaceNumber: null,
					roomNo: null,
					status: null,
					remarks: null
				}
			}
		},
		onLoad(e) {
			this.queryForm.carParkId = e.carParkId
			this.getCarTypeList()
			this.getList()
			this.getPackageProductList()
		},
		methods: {
			deletePackage(){
				uni.showModal({
					title: '您确认要删除么？',
					content: '删除后，无法恢复，请谨慎操作',
					success: async ({
						confirm
					}) => {
						if (confirm) {
							const deleteResult = await adminDeleteCarParkPackage(this.currentPackage.id)
							console.log('deleteResult', deleteResult)
							if (deleteResult.code === 10002) {
								this.$refs['showLeft'].close();
								this.stopGetUseLog = false;
								this.queryForm.page = 1;
								this.list = [];
								this.getList();
								this.currentPackage = null;
							} else {
								uni.showToast({
									title: deleteResult.message,
									icon: 'none'
								})
							}
						}else{
							this.stopGetUseLog = false;
							this.queryForm.page = 1;
							this.list = [];
							this.getList()
						}
					}
				})
			},
			modifyLog(e){
				this.currentPackage = e
				this.$refs['showLeft'].open()
				let keys = Object.keys(this.formData);
				keys.forEach((key) => {
					this.formData[key] = e[key]
				});
				this.startEndTime[0] = this.getTimeText(this.formData.startTime);
				this.startEndTime[1] = this.getTimeText(this.formData.endTime);
			},
			closeDrawer(e){
				this.$refs[e].close()
			},
			showDrawer(e){
				this.$refs[e].open()
				this.formData.id = null
			},
			switchChange(e) {
				if (e.detail.value) {
					this.$refs.popup.open('bottom')
				} else {
					this.$refs.popup.close()
				}
			},
			onSearch() {
				this.stopGetUseLog = false
				this.list = []
				this.queryForm.page = 1
				this.getList()
				this.$refs.popup.close()
			},
			popupChange(e) {
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
				if (this.startTime.length > 0) {
					this.queryForm.minStartTime = dayjs(this.startTime[0]).valueOf()
					this.queryForm.maxStartTime = dayjs(this.startTime[1]).valueOf()
				}else{
					this.queryForm.minStartTime = null
					this.queryForm.maxStartTime = null
				}

				if (this.endTime.length > 0) {
					this.queryForm.minEndTime = dayjs(this.endTime[0]).valueOf()
					this.queryForm.maxEndTime = dayjs(this.endTime[1]).valueOf()
				}else{
					this.queryForm.minEndTime = null
					this.queryForm.maxEndTime = null
				}

				if(!this.queryForm.numberPlate){
					this.queryForm.numberPlate = null
				}
				if(!this.queryForm.carParkId){
					this.queryForm.carParkId = null
				}
				if(!this.queryForm.carType){
					this.queryForm.carType = null
				}
				if(this.queryForm.startTime===null){
					this.queryForm.startTime = null
				}
				if(!this.queryForm.endTime===null){
					this.queryForm.endTime = null
				}
				if(this.expiredStatus===0){
					this.queryForm.maxEndTime = dayjs().valueOf()
				}else if(this.expiredStatus===1){
					this.queryForm.minEndTime = dayjs().valueOf()
					this.queryForm.maxEndTime = dayjs().valueOf()+604800000
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
				} = await cfAdminCarParkPackageList(newQueryForm)
				
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
					}
				}

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
			async getPackageProductList(){
				const {
					data,
					code
				} = await cfAdminPackageProductList({
					page: 1,
					size: 200,
					carParkId: this.queryForm.carParkId
				})
				if(code===10002){
					for (let index = 0; index < data.length; index++) {
						data[index]['value'] = data[index].id
						data[index]['text'] = data[index].title
					}
					this.packageProductList = data;
				}else{
					this.packageProductList = [];
				}
				
			},
			async submit(){
				this.formData.carParkId = this.queryForm.carParkId;
				if (this.startEndTime.length > 0) {
					this.formData.startTime = dayjs(this.startEndTime[0]).valueOf()
					this.formData.endTime = dayjs(this.startEndTime[1]).valueOf()
				}else{
					this.formData.startTime = null
					this.formData.endTime = null
				}
				let newFormData = {};
				let keys = Object.keys(this.formData);
				keys.forEach((key) => {
					if(this.formData[key]!==null){
						newFormData[key] = this.formData[key]
					}
				});
				if(this.formData.id==null){
					const {
						data,
						code,
						message,
						mixMessage
					} = await cfAdminAddCarParkPackage(newFormData)
					if(code===10002){
						this.$refs['showLeft'].close()
						this.stopGetUseLog = false;
						this.queryForm.page = 1;
						this.list = [];
						this.getList();

						keys.forEach((key) => {
							this.formData[key] = null;
						});
					}else{
						uni.showToast({
							title: message,
							icon: 'none',
							content: mixMessage
						})
					}
				}else{
					const {
						data,
						code,
						message,
						mixMessage
					} = await cfAdminUpdateCarParkPackage(newFormData)
					if(code===10002){
						this.$refs['showLeft'].close()
						this.stopGetUseLog = false;
						this.queryForm.page = 1;
						this.list = [];
						this.getList();

						keys.forEach((key) => {
							this.formData[key] = null;
						});
					}else{
						uni.showToast({
							title: message,
							icon: 'none',
							content: mixMessage
						})
					}
				}
				
				
			},
			timeFormat(e) {
				return zh_timeFormat(e)
			},
			getTimeText(time, type) {
				return formatTimestamp(time)
			},
			getTimeDifference(startTime, endTime) {
				return timeDifference(startTime, endTime)
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
		margin: 20rpx 0 10rpx 20rpx;
		display: inline-block;
		width: 118px;
	}
	.example-info-form {
		margin: 20rpx 0 10rpx 20rpx;
		display: inline-block;
		width: 145px;
	}
	.searchBox {
		display: flex;
		align-items: center;
		.uni-list-cell-db{
			margin-left: 40rpx;
		}
	}

	.numberPlateInput {
		width: 117px;
    	display: inline-flex;
	}

	.uni-select__input-placeholder {
		font-size: 17px !important;
	}
	.uni-section {
		width: 131px !important;
	}
	.uni-date {
		width: 97% !important;
	}
</style>
