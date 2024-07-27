// 微信小程序后台配置域名白名单
// request
// https://v0.yiketianqi.com 天气api
// https://apis.map.qq.com 腾讯地图api
// https://v3.cfeng.wang 接口api
// socket wss://wss.cfeng.wang;
// uploadFile https://v3.cfeng.wang;
// webView https://v3.cfeng.wang;

// 才风智慧
const cfeng = {
	apiHost: "https://v3.cfeng.wang",	//服务器请求地址
	wsURL: "wss://wss.cfeng.wang",	//websocket请求地址
	//appid
	aliappid: "",	//支付宝小程序 appid
	wxappid: "",	//微信小程序 appid
	qqmapKey: "",	//腾讯地图 key
	//天气
	weatherURL: "",	//天气预报数据请求地址
	tianQiAppid: "",	//天气接口 appid （申请地址：https://yiketianqi.com/）
	tianQiAppsecret: "",	//天气接口 密钥 （申请地址：https://yiketianqi.com/）
	//广告
	homeWxMpAdId: "adunit-940a0c9ec83f48e8",	//微信小程序首页广告id                    (请提供 插屏广告位id)
	parkingFeeWxMpAdId: "adunit-45c6226173a656b5",	//微信小程序【停车缴费】页面广告id     (请提供 banner广告位id)
	orderCompletedWxMpAdId: "adunit-45c6226173a656b5",	//微信小程序【完成账单】页面广告id (请提供 banner广告位id)
	orderDetailWxMpAdId: "adunit-45c6226173a656b5",	//微信小程序【账单详情】页面广告id     (请提供 banner广告位id)
	getCouponWxMpAdId: "adunit-940a0c9ec83f48e8",	//微信小程序【领取优惠券】页面广告id   (请提供 插屏广告位id)
	//运营商id
	operatorsId: "",	//请运营商登录自己的小程序，个人中心，点击复制自己的用户id，配置此，你小程序只会显示你名下的所有 停车场/充电/小区
	//二维码底部文字
	logoText: "",
	//二维码中间logo
	qrcodeIconPath: "",
}

export default cfeng