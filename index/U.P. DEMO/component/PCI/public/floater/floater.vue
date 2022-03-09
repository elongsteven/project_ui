<template>
  <!-- 'left:' + moveX + 'px;top:' + moveY + 'px;'    -->
  <view @touchstart="gotElem" @touchmove.prevent="dragging" class="u-ps-f u-z-ultra" :style="{ left: moveX + 'px', top: moveY + 'px', width: size[0] + 'px', height: size[1] + 'px', transform: 'translate(-50%,-50%)' }">
    <view class="u-w-100 u-h-100 u-bg-e5e">悬浮钮未完成</view>
  </view>
</template>

<script>
export default {
  name: "floater",
  created() {},
  data() {
    return {
      size: [50, 50],
      safeDist: [20, 20],
      start: [0, 0],
      moveX: 20,
      moveY: 20,
      windowWidth: "",
      windowHeight: "",
    }
  },
  created() {
    console.log(uni.getSystemInfoSync())
    const { windowWidth, windowHeight } = uni.getSystemInfoSync()
    this.windowWidth = windowWidth
    this.windowHeight = windowHeight
    console.log(this.windowWidth, this.windowHeight);
    this.moveX = this.size[0] / 2 + this.safeDist[0]
    this.moveY = this.size[1] / 2 + this.safeDist[1]
  },
  methods: {
    gotElem: function (event) {
      // 按上去时计算相对于元素的偏移量
      this.start[0] = event.touches[0].clientX - this.moveX
      this.start[1] = event.touches[0].clientY - this.moveY
    },
    dragging(event) {
      let tag = event.touches
      // if (tag[0].clientX < 20) {
      //   tag[0].clientX = 20
      // }
      // if (tag[0].clientY < 20) {
      //   tag[0].clientY = 20
      // }
      // if (tag[0].clientX > this.windowWidth - 20) {
      //   tag[0].clientX = this.windowWidth - 20
      // }
      // if (tag[0].clientY > this.windowHeight - 20) {
      //   tag[0].clientY = this.windowHeight - 20
      // }
      this.moveX = tag[0].clientX - this.start[0]
      this.moveY = tag[0].clientY - this.start[1]
      if (this.moveX < this.size[0] / 2 + this.safeDist[0]) this.moveX = this.size[0] / 2 + this.safeDist[0]
      if (this.moveY < this.size[1] / 2 + this.safeDist[1]) this.moveY = this.size[1] / 2 + this.safeDist[1]
      if (this.moveX > this.windowWidth - this.size[0] / 2 - this.safeDist[0]) this.moveX = this.windowWidth - this.size[0] / 2 - this.safeDist[0]
      if (this.moveY > this.windowHeight - this.size[1] / 2 - this.safeDist[1]) this.moveY = this.windowHeight - this.size[1] / 2 - this.safeDist[1]
    },
  },
}
</script>

<style scoped></style>
