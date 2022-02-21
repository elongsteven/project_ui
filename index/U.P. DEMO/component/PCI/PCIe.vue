<template>
  <view>
    <slot></slot>
    <prompt />
  </view>
</template>

<script>
import Prompt from "@/component/PCI/public/prompt.vue"
export default {
  name: "page",
  components: { Prompt },
}
</script>

<style scoped></style>
