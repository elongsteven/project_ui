<template>
  <view>
    <!-- msg -->
    <transition :name="MSG.ani_m">
      <view v-if="MSG.show">
        <view v-if="!MSG.scroll" class="u-ps-f u-ps-full u-pe-auto" :style="{ zIndex: MSG.Z - 10 }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(MSG)" class="u-ps-f u-ps-full" :class="MSG.pass" :style="MSG.MaskStyle"></view>
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
        <view @click="maskTap(STAT)" class="u-ps-f u-ps-full" :class="STAT.pass" :style="STAT.MaskStyle"></view>
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
        <view @click="maskTap(LOAD)" class="u-ps-f u-ps-full" :class="LOAD.pass" :style="LOAD.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="LOAD.ani_c">
      <view v-if="LOAD.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: LOAD.Z }">
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp u-pe-auto" :class="LOAD.PromptClass" :style="LOAD.PromptStyle">
          <!-- 加载动画 *NEW* -->
          <view class="load-chase" :class="LOAD.LoadClass" :style="{ width: LOAD.LoadSize, height: LOAD.LoadSize }">
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
        <view @click="maskTap(MODAL)" class="u-ps-f u-ps-full" :class="MODAL.pass" :style="MODAL.MaskStyle"></view>
      </view>
    </transition>
    <transition :name="MODAL.ani_c">
      <view v-if="MODAL.show" class="u-ps-f u-ps-full u-pe-none" :style="{ zIndex: MODAL.Z }">
        <view @click.stop class="u-w-70 u-ps-f u-ps-center u-t-break u-radius-8rp u-pd-t-24rp u-pe-auto" :class="MODAL.PromptClass" :style="MODAL.PromptStyle">
          <view class="u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-b-21rp u-flex-d-c">
            <view class="u-w-fit u-mg-b-10rp" :style="MODAL.vtStyle">{{ MODAL.VTitle }}</view>
            <view class="u-w-fit" :style="MODAL.vdStyle">
              {{ MODAL.VDesc }}
              <span v-if="MODAL.setTime > 0" :style="MODAL.timeStyle">&nbsp;({{ MODAL.setTime }})</span>
            </view>
          </view>
          <view class="u-w-100 u-flex u-flex-jc-sb u-flex-ai-c" :style="'border-top:1rpx solid ' + MODAL.lineColor">
            <view v-for="(item, index) in MODAL.btnList" @click="modalEvent(item.fn)" :class="item.time > 0 ? 'btnNone' : ''" class="u-flex-1 u-t-c u-pd-tb-21rp btnLine" :style="item.style" :key="index">
              {{ item.key }}
              <span v-if="item.time > 0" :style="MODAL.timeStyle">&nbsp;({{ item.time }})</span>
            </view>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<script>
export default {
  name: "prompt",
  created() {
    // 弹窗触发总线路
    uni.$on("showPrompt", opts => {
      this.Engine(opts)
    })
    // 弹窗隐藏总线
    uni.$on("hidePrompt", param => {
      this.Hidden(param.type)
    })
  },
  data() {
    return {
      MSG: { show: false },
      STAT: { show: false },
      LOAD: { show: false },
      MODAL: { show: false },
      icon: ["/static/icon/fail.png", "/static/icon/success.png", "/static/icon/info.png", "/static/icon/question.png"],
    }
  },
  methods: {
    Engine(opts) {
      console.log(opts)
      console.log(this.MSG)
      switch (opts.type) {
        case 0:
          this.MSG = opts
          break
        case 1:
          this.STAT = opts
          break
        case 2:
          this.LOAD = opts
          break
        case 3:
          this.MODAL = opts
          break
      }
      console.log(this.MSG)
    },
    // showMsg(txt, opts, index, PT) {
    //   let config = this.Engine(txt, opts, index, PT)
    //   this.MSG = config
    //   console.log(this.MSG)
    // },
    // showStatus(status, txt, opts, index, PT) {
    //   let config = this.Engine(txt, opts, index, PT)
    //   // status 图标附加属性
    //   config.IconStyle = "width:" + (opts.iconWidth || "80rpx") + (opts.iconColor ? ";filter: drop-shadow(100vw 0 " + opts.iconColor + ");right: 100vw" : "") + ";" + (opts.iconStyle || "")
    //   config.IconUrl = status !== undefined ? (typeof status === "number" ? this.icon[status] : status) : null
    //   config.IconClass = "u-mg-8rp" + (opts.iconClass || "")
    //   this.STAT = config
    // },
    // showLoad(txt, opts, index, PT) {
    //   let config = this.Engine(txt, opts, index, PT)
    //   // loading 加载层附加属性
    //   config.LoadClass = "u-mg-24rp" + (opts.loadClass || "")
    //   config.loadColor = opts.loadColor || "#fff"
    //   config.LoadSize = opts.loadSize || "80rpx"
    //   this.LOAD = config
    // },
    // showModal(view, opts, index, PT) {
    //   let config = this.Engine(opts, index, PT)
    //   // modal弹窗 部分配置是独立存在的 与公用的引默认值擎不同
    //   let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
    //   let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
    //   let isBlur = opts.isBlur === undefined ? true : opts.isBlur // 是否打开底层高斯
    //   let Z = parseInt(1000 + Number(index))
    //   config.MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(255,255,255,.86)") : "") // 蒙版样式计算
    //   config.PromptStyle = "box-shadow:" + (opts.shadow || "0 0 8rpx 5rpx rgba(0,0,0,0.2)") + ";z-index:" + Z + ";background:" + (opts.bgColor || "rgba(255,255,255,.86)") + ";color:" + (opts.color || "#333") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
    //   config.PromptClass = (isBlur ? "blurCloud " : "") + (opts.class || "")
    //   // modal弹窗 拓展属性
    //   config.VTitle = view.title || ""
    //   config.vtStyle = opts.vtStyle
    //   config.VDesc = view.desc || "" // 弹窗文字
    //   config.vdStyle = opts.vdStyle
    //   config.btnList = opts.btn
    //   config.setTime = opts.setTime || 0
    //   config.setFn = opts.setFn || undefined
    //   config.setHide = opts.setHide === undefined ? true : opts.setHide // 倒计时结束是否自动关闭
    //   config.lineColor = opts.lineColor
    //   this.MODAL = config
    //   // modal弹窗 拓展功能
    //   this.MODAL.btnList.forEach((item, index) => {
    //     if (item.time > 0) this.timer(index, this.MODAL.id)
    //   })
    //   if (this.MODAL.setTime > 0) this.autoEvent(this.MODAL.id)
    // },
    Hidden(type) {
      console.log(type)
      // 隐藏指定弹框
      switch (type) {
        case 0:
          if (this.MSG.cb) this.MSG.cb()
          // this.MSG = { show: false }
          this.MSG.show = false
          break
        case 1:
          if (this.STAT.cb) this.STAT.cb()
          // this.STAT = { show: false }
          this.STAT.show = false
          break
        case 2:
          if (this.LOAD.cb) this.LOAD.cb()
          // this.LOAD = { show: false }
          this.LOAD.show = false
          break
        case 3:
          if (this.MODAL.cb) this.MODAL.cb()
          // this.MODAL = { show: false }
          this.MODAL.show = false
          break
        case "all":
          if (this.MSG.cb) this.MSG.cb()
          if (this.STAT.cb) this.STAT.cb()
          if (this.LOAD.cb) this.LOAD.cb()
          if (this.MODAL.cb) this.MODAL.cb()
          this.MSG.show = this.STAT.show = this.LOAD.show = this.MODAL.show = false
          break
      }
    },
    /* 内部使用 */
    maskTap(n) {
      // 蒙版功能 点击隐藏
      if (n.isShut && n.show) this.hide({ type: n.type })
    },
    /* Modal 功能拓展坞 */
    modalEvent(fn) {
      /* 支持延时关闭 */
      // let pid = this.MODAL.id
      // if (fn) fn(() => {this.$prompt.hide(pid)})
      // else this.$prompt.hide(pid)
      /* 直接关闭 */
      if (fn && this.MODAL.show) fn()
      this.MODAL = { show: false }
    },
    timer(i, id) {
      setTimeout(() => {
        if (!this.MODAL.show || this.MODAL.id !== id) return false // ID验证，防串线
        this.MODAL.btnList[i].time--
        if (this.MODAL.btnList[i].time > 0) this.timer(i, id)
      }, 1000)
    },
    autoEvent(id) {
      setTimeout(() => {
        if (!this.MODAL.show || this.MODAL.id !== id) return false // ID验证，防串线
        this.MODAL.setTime--
        if (this.MODAL.setTime > 0) this.autoEvent(id)
        else {
          if (this.MODAL.setFn && this.MODAL.show) this.MODAL.setFn()
          this.MODAL = { show: false }
        }
      }, 1000)
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.z-fade-enter-active,
.z-fade-leave-active {
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease;
}
.z-fade-enter,
.z-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
  -webkit-transform: scale(0.7);
}

view,
span {
  color: inherit;
  font-size: inherit;
  z-index: inherit;
}

.prompt0 {
  max-width: 80vw;
}

.blurCloud:before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: -1;
  overflow: hidden;
  backdrop-filter: blur(24rpx);
  border-radius: 8rpx;
  margin: 1rpx;
}

.btnLine {
  transition: all 0.3s ease-out;
  user-select: none;
}

.btnLine:active {
  background: #ccc;
}

.btnLine:nth-child(1) {
  border-left: none !important;
}

.btnNone {
  pointer-events: none;
  filter: opacity(0.6);
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
