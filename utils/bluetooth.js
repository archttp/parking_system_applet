export const getServiceIdAndCharacteristicId = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceServices({
			deviceId,
			success: ({
				services
			}) => {
				if (services && services.length > 0) {
					const serviceId = services[0].uuid;
					uni.getBLEDeviceCharacteristics({
						deviceId,
						serviceId,
						success: ({
							characteristics
						}) => {
							if (characteristics && characteristics.length > 0) {
								const characteristicId = characteristics[0].uuid;
								resolve({
									code: 200,
									serviceId,
									characteristicId
								})
							}
						},
						fail: (err) => {
							console.error("获取设备特征值失败", err);
							reject({
								code: 0,
								errMsg: err
							})
						}
					});
				}
			},
			fail: (err) => {
				console.error("获取设备服务失败", err);
				reject({
					code: 0,
					errMsg: err
				})
			}
		});
	})
}

export const sendDataToDevice = (serviceId, characteristicId, deviceId) => {
	return new Promise(async (resolve, reject) => {
		const sendData = "01035AA55AA5F1BD";
		const byteArray = hexStringToUint8Array(sendData);
		const res = await writeBLECharacteristicValue(byteArray, serviceId, characteristicId,
			deviceId);
		resolve(res)
	})
}
const writeBLECharacteristicValue = (data, serviceId, characteristicId, deviceId) => {
	return new Promise((resolve, reject) => {
		uni.writeBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			value: data.buffer,
			success: () => {
				resolve({
					code: 200,
					status: true
				});
			},
			fail: (err) => {
				resolve({
					code: 0,
					status: false,
					errMsg: err.errMsg
				});
			}
		});
	});
}
const hexStringToUint8Array = (hexString) => {
	const length = hexString.length / 2;
	const result = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		const byte = parseInt(hexString.substr(i * 2, 2), 16);
		result[i] = byte;
	}
	return result;
}