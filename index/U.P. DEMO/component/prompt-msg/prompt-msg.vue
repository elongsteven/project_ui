<template>
  <view>
    <transition-group name="fade">
      <view v-for="prompt in promptList" :key="prompt.id">
        <view v-if="!prompt.scroll" class="u-ps-f u-ps-full" :style="{ zIndex: prompt.Z }" @touchmove.stop.prevent="() => {}"></view>
        <view @click="maskTap(prompt.tapHide, prompt.id)" class="u-ps-f u-ps-full" :style="prompt.MaskStyle"></view>
        <view @click.stop class="prompt0 u-ps-f u-ps-center u-flex u-flex-jc-c u-flex-ai-c u-pd-lr-18rp u-pd-tb-15rp u-t-break u-radius-8rp" :class="prompt.PromptClass" :style="prompt.PromptStyle">
          <view v-if="prompt.type === 1">
            <image v-if="prompt.IconUrl" :src="prompt.IconUrl" class="colors u-mg-lr-auto" :class="prompt.IconClass" :style="prompt.IconStyle" mode="widthFix" />
          </view>
          <view v-if="prompt.type === 2">
            <view class="load-chase" :class="prompt.LoadClass">
              <view v-for="index of 6" :key="index" class="load-chase-dot" :style="'background:' + prompt.loadColor"></view>
            </view>
          </view>
          <view class="u-w-fit u-mg-lr-auto">{{ prompt.txt }}</view>
        </view>
      </view>
    </transition-group>
  </view>
</template>

<script>
export default {
  name: "prompt",
  data() {
    return {
      promptList: [],
      optsList: [],
      icon: ["/static/icon/fail.png", "/static/icon/success.png", "/static/icon/info.png", "/static/icon/question.png"],
    }
  },
  methods: {
    // $prompt.msg  default: 不穿透 无蒙版 可滑动 不关闭
    showMsg(txt, opts, index) {
      this.pushOpt(opts, index)
      let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
      let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
      let Z = parseInt(1000 + Number(index))
      let MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : "") // 蒙版样式计算
      let PromptStyle = "z-index:" + Z + ";background:" + (opts.bgColor || "rgba(0,0,0,.6)") + ";color:" + (opts.color || "#fff") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
      let prompt = {
        id: index, // ID
        scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
        isShut: opts.tapHide === undefined ? false : opts.tapHide, // 是否点击蒙版关闭
        type: 0, // 弹窗类型
        txt: txt || "", // 弹窗文字
        PromptClass: opts.class || "",
        MaskStyle,
        PromptStyle,
        Z,
        cb: opts.cb,
      }
      this.promptList.push(prompt) // 弹窗注册
    },
    // $prompt.status  default: 不穿透 无蒙版 可滑动 不关闭
    showStatus(status, txt, opts, index) {
      let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
      let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
      let Z = parseInt(1000 + Number(index))
      let MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : "") // 蒙版样式计算
      let PromptStyle = "z-index:" + Z + ";background:" + (opts.bgColor || "rgba(0,0,0,.6)") + ";color:" + (opts.color || "#fff") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
      let PromptClass = (opts.isRow ? "u-flex-d-r" : "u-flex-d-c") + " " + (opts.class || "")
      let IconStyle = "width:" + (opts.iconWidth || "80rpx") + (opts.iconColor ? ";filter: drop-shadow(100vw 0 " + opts.iconColor + ");right: 100vw;" : "")
      let IconUrl = status !== undefined ? (typeof status === "number" ? this.icon[status] : status) : null
      let IconClass = "u-mg-8rp" + (opts.IconClass || "")
      let prompt = {
        id: index, // ID
        scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
        isShut: opts.tapHide === undefined ? false : opts.tapHide, // 是否点击蒙版关闭
        type: 1, // 弹窗类型
        txt: txt || "", // 弹窗文字
        PromptClass,
        MaskStyle,
        PromptStyle,
        IconStyle,
        IconUrl,
        IconClass,
        Z,
        cb: opts.cb,
      }
      this.promptList.push(prompt) // 弹窗注册
    },
    // $prompt.load  default: 不穿透 无蒙版 可滑动 不关闭
    showLoad(txt, opts, index) {
      let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
      let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
      let Z = parseInt(1000 + Number(index))
      let MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : "") // 蒙版样式计算
      let PromptStyle = "z-index:" + Z + ";background:" + (opts.bgColor || "rgba(0,0,0,.6)") + ";color:" + (opts.color || "#fff") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
      let PromptClass = (opts.isRow ? "u-flex-d-r" : "u-flex-d-c") + " " + (opts.class || "")
      let LoadClass = "u-mg-24rp" + (opts.loadClass || "")
      let prompt = {
        id: index, // ID
        scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
        isShut: opts.tapHide === undefined ? false : opts.tapHide, // 是否点击蒙版关闭
        type: 2, // 弹窗类型
        txt: txt || "", // 弹窗文字
        loadColor: opts.loadColor || "#fff",
        LoadWidth: opts.LoadWidth || "80rpx",
        LoadClass,
        PromptClass,
        MaskStyle,
        PromptStyle,
        Z,
        cb: opts.cb,
      }
      this.promptList.push(prompt) // 弹窗注册
    },
    // $prompt.modal  default: 不穿透 无蒙版 可滑动 不关闭
    showModal(txt, opts, index) {
      let isPass = opts.isPass === undefined ? false : opts.isPass // 是否允许穿透
      let isMask = opts.isMask === undefined ? false : opts.isMask // 是否打开蒙板
      let Z = parseInt(1000 + Number(index))
      let MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : "") // 蒙版样式计算
      let PromptStyle = "z-index:" + Z + ";background:" + (opts.bgColor || "rgba(0,0,0,.6)") + ";color:" + (opts.color || "#fff") + ";fontSize:" + (opts.fontSize || "30rpx") + ";" + (opts.style || "") // 弹窗样式计算
      let PromptClass = (opts.isRow ? "u-flex-d-r" : "u-flex-d-c") + " " + (opts.class || "")
      let LoadClass = "u-mg-24rp" + (opts.loadClass || "")
      let prompt = {
        id: index, // ID
        scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
        isShut: opts.tapHide === undefined ? false : opts.tapHide, // 是否点击蒙版关闭
        type: 2, // 弹窗类型
        txt: txt || "", // 弹窗文字
        loadColor: opts.loadColor || "#fff",
        LoadWidth: opts.LoadWidth || "80rpx",
        LoadClass,
        PromptClass,
        MaskStyle,
        PromptStyle,
        Z,
        cb: opts.cb,
      }
      this.promptList.push(prompt) // 弹窗注册
    },
    Engine() {},
    hide(id) {
      var that = this
      this.promptList.forEach((ele, index) => {
        if (ele.id === id) {
          if (ele.cb) ele.cb(id)
          that.promptList.splice(index, 1)
        }
      })
    },
    hideAll() {
      this.promptList = []
    },
    maskTap(a, id) {
      if (!a) return false
      this.hide(id)
    },
    pushOpt(o, i) {
      o.id = i
      this.optsList.push(o)
    },
    getOpt(id) {
      let setting
      this.optsList.forEach(element => {
        if (element.id === id) setting = element
      })
      return setting
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
  transition: all 0.3s ease;
}

view {
  color: inherit;
  font-size: inherit;
  z-index: inherit;
}

.prompt0 {
  max-width: 80%;
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
  opacity: 0.9;
  animation-delay: -1s;
}

.load-chase-dot:nth-child(3) {
  opacity: 0.8;
  animation-delay: -0.9s;
}

.load-chase-dot:nth-child(4) {
  opacity: 0.7;
  animation-delay: -0.8s;
}

.load-chase-dot:nth-child(5) {
  opacity: 0.6;
  animation-delay: -0.7s;
}

.load-chase-dot:nth-child(6) {
  opacity: 0.5;
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
