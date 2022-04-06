<template>
  <view>
    <!-- <nav-top><slot name="navtop"></slot></nav-top> -->
    <!-- 用户视图 -->
    <slot name="page"></slot>
    <prompt><slot name="pop"></slot></prompt>
    <floater v-if="floater.show"></floater>
  </view>
</template>

<script>
import Prompt from "@/components/PCI/public/prompt/prompt.vue";
import Floater from "@/components/PCI/public/floater/floater.vue";

export default {
  name: "basic",
  components: { Prompt, Floater },
  data() {
    return {
      floater: {
        show: true, // 悬浮按钮 白名单模式
        whiteList: ["demo"]
      }
    };
  },
  mounted() {
    this.$xEvent.off("afterRoute");
    this.$xEvent.on("afterRoute", data => {
      let isHide = this.floater.whiteList.some(function (val) {
        return data.to.url.search(val) > -1;
      }, this);
      if (isHide) this.floater.show = false;
    });
  }
};
</script>

<style scoped></style>
