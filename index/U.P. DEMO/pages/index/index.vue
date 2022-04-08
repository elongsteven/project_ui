<template>
  <basic>
    <view slot="page">
      <button class="u-btn u-bd-e5e" @click="demo">1111</button>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.msg('hello project-ui', { isPass: true, isBlur: false })">msg 弹框</view>
      <view
        class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info"
        @click="
          $prompt.msg('hello project-ui', {
            isPass: true,
            cb: function () {
              $prompt.success('cb', { isPass: true });
            }
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
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="myModal">modal 交互弹框</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$prompt.mine()">mine 自定义弹窗</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$prompt.hide()">关闭弹出的最后一个</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$prompt.hideAll('ccc')">关闭所有</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-warning" @click="goto">go to DEMO</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-warning" @click="uni.navigateTo({ url: '/pages/index/p4' });">go to P4</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-warning" @click="goto5">go to P5</view>

      <!-- <view class="u-h-100vh"></view> -->
      <!-- <view class="u-h-100vh"></view> -->
      <!-- <view class="u-mask u-ps-f u-ps-full" @touchmove.stop.prevent="function(){}"></view> -->
    </view>
    <view slot="pop" class="u-bg-e5e">563as41635F56d135sd4165as1df53as1df3a5sd4f1563asd41</view>
  </basic>
</template>

<script>
export default {
  data() {
    return {
      popTest: ""
    };
  },
  onReady() {
    // this.myModal()
  },
  methods: {
    demo() {
      this.$prompt.msg("qwerty");
    },
    myModal() {
      console.log(this.$prompt);
      this.$prompt.modal(
        { title: "加载中", desc: "请稍后..." },
        {
          isPass: true,
          setTime: 10,
          setFn: this.fn3,
          lineColor: "#000",
          btn: [
            { key: "Delete", style: { color: "#999" }, fn: this.fn1 },
            { key: "Cancel", fn: this.fn1, time: 30 }
          ]
        }
      );
    },
    goto() {
      uni.navigateTo({ url: "/pages/index/demo" });
      // console.log("route", this.$route)
    },
    goto5() {
      uni.navigateTo({ url: "/pages/index/p5" });
    },
    t1() {
      console.log(this.$prompt.msg("111", { isPass: true, time: 10000 }));
    },
    t2() {
      this.popTest = this.$prompt.msg("222", { isPass: true, time: 10000 });
    },
    t3() {
      this.$prompt.msg("333", { isPass: true, time: 10000 });
    },
    ttt() {
      console.log(this.popTest);
      this.$prompt.hide(this.popTest);
    },
    test(a) {
      console.log(this.$prompt.getOpt());
    },
    fn1(hide) {
      console.log("aaa");
    },
    fn2(e) {
      console.log("事件2");
    },
    fn3() {
      console.log("第三个事件");
    }
  }
};
</script>

<style>
.faded-enter,
.faded-leave-to {
  opacity: 0;
  transform: scale(0.6);
  -webkit-transform: scale(0.6);
}

.faded-enter-active,
.faded-leave-active {
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
}
</style>
