<template>
  <view>
    <!-- msg -->
    <transition :name="MSG.ani_m">
      <view v-if="MSG.show">
        <view v-if="!MSG.scroll" class="u-ps-f u-ps-full u-pe-auto" :style="{ zIndex: MSG.Z - 10 }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(MSG.isShut, MSG.type)" class="u-ps-f u-ps-full" :class="MSG.pass" :style="MSG.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="MSG.ani_c">
      <view v-if="MSG.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: MSG.Z }">
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp u-pe-auto" :class="MSG.PromptClass" :style="MSG.PromptStyle">
          <view class="u-w-fit u-mg-lr-auto">{{ MSG.txt }}</view>
        </view>
      </view>
    </transition>
    <!-- status -->
    <transition :name="STAT.ani_m">
      <view v-if="STAT.show">
        <view v-if="!STAT.scroll" class="u-ps-f u-ps-full u-pe-auto" :style="{ zIndex: STAT.Z - 10 }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(STAT.isShut, STAT.type)" class="u-ps-f u-ps-full" :class="STAT.pass" :style="STAT.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="STAT.ani_c">
      <view v-if="STAT.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: STAT.Z }">
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp u-pe-auto" :class="STAT.PromptClass" :style="STAT.PromptStyle">
          <!-- image+ -->
          <image v-if="STAT.IconUrl" :src="STAT.IconUrl" class="colors u-mg-lr-auto" :class="STAT.IconClass" :style="STAT.IconStyle" mode="widthFix" />
          <view class="u-w-fit u-mg-lr-auto">{{ STAT.txt }}</view>
        </view>
      </view>
    </transition>
    <!-- load -->
    <transition :name="LOAD.ani_m">
      <view v-if="LOAD.show">
        <view v-if="!LOAD.scroll" class="u-ps-f u-ps-full u-pe-auto" :style="{ zIndex: LOAD.Z - 10 }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(LOAD.isShut, LOAD.type)" class="u-ps-f u-ps-full" :class="LOAD.pass" :style="LOAD.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="LOAD.ani_c">
      <view v-if="LOAD.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: LOAD.Z }">
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp u-pe-auto" :class="LOAD.PromptClass" :style="LOAD.PromptStyle">
          <!-- 加载动画 *NEW* -->
          <view class="load-chase" :class="LOAD.LoadClass">
            <view v-for="index of 6" :key="index" class="load-chase-dot" :style="'background:' + LOAD.loadColor"></view>
          </view>
          <view class="u-w-fit u-mg-lr-auto">{{ LOAD.txt }}</view>
        </view>
      </view>
    </transition>
    <!-- modal -->
    <transition :name="MODAL.ani_m">
      <view v-if="MODAL.show">
        <view v-if="!MODAL.scroll" class="u-ps-f u-ps-full u-pe-auto" :style="{ zIndex: MODAL.Z - 10 }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(MODAL.isShut, MODAL.type)" class="u-ps-f u-ps-full" :class="MODAL.pass" :style="MODAL.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="MODAL.ani_c">
      <view v-if="MODAL.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: MODAL.Z }">
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp u-pe-auto" :class="MODAL.PromptClass" :style="MODAL.PromptStyle">
          <view class="u-w-fit u-mg-lr-auto">{{ MODAL.txt }}</view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script>
export default {
  name: "prompt",
  data() {
    return {
      // 0:msg  1:status  2:load  3:modal
      MSG: { show: false },
      STAT: { show: false },
      LOAD: { show: false },
      MODAL: { show: false },
      icon: ["/static/icon/fail.png", "/static/icon/success.png", "/static/icon/info.png", "/static/icon/question.png"],
    }
  },
  methods: {
    // 默认配置引擎  default: 不穿透 无蒙版 可滑动 无点击蒙版关闭
    Engine(txt, opts, index) {
      let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
      let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
      let Z = parseInt(1000 + Number(index))
      console.log((isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : ""))
      let MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : "") // 蒙版样式计算
      let PromptStyle = "z-index:" + Z + ";background:" + (opts.bgColor || "rgba(0,0,0,.6)") + ";color:" + (opts.color || "#fff") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
      return {
        id: index, // ID
        show: true,
        type: 0,
        pass: isPass ? "u-pe-none" : "u-pe-auto",
        scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
        isShut: opts.isShut === undefined ? false : opts.isShut, // 是否点击蒙版关闭
        ani_m: opts.ani_m === undefined ? "fade" : opts.ani_m,
        ani_c: opts.ani_c === undefined ? "z-fade" : opts.ani_c,
        txt: txt || "", // 弹窗文字
        PromptClass: opts.class || "",
        MaskStyle,
        PromptStyle,
        Z,
        cb: opts.cb,
      }
    },
    showMsg(txt, opts, index) {
      let config = this.Engine(txt, opts, index)
      this.MSG = config
    },
    showStatus(status, txt, opts, index) {
      let config = this.Engine(txt, opts, index)
      config.PromptClass = (opts.isRow ? "u-flex-d-r" : "u-flex-d-c") + " " + (opts.class || "")
      config.IconStyle = "width:" + (opts.iconWidth || "80rpx") + (opts.iconColor ? ";filter: drop-shadow(100vw 0 " + opts.iconColor + ");right: 100vw;" : "")
      config.IconUrl = status !== undefined ? (typeof status === "number" ? this.icon[status] : status) : null
      config.IconClass = "u-mg-8rp" + (opts.IconClass || "")
      this.STAT = config
    },
    showLoad(txt, opts, index) {
      let config = this.Engine(txt, opts, index)
      config.PromptClass = (opts.isRow ? "u-flex-d-r" : "u-flex-d-c") + " " + (opts.class || "")
      config.LoadClass = "u-mg-24rp" + (opts.loadClass || "")
      config.loadColor = opts.loadColor || "#fff"
      config.LoadWidth = opts.LoadWidth || "80rpx"
      this.LOAD = config
    },
    showModal(txt, opts, index) {
      let config = this.Engine(txt, opts, index)
      this.MODAL = config
    },
    hide(obj) {
      switch (obj.type) {
        case 0:
          if (this.MSG.cb) this.MSG.cb()
          this.MSG = { show: false }
          break
        case 1:
          if (this.STAT.cb) this.STAT.cb()
          this.STAT = { show: false }
          break
        case 2:
          if (this.LOAD.cb) this.LOAD.cb()
          this.LOAD = { show: false }
          break
        case 3:
          if (this.MODAL.cb) this.MODAL.cb()
          this.MODAL = { show: false }
          break
      }
    },
    hideAll() {
      this.MSG.show = this.STAT.show = this.LOAD.show = this.MODAL.show = false
    },
    maskTap(a, type) {
      console.log(a, type)
      if (!a) return false
      this.hide({ type })
    },
  },
}
</script>

<style scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.z-fade-enter,
.z-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.z-fade-enter-active,
.z-fade-leave-active {
  transition: all 0.3s ease;
}

view {
  color: inherit;
  font-size: inherit;
  z-index: inherit;
}

.prompt0 {
  max-width: 80vw;
}

.colors {
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

/* 加载层样式 */

.load-chase {
  width: 40px;
  height: 40px;
  position: relative;
  animation: load-chase 2.5s infinite linear both;
}

.load-chase-dot {
  position: absolute;
  left: 0;
  top: 0;
  animation: load-chase-dot 2s infinite ease both;
  width: 18%;
  height: 18%;
  transform-origin: 277.778% 277.778%;
  background-color: #fff;
  border-radius: 100%;
}

.load-chase-dot:nth-child(1) {
  opacity: 1;
  animation-delay: -1.1s;
}

.load-chase-dot:nth-child(2) {
  opacity: 0.88;
  animation-delay: -1s;
}

.load-chase-dot:nth-child(3) {
  opacity: 0.76;
  animation-delay: -0.9s;
}

.load-chase-dot:nth-child(4) {
  opacity: 0.64;
  animation-delay: -0.8s;
}

.load-chase-dot:nth-child(5) {
  opacity: 0.52;
  animation-delay: -0.7s;
}

.load-chase-dot:nth-child(6) {
  opacity: 0.4;
  animation-delay: -0.6s;
}

@keyframes load-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes load-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}
</style>
