/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-02-22 | Ver 1.7.0 Alpha */

/**
 * 需求整理   --来自开发者
 * 目标版本：1.16
 * 现状分析：当前版本的底层是操作浏览器的DOM对象，这种实现方式无法兼容APP，只有Web端可以正常运行
 * 组件初心：兼容且适配多端的弹出层组件，解决uni-app原生弹窗不美观且无法自由控制的问题
 * 优化方案：改变底层逻辑，推翻当前实现方式 重构底层。
 * 思路：
 *  1. 使用 uni.$emit uni.$on 实现底层通信交互逻辑
 *  2. 弹窗组件仅有一个入口函数，在函数的末尾做判断来执行相应的弹窗，不同的调用均仅在js中做分线
 *  3. 所有的计算均在js中执行，尽量让view中的逻辑精简以提升性能（曲线救国(?)）
 *    a. 原 View 中的 Engine，搬到 js 中
 *    b. 计时关闭保留在 js 中
 *    c. 考虑倒计时逻辑功能怎么移植到 js 中
 */

/**
 * TODO:
 * [√] 1. 写DEMO，页面通过总线事件传参 prompt监听注入 测试。
 * [√] 2. 整理总线函数，写计算函数，事件传参
 * [√] 3. prompt组件监听唯一事件，通过参数标识判断需要执行的弹窗类型，弹窗在用户视图显示
 * [√] 4. PCIe总线计时器，调用关闭弹窗，事件传参
 * [ ] 5. prompt监听关闭类函数，通过参数判断关闭方式，执行回调函数，弹窗"明周期"结束
 * [ ] 6. 每个弹窗都要有 "唯一ID" 以及 "TYPE标识" 保证 "线程分离"，避免"暗周期"的出现
 */

/**
 * uni事件监听功能整理
 * uni.$emit(eventName, Obj) // 触发全局自定义事件，传参类型为对象
 * uni.$on(eventName, callback(Obj)) // 监听全局自定义事件，回调函数中的参数就是触发时传过来的参数
 * uni.$once(eventName, callback(Obj)) // 监听全局的自定义事件，事件由 uni.$emit 触发，但仅触发一次，在第一次触发之后移除该监听器。（其实没太懂 "事件由 uni.$emit 触发" 这句）
 * uni.$off([eventName, callback(Obj)]) // 移除全局自定义事件监听器。若uni.$off不传参，则移除App级别的所有事件监听器；
 */

let routeChange = function () {
  prompt.hideAll()
}

export let prompt = {
  ins: 0, // 弹窗ID
  popArr: [], // [type]  0:msg  1:status  2:load  3:modal
  icons: ["/static/icon/fail.png", "/static/icon/success.png", "/static/icon/info.png", "/static/icon/question.png"],
  // msg 弹窗
  msg: function (txt, opts) {
    const PT = 0
    let setting = craft.settingEngine(txt, opts, PT) // setting: {opts,time} | popArr: push(type,insID)
    uni.$emit("showPrompt", setting.opts)
    craft.autoEngine(setting.time)
    return prompt.ins
  },
  // error 弹框
  error: function (txt, opts) {
    return prompt.status(txt, opts, 0)
  },
  // success 弹窗
  success: function (txt, opts) {
    return prompt.status(txt, opts, 1)
  },
  // info 弹框
  info: function (txt, opts) {
    return prompt.status(txt, opts, 2)
  },
  // info 弹框
  question: function (txt, opts) {
    return prompt.status(txt, opts, 3)
  },
  // status 弹窗
  status: function (txt, opts, status) {
    const PT = 1
    let setting = craft.settingEngine(txt, opts, PT, status)
    uni.$emit("showPrompt", setting.opts)
    craft.autoEngine(setting.time)
    return prompt.ins
  },
  // load 弹窗
  load: function (txt, opts) {
    const PT = 2
    let setting = craft.settingEngine(txt, opts, PT)
    uni.$emit("showPrompt", setting.opts)
    craft.autoEngine(setting.time)
    return prompt.ins
  },
  // modal 弹窗
  modal: function (view, opts) {
    const PT = 3
    let setting = craft.settingEngine(view, opts, PT)
    uni.$emit("showPrompt", setting.opts)
    craft.autoEngine(0)
    return prompt.ins
  },
  // 手动关闭函数（不传参数时，先隐藏最后一个弹出的）
  hide: function (insId) {
    if (prompt.popArr.length === 0) return false
    // (!insId && typeof insId !== "number" && insId.trim() !== "") || typeof insId === "object"
    if (typeof insId !== "number") {
      let del = prompt.popArr.pop()
      uni.$emit("hidePrompt", del)
    } else {
      prompt.popArr.forEach((element, index) => {
        if (element.insID === insId) {
          prompt.popArr.splice(index, 1)
          uni.$emit("hidePrompt", element)
        }
      })
    }
  },
  // 按照类型关闭弹窗
  hideType: function (type) {
    if (prompt.popArr.length === 0) return false
    prompt.popArr.forEach((element, index) => {
      if (element.type === type) {
        prompt.popArr.splice(index, 1)
        uni.$emit("hidePrompt", element)
      }
    })
  },
  // 全部关闭函数
  hideAll: function () {
    if (prompt.popArr.length === 0) return false
    uni.$emit("hidePrompt", { type: "all", insID: prompt.popArr })
    prompt.popArr = []
  },
  // 获取当前弹窗列表
  getList: function () {
    return prompt.popArr
  },
}

/* 以下为私域函数 */
let craft = {
  /* 弹窗计算引擎  文字计算，时间计算，配置计算，默认赋值... */
  settingEngine: function (txt, opts, type, others) {
    /* 公用变量 */
    let formatOpt = typeof opts !== "object" ? {} : opts // opts格式化
    let isPass = formatOpt.isPass === undefined ? false : formatOpt.isPass // 是否允许穿透
    let isMask = formatOpt.isMask === undefined ? false : formatOpt.isMask // 是否打开蒙板
    let isBlur = formatOpt.isBlur === undefined ? true : formatOpt.isBlur // 是否打开底层高斯
    let Z = parseInt(1000 + Number(prompt.ins))
    /* opts单元初始化计算 */
    let initialOpt = {
      id: prompt.ins, // ID注入
      show: true,
      txt: typeof txt === "string" ? txt : JSON.stringify(txt), // 弹窗文字
      type,
      pass: isPass ? "u-pe-none" : "u-pe-auto",
      scroll: formatOpt.scroll === undefined ? true : formatOpt.scroll, // 是否允许滑动
      isShut: formatOpt.isShut === undefined ? false : formatOpt.isShut, // 是否点击蒙版关闭
      ani_m: formatOpt.ani_m === undefined || !Array.isArray(formatOpt.ani_m) ? ["fade"] : formatOpt.ani_m,
      ani_c: formatOpt.ani_c === undefined || !Array.isArray(formatOpt.ani_c) ? ["fade", "zoom-in"] : formatOpt.ani_c,
      PromptClass: (formatOpt.isRow ? "u-flex-d-r " : "u-flex-d-c ") + (isBlur ? "blurCloud " : "") + (formatOpt.class || ""),
      MaskStyle: (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (formatOpt.maskColor || "rgba(0,0,0,.6)") : ""), // 蒙版样式计算
      PromptStyle: "box-shadow:" + (formatOpt.shadow || "0 0 8rpx 5rpx rgba(0,0,0,0.2)") + ";z-index:" + Z + ";background:" + (formatOpt.bgColor || "rgba(0,0,0,.6)") + ";color:" + (formatOpt.color || "#fff") + ";fontSize:" + (formatOpt.fontSize || "30rpx") + ";" + (formatOpt.style || ""), // 弹窗样式计算
      Z,
      cb: formatOpt.cb,
    }
    /* 其他单元计算 */
    if (initialOpt.type === 1) {
      // status 图标附加属性
      initialOpt.IconStyle = "width:" + (formatOpt.iconWidth || "80rpx") + (formatOpt.iconColor ? ";filter: drop-shadow(100vw 0 " + formatOpt.iconColor + ");right: 100vw" : "") + ";" + (formatOpt.iconStyle || "")
      initialOpt.IconUrl = others !== undefined ? (typeof others === "number" ? prompt.icons[others] : others) : null
      initialOpt.IconClass = "u-mg-8rp" + (formatOpt.iconClass || "")
    } else if (initialOpt.type === 2) {
      // loading 加载层附加属性
      initialOpt.LoadClass = "u-mg-24rp" + (formatOpt.loadClass || "")
      initialOpt.loadColor = formatOpt.loadColor || "#fff"
      initialOpt.LoadSize = formatOpt.loadSize || "80rpx"
    } else if (initialOpt.type === 3) {
      let view = txt
        console.log(view)
      /* 处理格式化后的数据列 */
      if (!formatOpt.vtStyle) formatOpt.vtStyle = {}
      if (!formatOpt.vdStyle) formatOpt.vdStyle = {}
      if (!formatOpt.vtStyle.fontSize) formatOpt.vtStyle.fontSize = "34rpx"
      if (!formatOpt.vtStyle.fontWeight) formatOpt.vtStyle.fontWeight = "bold"
      if (!formatOpt.btn || formatOpt.btn.length === 0) formatOpt.btn = [{ key: "确定" }]
      formatOpt.btn.forEach((item, index) => {
        if (!item.key) item.key = "未定义"
        if (!item.fn) item.fn = undefined
        if (!item.time) item.time = 0
        if (!item.style) {
          if (formatOpt.btn.length < 2) item.style = { color: "#4E90F6" }
          else if (formatOpt.btn.length === 2) {
            if (index === 0) item.style = { color: "#ED0009" }
            else item.style = { color: "#4E90F6" }
          } else item.style = {}
        }
        if (!item.style.fontWeight) item.style.fontWeight = "bold"
        if (!item.style.borderLeft) item.style.borderLeft = "1rpx solid" + formatOpt.lineColor
      })
      // modal弹窗 部分配置是独立存在的 与公用的引默认值擎不同
      initialOpt.txt = ""
      initialOpt.MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (formatOpt.maskColor || "rgba(255,255,255,.86)") : "") // 蒙版样式计算
      initialOpt.PromptStyle = "box-shadow:" + (formatOpt.shadow || "0 0 8rpx 5rpx rgba(0,0,0,0.2)") + ";z-index:" + Z + ";background:" + (formatOpt.bgColor || "rgba(255,255,255,.86)") + ";color:" + (formatOpt.color || "#333") + ";fontSize:" + (formatOpt.fontSize || "30rpx") + ";" + (formatOpt.style || "") // 弹窗样式计算
      initialOpt.PromptClass = (isBlur ? "blurCloud " : "") + (formatOpt.class || "")
      // modal弹窗 拓展属性
      initialOpt.lineColor = formatOpt.lineColor || "#ccc" // 分线颜色
      initialOpt.VTitle = view.title || "" // 弹窗标题文字
      initialOpt.VDesc = view.desc || "" // 弹窗描述文字
      initialOpt.vtStyle = formatOpt.vtStyle || {}
      initialOpt.vdStyle = formatOpt.vdStyle || {}
      initialOpt.btnList = formatOpt.btn
      initialOpt.setTime = formatOpt.setTime || 0
      initialOpt.setFn = formatOpt.setFn || undefined
      initialOpt.setHide = formatOpt.setHide === undefined ? true : formatOpt.setHide // 倒计时结束是否自动关闭
    }
    /* 公用引擎初始化完毕 */
    prompt.hideType(type) // 先关闭
    prompt.popArr.push({ type, insID: prompt.ins })
    return {
      opts: initialOpt,
      time: opts !== undefined ? (typeof opts === "number" ? opts : opts.time !== undefined && typeof opts.time === "number" ? opts.time : 3000) : 3000,
    }
  },
  autoEngine: function (time) {
    let insID = prompt.ins
    if (time != 0) {
      setTimeout(() => {
        prompt.hide(insID)
        prompt.ins++
      }, time)
    } else prompt.ins++
  },
  ArrDebug: function (arr) {
    arr.forEach(item => {
      console.log(item)
    })
  },
}
