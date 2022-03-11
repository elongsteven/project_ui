<template>
  <!-- 'left:' + moveX + 'px;top:' + moveY + 'px;'    -->
  <view @touchstart="gotElem" @touchmove.prevent="dragging" @touchend="fixed" class="u-ps-f u-z-ultra" :style="{ left: moveX + 'px', top: moveY + 'px', width: size[0] + 'px', height: size[1] + 'px', transform: 'translate(-50%,-50%)' }">
    <view class="u-w-100 u-h-100 u-bg-e5e">悬浮钮未完成</view>
  </view>
</template>

<script>
export default {
  name: "floater",
  created() {},
  data() {
    return {
      isFixed: true,
      size: [50, 50],
      safeDist: [20, 20],
      start: [0, 0],
      windowSize: ["", ""],
      moveX: 20,
      moveY: 20,
    }
  },
  created() {
    const { windowWidth, windowHeight } = uni.getSystemInfoSync()
    this.windowSize[0] = windowWidth
    this.windowSize[1] = windowHeight
    this.moveX = this.size[0] / 2 + this.safeDist[0]
    this.moveY = this.size[1] / 2 + this.safeDist[1]
  },
  methods: {
    gotElem: function (event) {
      // 按上去时计算相对于元素的偏移量
      this.start[0] = event.touches[0].clientX - this.moveX
      this.start[1] = event.touches[0].clientY - this.moveY
    },
    dragging: function (event) {
      // 偏移量运算，保证拖动的一瞬间不位移
      let tag = event.touches
      this.moveX = tag[0].clientX - this.start[0]
      this.moveY = tag[0].clientY - this.start[1]
      // 屏幕安全边距
      if (this.moveX < this.size[0] / 2 + this.safeDist[0]) this.moveX = this.size[0] / 2 + this.safeDist[0] // left
      if (this.moveY < this.size[1] / 2 + this.safeDist[1]) this.moveY = this.size[1] / 2 + this.safeDist[1] // top
      if (this.moveX > this.windowSize[0] - this.size[0] / 2 - this.safeDist[0]) this.moveX = this.windowSize[0] - this.size[0] / 2 - this.safeDist[0] // right
      if (this.moveY > this.windowSize[1] - this.size[1] / 2 - this.safeDist[1]) this.moveY = this.windowSize[1] - this.size[1] / 2 - this.safeDist[1] // bottom
    },
    fixed: function () {
      if (!this.isFixed) return false // 松手时自动定位
      if (this.moveX > this.windowSize[0] / 2) this.moveX = this.windowSize[0] - this.size[0] / 2 - this.safeDist[0]
      else this.moveX = this.size[0] / 2 + this.safeDist[0]
      console.log()
    },
  },
}
</script>

<style scoped></style>
