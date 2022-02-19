<template>
  <view class="">
    <button class="u-btn u-bd-e5e">1111</button>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg('hello project-ui', { isPass: true })">msg 弹框</view>
    <view
      class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info"
      @click="
        $prompt.msg('hello project-ui', {
          isPass: true,
          cb: function () {
            $prompt.success('cb')
          },
        })
      "
    >
      msg 弹框 回调
    </view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg('hello project-ui', { time: 0, isPass: true })">不消失的 msg 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg('hello project-ui', { time: 0, isMask: true, isShut: true, isPass: false })">带蒙版的 msg 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.info('info')">info 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$prompt.success('success')">success 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-warning" @click="$prompt.question('question')">question 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$prompt.error('fail')">error 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.status('请稍后...', { isRow: true }, '../../static/await.png')">自定义status 弹框</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.load('加载中...', { time: 0, isPass: true })">load加载层</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="myModal">modal 选择层</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$prompt.hide()">关闭弹出的最后一个</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$prompt.hideAll('ccc')">关闭所有</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg($prompt.getOpt())">获取最后一个的弹窗配置</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg($prompt.getList())">获取当前弹窗ID列表</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="t3">测试 3</view>
    <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-warning" @click="ttt">关闭 2</view>
    <view class="u-h-100vh"></view>
    <view class="u-h-100vh"></view>

    <!-- <view class="u-mask u-ps-f u-ps-full" @touchmove.stop.prevent="function(){}"></view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      popTest: "",
    }
  },
  onLoad() {
    this.myModal()
  },
  methods: {
    myModal() {
      this.$prompt.modal(
        { title: "加载中", desc: "请稍后..." },
        {
          isPass: true,
          setTime: 10,
          setFn: this.fn3,
          lineColor: '#000',
          btn: [
            { key: "Delete", style: { color: "#999" }, fn: this.fn1 },
            { key: "Cancel", fn: this.fn1, time: 30 },
          ],
        }
      )
    },
    t1() {
      console.log(this.$prompt.msg("111", { isPass: true, time: 10000 }))
    },
    t2() {
      this.popTest = this.$prompt.msg("222", { isPass: true, time: 10000 })
    },
    t3() {
      this.$prompt.msg("333", { isPass: true, time: 10000 })
    },
    ttt() {
      this.$prompt.hide(this.popTest)
    },
    test(a) {
      console.log(this.$prompt.getOpt())
    },
    fn1(hide) {
      console.log("aaa")
    },
    fn2(e) {
      console.log("事件2")
    },
    fn3() {
      console.log("第三个事件")
    },
  },
}
</script>

<style>
.faded-enter,
.faded-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.faded-enter-active,
.faded-leave-active {
  transition: all 0.3s ease;
}
</style>
