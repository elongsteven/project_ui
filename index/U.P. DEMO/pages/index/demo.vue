<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">byebye</view>
      <tester>12212112</tester>
    </view>
  </basic>
</template>

<script>
import Tester from "@/component/demotest/demotest.vue"
export default {
  components: { Tester },
  data() {
    return {}
  },
  onReady() {
    this.$prompt.modal(
      { title: "加载中", desc: "请稍后..." },
      {
        isPass: true,
        setTime: 30,
        setFn: this.fn3,
        lineColor: "#fff",
        btn: [
          { key: "Delete", style: { color: "#999" }, fn: this.fn1 },
          { key: "Cancel", fn: this.fn1, time: 10 },
        ],
      }
    )
  },
  methods: {
    goto() {
      this.$vRoute.path("/pages/index/p1", {
        fn: function () {
          for (var i = 0; i < 16000; i++) {
            console.log(i)
          }
        },
      })
    },
  },
}
</script>

<style></style>
