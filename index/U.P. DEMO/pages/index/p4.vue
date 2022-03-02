<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">byebye</view>
    </view>
  </basic>
</template>

<script>
export default {
  data() {
    return {}
  },
  onReady() {},
  methods: {
    goto() {
      this.$vRoute.path("/pages/index/p5")
    },
  },
}
</script>

<style></style>
