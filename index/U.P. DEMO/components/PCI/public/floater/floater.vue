<template>
  <view>
    <view @touchstart="gotElem" @touchmove.prevent="dragging" @touchend="fixed" class="u-ps-f u-z-ultra u-tran--50" :style="{ left: moveX + 'px', top: moveY + 'px', width: size[0] + 'px', height: size[1] + 'px' }">
      <view @click="toggle" class="u-w-100 u-h-100 u-bg-white u-f-b u-radius-50 shadow u-flex u-flex-ai-c u-flex-jc-c u-flex-d-c">
        <view class="u-f-21rp">快捷</view>
        <view class="u-f-21rp">导航</view>
      </view>
      <view v-show="showNav" class="u-pd-tb-20rp u-ps-a u-ps-l50 u-w-80rp u-bg-e5e u-radius-cap u-flex u-flex-d-c u-flex-jc-c u-flex-ai-c u-t-c" :style="topPart ? 'top:0' : 'bottom:0'">
        <view @touchmove.prevent.stop v-for="(item, index) in NavButtons" :key="index" class="u-f-21rp u-pd-tb-10rp u-flex-o-1" style="white-space: pre-line">{{ item }}</view>
        <view @click="showNav = false" class="u-f-21rp" :class="topPart ? 'u-flex-o-0' : 'u-flex-o-15'">关闭</view>
      </view>
    </view>
    <view v-show="showNav" class="u-ps-f u-ps-full" @click="showNav = false"></view>
  </view>
</template>

<script>
export default {
  name: "floater",
  data() {
    return {
      isFixed: true, // 是否自动贴边
      size: [40, 40], // 悬浮窗大小
      skew: [0, 0], // 点击偏移量（私域！
      safeDist: [16, 16], // 屏幕安全边距
      windowSize: ["", ""], // 设备屏幕大小（私域！
      // 实时位置
      moveX: 20,
      moveY: 20,
      showNav: false,
      topPart: false,
      NavButtons: ["一点\n百通", "测一测", "绿色\n商城", "产品\n分类", "购物车", "我的\n上大夫", "转发\n分享"]
    };
  },
  created() {
    const { windowWidth, windowHeight } = uni.getSystemInfoSync();
    this.windowSize[0] = windowWidth;
    this.windowSize[1] = windowHeight;
    this.moveX = this.size[0] / 2 + this.safeDist[0];
    this.moveY = this.size[1] / 2 + this.safeDist[1];
    this.$xEvent.off("afterRoute");
    this.$xEvent.on("afterRoute", () => {
      let FLOATER = this.$storageSync.get("_FLOATER_");
      // this.$print(FLOATER);
      if (FLOATER) {
        this.moveX = FLOATER[0];
        this.moveY = FLOATER[1];
      }
      if (this.moveY < this.windowSize[1] / 2) this.topPart = true;
      else this.topPart = false;
    });
  },
  methods: {
    gotElem: function (event) {
      // 按上去时计算相对于元素的偏移量
      this.skew[0] = event.touches[0].clientX - this.moveX;
      this.skew[1] = event.touches[0].clientY - this.moveY;
    },
    dragging: function (event) {
      // 偏移量运算，保证拖动的一瞬间不位移
      let tag = event.touches;
      this.moveX = tag[0].clientX - this.skew[0];
      this.moveY = tag[0].clientY - this.skew[1];
      // 屏幕安全边距
      if (this.moveX < this.size[0] / 2 + this.safeDist[0]) this.moveX = this.size[0] / 2 + this.safeDist[0]; // left
      if (this.moveY < this.size[1] / 2 + this.safeDist[1]) this.moveY = this.size[1] / 2 + this.safeDist[1]; // top
      if (this.moveX > this.windowSize[0] - this.size[0] / 2 - this.safeDist[0]) this.moveX = this.windowSize[0] - this.size[0] / 2 - this.safeDist[0]; // right
      if (this.moveY > this.windowSize[1] - this.size[1] / 2 - this.safeDist[1]) this.moveY = this.windowSize[1] - this.size[1] / 2 - this.safeDist[1]; // bottom
      if (this.showNav) this.showNav = false;
    },
    fixed: function () {
      if (!this.isFixed) return false; // 自动贴边开关，下方是松手时自动定位
      if (this.moveX > this.windowSize[0] / 2) this.moveX = this.windowSize[0] - this.size[0] / 2 - this.safeDist[0];
      else this.moveX = this.size[0] / 2 + this.safeDist[0];
      if (this.moveY < this.windowSize[1] / 2) this.topPart = true;
      else this.topPart = false;
      this.$storageSync.set("_FLOATER_", [this.moveX, this.moveY]);
      this.$print([this.moveX, this.moveY]);
    },
    toggle() {
      this.showNav = !this.showNav;
    }
  }
};
</script>

<style scoped>
.shadow {
  box-shadow: 0rpx 0rpx 8rpx rgba(0, 0, 0, 0.3);
  opacity: 0.9;
}
.shrink {
  transform: scale(0.9);
}
</style>
