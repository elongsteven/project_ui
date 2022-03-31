<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to p3</view>
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
      this.$vRoute.path("/pages/index/p3")
    },
  },
}
</script>

<style></style>
