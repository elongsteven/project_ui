<template>
  <view>
    <!-- 用户视图 -->
    <slot></slot>
    <prompt />
  </view>
</template>

<script>
import Prompt from "@/component/PCI/public/prompt.vue"
export default {
  name: "page",
  components: { Prompt },
  data() {
    return {
      FIRST: true,
    }
  },
  created() {
    console.log("getCurrentPages", getCurrentPages()[getCurrentPages().length - 1].route)
    // let pages = getCurrentPages()[getCurrentPages().length - 1].route
    // this.$vRoute.set(pages, "created")
  },
  watch: {
    $route: function (from, to) {console.log(from, to)
      // console.log("getCurrentPages", getCurrentPages()[getCurrentPages().length - 1].route)
      // this.$vRoute.change(from, to)
    },
  },
}
</script>

<style scoped></style>
