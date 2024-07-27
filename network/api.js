import $http from './index.js'
// 微信登录
export const wxMpLogin = (data) => $http('/ucenter/cfAuth/getWxBaseUserInfoByCodeAndLoginType', 'GET', data)
// 修改个人资料
export const modifyPersonalInformation = (data) => $http('/ucenter/cfUser/modifyPersonalInformation', 'POST', data)
// 获取个人资料
export const getMyInfo = (data) => $http('/ucenter/cfUser/getMyInfo', 'GET', data)
// 一键获取手机号
export const getUserPhonenumberByCodeAndLoginType = (data) => $http(
	'/ucenter/cfAuth/getUserPhonenumberByCodeAndLoginType', 'GET', data)
// 获取附近的停车场
export const cfCarParkGet = (data) => $http('/internetOfThings/cfCarPark/search', 'GET', data)
// 获取附近的充电站
export const cfChargingStationGet = (data) => $http('/internetOfThings/cfChargingStation/search', 'GET', data)
// 获取停车场详情
export const getCarParkInfoById = (data) => $http('/internetOfThings/cfCarPark/getCarParkInfoById', 'GET', data)
// 获取收费规则
export const getChargingRulesListByQuery = (data) => $http('/internetOfThings/cfCarPark/getChargingRulesListByQuery',
	'GET', data)
// 套餐
export const getCarParkPackageProductListByQuery = (data) => $http(
	'/internetOfThings/cfCarParkPackageProduct/getCarParkPackageProductListByQuery', 'GET', data)
// 获取我的车辆
export const cfCarParkCarGet = (data) => $http('/internetOfThings/cfCarParkCar/getListByQuery', 'GET', data)
// 新增汽车
export const cfCarParkCarAdd = (data) => $http('/internetOfThings/cfCarParkCar/add', 'POST', data)
// 获取指定的套餐
export const getCarParkPackageProductListById = (data) => $http(
	'/internetOfThings/cfCarParkPackageProduct/getCarParkPackageProductListById', 'GET', data)
// 购买套餐
export const buyCarParkPackageProduct = (data) => $http('/internetOfThings/cfCarParkPackage/buyCarParkPackageProduct',
	'POST', data)

// 充电站详情
export const cfChargingStationGetInfoById = (data) => $http(
	'/internetOfThings/cfChargingStation/getInfoById', 'GET', data)
// 充电站收费规则
export const getChargeRulesListByQuery = (data) => $http(
	'/internetOfThings/cfChargingStation/getRulesListByQuery', 'GET', data)
// 查停车记录
export const cfCarParkUseLogGet = (data) => $http(
	'/internetOfThings/cfCarParkUseLog/getListByQuery', 'GET', data)
// 查停车记录
export const cfAdminCarParkUseLogGet = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/getCarParkUseLogListByQuery', 'GET', data)
// 查停车场列表
export const cfAdminCarParkList = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/getListByQuery', 'GET', data)	
// 查车辆类型列表
export const cfAdminCarTypeList = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/getCarTypeListByQuery', 'GET', data)	
// 查车辆套餐列表
export const cfAdminCarParkPackageList = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/getCarParkPackageListByQuery', 'GET', data)
// 添加车辆套餐
export const cfAdminAddCarParkPackage = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/addCarParkPackage', 'POST', data)
// 更新车辆套餐
export const cfAdminUpdateCarParkPackage = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/updateCarParkPackage', 'PUT', data)
//删除停车套餐
export const adminDeleteCarParkPackage = (id) => $http(
	'/internetOfThingsAdmin/cfCarPark/deleteCarParkPackage?ids=' + id, 'DELETE')
// 查车辆套餐产品列表
export const cfAdminPackageProductList = (data) => $http(
	'/internetOfThingsAdmin/cfCarPark/getCarParkPackageProductListByQuery', 'GET', data)
		
export const cfCarParkCarDelete = (id) => $http(
	'/internetOfThings/cfCarParkCar/delete?id=' + id, 'DELETE')
// 停车记录查账单	
export const getCarParkUseLogOrder = (data) => $http(
	'/internetOfThings/cfCarParkUseLog/getCarParkUseLogOrder', 'GET', data)
// 支付停车费
export const payCarParkUseLogOrder = (data) => $http('/internetOfThings/cfCarParkUseLog/payCarParkUseLogOrder',
	'POST', data)
// 钱包账户获取	
export const cfAccountGet = (data) => $http(
	'/pay/cfAccount/getMy', 'GET', data)
// 获取硬件列表
export const cfDeviceGet = (data) => $http(
	'/internetOfThings/cfDevice/getListByQuery', 'GET', data)
// 获取充电口
export const getChargingPortListByQuery = (data) => $http(
	'/internetOfThings/cfChargingStation/getChargingPortListByQuery', 'GET', data)
// 开始充电
export const startChargingApi = (data) => $http('/internetOfThings/cfChargingStation/startCharging', 'POST', data)
// 结束充电
export const stopChargingApi = (data) => $http(
	'/internetOfThings/cfChargingStation/stopCharging', 'GET', data)
// 获取充电记录
export const getChargingUseLogListByQuery = (data) => $http(
	'/internetOfThings/cfChargingStation/getChargingUseLogListByQuery', 'GET', data)
// 获取ws地址
export const getMinChatLinkCountsServiceIp = (data) => $http(
	'/chat/cfUserMessage/getMinChatLinkCountsServiceIp', 'GET', data)
// 通知充电端口发消息
export const getPortRealTimeData = (data) => $http(
	'/internetOfThings/cfChargingStation/getPortRealTimeData', 'GET', data)
// 电卡获取	
export const getChargingStoredCardListByQuery = (data) => $http(
	'/internetOfThings/cfChargingStation/getChargingStoredCardListByQuery', 'GET', data)
//删除充电卡
export const deleteChargingStoredCard = (id) => $http(
	'/internetOfThings/cfChargingStation/deleteChargingStoredCard?id=' + id, 'DELETE')
// 电卡充值
export const rechargingChargingStoredCard = (data) => $http('/internetOfThings/cfChargingStation/rechargingChargingStoredCard', 'POST', data)
//申请电卡
export const applyChargingStoredCard = (data) => $http('/internetOfThings/cfChargingStation/applyChargingStoredCard', 'POST', data)
// 通过关卡获取最新的一个出场
export const getLastCarParkUseLogByCheckPointId = (data) => $http(
	'/internetOfThings/cfCarParkUseLog/getLastCarParkUseLogByCheckPointId', 'GET', data)
// 钱包充值
export const recharge = (data) => $http('/pay/cfAccount/recharge', 'POST', data)
// 获取我的停车套餐
export const getMyCarParkPackageProductListByQuery = (data) => $http(
	'/internetOfThings/cfCarParkPackage/getMyCarParkPackageListByQuery', 'GET', data)
// 获取停车场统计报表
export const getDailyParkingStatistcsListByQuery = (data) => $http(
	'/internetOfThings/cfCarParkPackage/getDailyParkingStatistcsListByQuery', 'GET', data)
export const applyFoPassage = (data) => $http('/internetOfThings/cfCarParkUseLog/applyFoPassage', 'POST', data)
// 获取通道列表
export const cfCheckPointGetListByQuery = (data) => $http(
	'/internetOfThingsAdmin/cfCheckPoint/getListByQuery', 'GET', data)
export const parkingDataReporting = (data) => $http('/internetOfThingsAdmin/cfCheckPoint/parkingDataReporting', 'POST',
	data)
export const getMyOrderList = (data) => $http(
	'/pay/cfOrder/getMyOrderList', 'GET', data)
export const getAliMinBaseUserInfoByCode = (data) => $http(
	'/ucenter/cfAuth/getAliMinBaseUserInfoByCode', 'GET', data)
export const scanLoginQrCode = (data) => $http(
	'/ucenterAdmin/cfAuth/scanLoginQrCode', 'GET', data)
export const qrCodeLoginConfirmation = (data) => $http(
	'/ucenterAdmin/cfAuth/qrCodeLoginConfirmation', 'GET', data)
export const getListByIdAnd = (data) => $http(
	'/ucenter/cfQrCode/getListByIdAnd', 'GET', data)
export const drawCouponByQrCode = (data) => $http(
	'/pay/cfCoupon/drawCouponByQrCode', 'GET', data)
export const getCouponActivityListByQuery = (data) => $http(
	'/pay/cfCoupon/getMyCouponActivity', 'GET', data)
export const rechargeCouponActivity = (data) => $http('/pay/cfCoupon/rechargeCouponActivity', 'POST', data)
export const getCouponActivityStaffLimit = (data) => $http(
	'/pay/cfCoupon/getCouponActivityStaffLimitByQuery', 'GET', data)
export const updateCouponActivityStaffLimit = (data) => $http('/pay/cfCoupon/updateCouponActivityStaffLimit', 'PUT', data)

// 获取优惠券活动员工
export const getCouponActivityStaffListByQuery = (data) => $http('/pay/cfCoupon/getCouponActivityStaffListByQuery', 'GET', data)
export const issueCoupons = (data) => $http('/pay/cfCoupon/issueCoupons', 'POST', data)
export const addCouponActivityStaff = (data) => $http('/pay/cfCoupon/addCouponActivityStaff', 'POST', data)
export const createCouponQrcode = (data) => $http('/pay/cfCoupon/createCouponQrcode', 'POST', data)
export const deleteCouponActivityStaff = (id) => $http(
	'/pay/cfCoupon/deleteCouponActivityStaff?couponActivityStaffId=' + id, 'DELETE')
export const getCouponActivityToDaySum = (data) => $http(
	'/pay/cfCoupon/getCouponActivityToDaySum', 'GET', data)
export const getSendedCouponLog = (data) => $http(
	'/pay/cfCoupon/getSendedCouponLog', 'GET', data)
export const getMyCoupon = (data) => $http(
	'/pay/cfCoupon/getMyCoupon', 'GET', data)
export const getStoredCardListByQuery = (data) => $http(
	'/internetOfThings/cfCarParkCar/getStoredCardListByQuery', 'GET', data)
export const applyStoredCard = (data) => $http('/internetOfThings/cfCarParkCar/applyStoredCard', 'POST', data)	
export const rechargingStoredCard = (data) => $http('/internetOfThings/cfCarParkCar/rechargingStoredCard', 'POST', data)
export const deleteCarParkStoredCard = (id) => $http(
	'/internetOfThings/cfCarParkCar/deleteCarParkStoredCard?id=' + id, 'DELETE')	
export const issuingInvoices = (data) => $http('/pay/cfOrder/issuingInvoices', 'POST', data)

// 获取财务统计报表
export const getDailyIncomeStatisticsListByQuery = (data) => $http(
	'/payAdmin/cfAccount/getDailyIncomeStatisticsListByQuery', 'GET', data)

// 获取支付机构列表
export const getPaymentAgencyListByQuery = (data) => $http(
	'/payAdmin/cfUserPaymentAgency/getPaymentAgencyListByQuery', 'GET', data)
// 获取优惠券类型
export const getCouponActivityCouponTypeList = (data) => $http(
	'/pay/cfCoupon/getCouponActivityCouponTypeListByQuery', 'GET', data)
	
	