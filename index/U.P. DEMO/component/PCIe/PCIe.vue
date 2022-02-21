<template>
  <view>
    <slot></slot>
    <prompt />
  </view>
</template>

<script>
import Prompt from "@/component/prompt/prompt.vue"
export default {
  name: "page",
  components: { Prompt },
}
</script>

<style scoped></style>
