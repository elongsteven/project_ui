let routeChange = function () {
  prompt.hideAll()
}

/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-02-19 | Ver 1.6.0 */
import promptView from "@/component/PCI/public/prompt.vue"

/**
 * 需求整理   --来自开发者
 * 目标版本：1.16
 *  1. 使用 uni.$emit uni.$on 实现底层通信交互逻辑
 *  2. 弹窗组件仅有一个入口函数，在函数的末尾做判断来执行相应的弹窗，不同的调用均仅在js中做分线
 *  3. 所有的计算均在js中执行，尽量让view中的逻辑精简以提升性能（曲线救国(?)）
 *    a. 原 View 中的 Engine，搬到 js 中
 *    b. 计时关闭保留在 js 中
 *    c. 考虑倒计时逻辑功能怎么移植到 js 中
 */

/**
 * uni事件监听功能整理
 * uni.$emit(eventName, Obj) // 触发全局自定义事件，传参类型为对象
 * uni.$on(eventName, callback(Obj)) // 监听全局自定义事件，回调函数中的参数就是触发时传过来的参数
 * uni.$once(eventName, callback(Obj)) // 监听全局的自定义事件，事件由 uni.$emit 触发，但仅触发一次，在第一次触发之后移除该监听器。（其实没太懂 "事件由 uni.$emit 触发" 这句）
 * uni.$off([eventName, callback(Obj)]) // 移除全局自定义事件监听器。若uni.$off不传参，则移除App级别的所有事件监听器；
 */

export let prompt = {
  ins: 0, // 弹窗ID
  popArr: [], // [type]  0:msg  1:status  2:load  3:modal
  // msg 弹窗
  msg: function (txt, opts) {
    const PT = 0
    let setting = craft.settingEngine(txt, opts, PT)
    if (typeof opts === "object") promptView.methods.showMsg(setting.text, opts, prompt.ins, PT)
    else promptView.methods.showMsg(setting.text, {}, prompt.ins, PT)
    craft.autoEngine(setting.time)
  },
  // error 弹框
  error: function (txt, opts) {
    prompt.status(txt, opts, 0)
  },
  // success 弹窗
  success: function (txt, opts) {
    prompt.status(txt, opts, 1)
  },
  // info 弹框
  info: function (txt, opts) {
    prompt.status(txt, opts, 2)
  },
  // info 弹框
  question: function (txt, opts) {
    prompt.status(txt, opts, 3)
  },
  // status 弹窗
  status: function (txt, opts, status) {
    const PT = 1
    let setting = craft.settingEngine(txt, opts, PT)
    if (typeof opts === "object") promptView.methods.showStatus(status, setting.text, opts, prompt.ins, PT)
    else promptView.methods.showStatus(status, setting.text, {}, prompt.ins, PT)
    craft.autoEngine(setting.time)
    return prompt.ins
  },
  // load 弹窗
  load: function (txt, opts) {
    const PT = 2
    let setting = craft.settingEngine(txt, opts, PT)
    if (typeof opts === "object") promptView.methods.showLoad(setting.text, opts, prompt.ins, PT)
    else promptView.methods.showLoad(setting.text, {}, prompt.ins, PT)
    craft.autoEngine(setting.time)
    return prompt.ins
  },
  // modal 弹窗
  modal: function (view, opts) {
    const PT = 3
    craft.settingEngine(undefined, undefined, PT)
    if (!opts.lineColor) opts.lineColor = "#ccc"
    // 初始化文字样式
    if (!opts.vtStyle) opts.vtStyle = {}
    if (!opts.vdStyle) opts.vdStyle = {}
    if (!opts.vtStyle.fontSize) opts.vtStyle.fontSize = "34rpx"
    if (!opts.vtStyle.fontWeight) opts.vtStyle.fontWeight = "bold"
    // 按钮初始化 - 配置计算
    if (!opts.btn || opts.btn.length === 0) opts.btn = [{ key: "确定" }]
    opts.btn.forEach((item, index) => {
      if (!item.key) item.key = "未定义"
      if (!item.fn) item.fn = undefined
      if (!item.time) item.time = 0
      if (!item.style) {
        if (opts.btn.length < 2) item.style = { color: "#4E90F6" }
        else if (opts.btn.length === 2) {
          if (index === 0) item.style = { color: "#ED0009" }
          else item.style = { color: "#4E90F6" }
        } else item.style = {}
      }
      if (!item.style.fontWeight) item.style.fontWeight = "bold"
      if (!item.style.borderLeft) item.style.borderLeft = "1rpx solid" + opts.lineColor
    })
    if (typeof opts === "object") promptView.methods.showModal(view, opts, prompt.ins, PT)
    else promptView.methods.showModal(view, {}, prompt.ins, PT)
    craft.autoEngine(0)
    return prompt.ins
  },
  // 手动关闭函数（不传参数时，先隐藏最后一个弹出的）
  hide: function (insId) {
    if (!promptView.methods) return false
    if (prompt.popArr.length === 0) return false
    if ((!insId && typeof insId !== "number" && insId.trim() !== "") || typeof insId === "object") {
      let del = prompt.popArr.pop()
      promptView.methods.hide(del) // hide函数
    } else {
      prompt.popArr.forEach((element, index) => {
        if (element.insID === insId) {
          prompt.popArr.splice(index, 1)
          promptView.methods.hide(element)
        }
      })
    }
  },
  // 按照类型关闭弹窗
  hideType: function (type) {
    if (!promptView.methods) return false
    prompt.popArr.forEach((element, index) => {
      if (element.type === type) {
        prompt.popArr.splice(index, 1)
        promptView.methods.hide(element)
      }
    })
  },
  // 全部关闭函数
  hideAll: function () {
    if (!promptView.methods) return false
    prompt.popArr = []
    promptView.methods.hideAll()
  },
  // 获取当前弹窗列表
  getList: function () {
    return prompt.popArr
  },
}

/* 以下为私域函数 */
let craft = {
  settingEngine: function (txt, opts, type) {
    prompt.hideType(type)
    if (typeof txt !== "string") txt = JSON.stringify(txt)
    prompt.popArr.push({ type: type, insID: prompt.ins })
    if (opts !== undefined) {
      if (typeof opts === "number") return { text: txt, time: opts }
      else if (opts.time !== undefined && typeof opts.time === "number") return { text: txt, time: opts.time }
      else return { text: txt, time: 3000 }
    } else return { text: txt, time: 3000 }
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
