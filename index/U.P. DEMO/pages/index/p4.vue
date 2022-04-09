<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to p5</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$storageSync.remove('_FLOATER_')">清除悬浮窗定位</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$print($_router.alive())">$_router.alive()</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-danger" @click="$print($_router.getPre())">$_router.getPre()</view>
    </view>
  </basic>
</template>

<script>
export default {
  data() {
    return {}
  },
  onReady() {
    console.log(this.$_router)
  },
  methods: {
    goto() {
      this.$_router.path("/pages/index/p5")
    },
  },
}
</script>

<style></style>
