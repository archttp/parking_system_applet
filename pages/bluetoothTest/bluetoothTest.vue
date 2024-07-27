<template>
	<view class="container">
		<button class="btn" @tap="startScan">开始搜索</button>
		<button class="btn" @tap="sendInstructions">开启匝道</button>
		<view class="device-list">
			<view class="device-item" v-for="(device, index) in devices" :key="index">
				<text class="device-name">{{ device.name }}</text>
				<text class="device-id">{{ device.deviceId }}</text>
			</view>
		</view>
	</view>
</template>



<script>
	import {
		getServiceIdAndCharacteristicId,
		sendDataToDevice
	} from '../../utils/bluetooth.js'
	import {
		showModal
	} from '../../utils/index.js'



	export default {
		data() {
			return {
				devices: [],
				deviceId: '',
				connectedDeviceId: '',
				serviceId: '',
				characteristicId: '',
				targetDeviceName: "EC:B1:AC:00:95:B4",
				isConnected: false
			};
		},
		onLoad() {

		},
		methods: {
			startScan() {
				uni.showLoading({
					title: '持续搜索中'
				})
				this.startBluetooth()
			},
			async sendInstructions() {
				const deviceId = this.deviceId
				const {
					serviceId,
					characteristicId
				} = await getServiceIdAndCharacteristicId(deviceId);
				const {
					code
				} = await sendDataToDevice(serviceId, characteristicId, deviceId);
				if (code === 200) {
					showModal('开闸成功')
				}
			},
			startBluetooth() {
				uni.openBluetoothAdapter({
					success: () => {
						this.searchBluetoothDevices();
					},
					fail: (err) => {
						uni.hideLoading()
						console.error("打开蓝牙适配器失败", err);
						if (err.errCode === 10001) {
							showModal('请开启蓝牙')
						} else if (err.errCode === 10000) {
							showModal('设备不支持蓝牙')
						} else {
							showModal('打开蓝牙适配器失败')
						}
					}
				});
			},
			searchBluetoothDevices() {
				uni.startBluetoothDevicesDiscovery({
					success: () => {
						uni.hideLoading()
						uni.onBluetoothDeviceFound((res) => {
							this.devices.push(...res.devices);
							// 在这里判断设备信息并自动连接
							this.autoConnectToDevice();
						});
					},
					fail: (err) => {
						uni.hideLoading()
						console.error("搜索蓝牙设备失败", err);
					}
				});
			},
			autoConnectToDevice() {
				if (this.isConnected) {
					console.log("已经连接到设备，不需要再自动连接");
					return;
				}
				uni.showLoading({
					title: '连接中'
				})
				const targetDevice = this.devices.find(device => device.deviceId === this.targetDeviceName);
				if (targetDevice) {
					uni.createBLEConnection({
						deviceId: targetDevice.deviceId,
						success: async () => {
							console.log("自动连接设备成功");
							uni.showToast({
								title: '成功连接到道闸'
							})
							this.isConnected = true
							this.deviceId = targetDevice.deviceId
							// 停止监听新设备的发现
							await uni.offBluetoothDeviceFound();
							await uni.stopBluetoothDevicesDiscovery();
						},
						fail: (err) => {
							uni.hideLoading()
							console.error('道闸连接失败 请联系岗亭人员开闸');
						}
					});
				}
			}
		}
	};
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.btn {
		margin: 10px;
		padding: 10px 20px;
		background-color: #007aff;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.device-list {
		margin-top: 20px;
		width: 100%;
	}

	.device-item {
		display: flex;
		flex-direction: column;
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}

	.device-name {
		font-size: 16px;
		margin-bottom: 5px;
	}

	.device-id {
		font-size: 12px;
		color: #777;
	}
</style>