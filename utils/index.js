import dayjs from 'dayjs'

export function formatTimestamp(timestamp) {
	if (!timestamp || timestamp === '0') return '暂无数据'
	else return dayjs(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss')
}

// 时间格式化
export const zh_timeFormat = (dateTime = null, fmt = 'yyyy-mm-dd') => {
	// 如果为null,则格式化当前时间
	if (!dateTime) dateTime = Number(new Date())
	// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
	if (dateTime.toString().length == 10) dateTime *= 1000
	let date = new Date(dateTime)
	let ret
	let opt = {
		'y+': date.getFullYear().toString(), // 年
		'm+': (date.getMonth() + 1).toString(), // 月
		'd+': date.getDate().toString(), // 日
		'h+': date.getHours().toString(), // 时
		'M+': date.getMinutes().toString(), // 分
		's+': date.getSeconds().toString(), // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}
	for (let k in opt) {
		ret = new RegExp('(' + k + ')').exec(fmt)
		if (ret) {
			fmt = fmt.replace(
				ret[1],
				ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
			)
		}
	}
	return fmt
}

// 计算两个时间的时间差 转成字符串形式
export const $getTimeDifference = (inTime, outTime) => {
	if (inTime == 0 || outTime == 0) {
		return '-'
	}
	//di作为一个变量传进来
	//如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
	var dateBegin = new Date(inTime) //将-转化为/，使用new Date
	var dateEnd = new Date(outTime) //获取当前时间
	var dateDiff = dateEnd.getTime() - dateBegin.getTime() //时间差的毫秒数
	var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出相差天数
	var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000)
	// hours += dayDiff * 24;
	var dealWith = function(nums) {
		if (nums < 10) {
			return '0' + nums
		} else {
			return nums
		}
	}
	// console.log([dayDiff, hours, minutes, seconds]);
	if (dayDiff.toString() == 'NaN') {
		return '-'
	} else {
		return (
			dealWith(dayDiff) +
			'天' +
			dealWith(hours) +
			'时' +
			dealWith(minutes) +
			'分' +
			dealWith(seconds) +
			'秒'
		)
	}
}

// 计算两个时间差
export function timeDifference(inTime, outTime) {
	if(outTime==0 || inTime==0){
		return '-';
	}
	const newInTime = Number(inTime)
	const newOutTime = Number(outTime)
	const diff = newOutTime - newInTime;
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);
	return `${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

export const showModal = (content) => {
	uni.showModal({
		title: '提示',
		content
	})
}

//将本地文件转为base64
export const getBase64FromLocalAsync = (imgUrl) => {
    return new Promise((resolve, reject) => {
      uni.getFileSystemManager().readFile({
        filePath: imgUrl,
        encoding: "base64",
        success: res => {
          resolve('data:image/png;base64,' + res.data)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

//将远程文件转为base64
export const getBase64FromNetAsync = (imgUrl) => {
return new Promise(resolve => {
	uni.request({
	url: this.addOssToken(imgUrl),
	method: 'GET',
	responseType: 'arraybuffer', 
	success: res => {
		let base64 = uni.arrayBufferToBase64(res.data)
		base64 && (base64 = 'data:image/jpeg;base64,' + base64)
		resolve(base64)
	},
	fail: () => resolve('')
	})
})
}
