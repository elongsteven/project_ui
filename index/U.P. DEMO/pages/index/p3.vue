<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to p4</view>
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
      this.$_router.path("/pages/index/p4")
    },
  },
}
</script>

<style></style>
