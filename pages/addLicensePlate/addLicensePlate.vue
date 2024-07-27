<template>
  <view>
    <view class="ocrBox">
      <view class="center flex flex-col-center flex-row-center">
        <image class="icon" src="../../static/images/calendar-check@2x.png"></image>
        <view class="text">导入行驶证自动填写</view>
      </view>
    </view>
    <view class="SubjectBox bb">
      <headerTitle title="手动输入"/>
      <view class="flex flex-row-between bb" style="padding: 0 32rpx;margin-top: 48rpx;"
            @click="plateShow = true">
        <view class="inputItem">{{ plateNoArr[0] }}</view>
        <view class="inputItem">{{ plateNoArr[1] }}</view>
        <view class="inputItem">{{ plateNoArr[2] }}</view>
        <view class="inputItem">{{ plateNoArr[3] }}</view>
        <view class="inputItem">{{ plateNoArr[4] }}</view>
        <view class="inputItem">{{ plateNoArr[5] }}</view>
        <view class="inputItem">{{ plateNoArr[6] }}</view>
        <view :class="plateNoArr.length > 7 ? 'inputItem' : 'inputItem_end'">
          {{ plateNoArr.length > 7 ? plateNoArr[7] : '新能源' }}
        </view>
      </view>
      <view class="popupButton" @click="onAddLicensePlate">
        添加车牌
      </view>
    </view>
    <plate-input v-if="plateShow" :plate="plateNo" @close="plateShow=false" @export="setPlate"></plate-input>
  </view>
</template>

<script>
import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
import headerTitle from '../../components/headerTitle.vue'
import {cfCarParkCarAdd} from '../../network/api.js'

export default {
  components: {
    headerTitle,
    plateInput
  },
  computed: {
    plateNoArr() {
      return this.plateNo.split('')
    }
  },
  data() {
    return {
      plateShow: false,
      plateNo: '',
    }
  },
  methods: {
    async onAddLicensePlate() {
      if (!this.plateNo) {
        uni.showToast({
          title: '请输入车牌',
          icon: 'none'
        })
        return
      }
      const {
        data,
        code,
        message
      } = await cfCarParkCarAdd({
        numberPlate: this.plateNo,
        uid: uni.getStorageSync('user').id
      })
      console.log(data, code);
      if (code == 10002) {
        uni.showToast({
          title: '操作成功',
          icon: 'success'
        })
        setTimeout(function () {
          uni.navigateBack()
        }, 1500);
      } else {
        uni.showToast({
          title: message,
          icon: 'none'
        })
      }
    },
    setPlate(e) {
      console.log(e);
      this.plateNo = e;
      this.plateShow = false;
    }
  }
}
</script>

<style lang="scss">
page {
  background: #F5F7FF;
}

.SubjectBox {
  width: 686rpx;
  height: 496rpx;
  background: #FFFFFF;
  margin: 24rpx 0 0 32rpx;
  overflow: hidden;
}

.inputItem {
  width: 64rpx;
  height: 64rpx;
  border-radius: 8rpx;
  border: 2rpx solid #6794F6;
  font-size: 36rpx;
  font-weight: 600;
  color: #323233;
  line-height: 64rpx;
  text-align: center;
}

.inputItem_end {
  @extend .inputItem;
  font-size: 16rpx;

  font-weight: 400;
  color: #A4A4A4;
}

.popupButton {
  width: 622rpx;
  height: 100rpx;
  background: #6794F6;
  border-radius: 10rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
  line-height: 100rpx;
  text-align: center;
  margin-top: 128rpx;
  margin-left: 32rpx;
}

.ocrBox {
  width: 686rpx;
  height: 164rpx;
  background: #FFFFFF;
  border-radius: 10rpx;
  margin: 38rpx 0 0 32rpx;
  overflow: hidden;

  .center {
    width: 626rpx;
    height: 100rpx;
    background: rgba(103, 148, 246, .21);
    border-radius: 10rpx;
    margin: 32rpx 0 0 30rpx;

    .icon {
      width: 48rpx;
      height: 48rpx;
    }

    .text {
      height: 50rpx;
      font-size: 36rpx;
      font-weight: 600;
      color: #6794F6;
      margin-left: 16rpx;
    }
  }
}
</style>