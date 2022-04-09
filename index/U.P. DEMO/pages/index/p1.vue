<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to p2</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$print($xEvent.list)">getList</view>
    </view>
  </basic>
</template>

<script>
export default {
  data() {
    return {};
  },
  onReady() {},
  onLoad(options) {
    console.log(options);
  },
  methods: {
    goto() {
      this.$_router.path("/pages/index/p2");
    }
  }
};
</script>

<style></style>
