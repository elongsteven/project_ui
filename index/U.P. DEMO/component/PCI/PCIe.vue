<template>
  <view>
    <!-- <nav-top><slot name="navtop"></slot></nav-top> -->
    <!-- 用户视图 -->
    <slot name="page"></slot>
    <prompt><slot name="pop"></slot></prompt>
  </view>
</template>

<script>
import Prompt from "@/component/PCI/public/prompt.vue"
export default {
  name: "basic",
  components: { Prompt },
  created() {
    console.log(161231564)
  },
  data() {
    return {
      FIRST: true,
    }
  },
  mounted() {
    console.log("mounted", getCurrentPages()[getCurrentPages().length - 1].route)
    // let pages = getCurrentPages()[getCurrentPages().length - 1].route
    // this.$vRoute.set(pages, "created")
  },
}
</script>

<style scoped></style>
