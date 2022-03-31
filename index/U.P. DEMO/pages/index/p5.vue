<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to index</view>
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
      this.$vRoute.path("/pages/index/index")
    },
  },
}
</script>

<style></style>
