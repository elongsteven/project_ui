<template>
  <view></view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
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
  methods: {},
}
</script>

<style></style>
