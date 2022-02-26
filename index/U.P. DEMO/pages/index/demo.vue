<template>
  <page>
    <view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$vRoute.path">byebye</view>
    </view>
  </page>
</template>

<script>
export default {
  data() {
    return {}
  },
  onReady() {
    this.$prompt.modal(
      { title: "加载中", desc: "请稍后..." },
      {
        isPass: true,
        setTime: 10,
        setFn: this.fn3,
        lineColor: "#000",
        btn: [
          { key: "Delete", style: { color: "#999" }, fn: this.fn1 },
          { key: "Cancel", fn: this.fn1, time: 30 },
        ],
      }
    )
  },
  methods: {
    goto() {
      this.$vRoute.path("/page/index/p1")
    },
  },
}
</script>

<style></style>
