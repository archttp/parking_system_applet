<template>
	<view>
		<view class="flex flex-col-center" style="margin: 38rpx 0 0 32rpx;">
			<view class="line"></view>
			<view style="margin-left: 10rpx;">{{title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "headerTitle",
		props: ['title'],
		data() {
			return {

			};
		}
	}
</script>

<style>
	.line {
		width: 6rpx;
		height: 32rpx;
		background: #6996F6;
	}
</style>