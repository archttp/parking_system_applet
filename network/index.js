import {
	baseUrl
} from '../common/config.js'


const $http = (URL, METHOD, DATA) => {
	const token = uni.getStorageSync('token')
	uni.showLoading({
		title: '请求中~'
	})
	return new Promise((r, j) => {
		uni.request({
			url: baseUrl + URL,
			method: METHOD,
			data: DATA,
			header: {
				Authorization: token || '',
			},
			success: (res) => {
				// token 过期等情况
				if (res.data.code == 24002) {
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/authorize/authorize'
					})
				} else {
					r(res.data)
				}
				r(res.data)
			},
			fail: (res) => {
				uni.showToast({
					title: '未知错误',
					icon: 'none'
				})
			},
			complete: () => {
				uni.hideLoading()
			}
		})
	})
}

export default $http