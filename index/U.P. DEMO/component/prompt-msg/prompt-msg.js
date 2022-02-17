/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-02-09 | Ver 1.0
 *
 * @Func this.$prompt.msg(data, time);  创建一个弹窗
 * @param { Object || String } data     代表弹窗的参数（见 "@data 详解"）
 * @param      { Number }      time     弹窗显示的时间，默认为3000
 *
 * @Func this.$prompt.hide();           手动关闭最后一个出现的弹窗（最顶层的）
 *
 * @Func this.$prompt.hideAll();        手动关闭当前所有弹窗
 *
 *   -   -   -   -   -   -   -   -   -   -   -   -
 * @data 详解:
 *  当 data 为 String 类型时，会直接当做"提示窗"执行，data作为提示窗的内容显示
 *  当 data 为 Object 类型时: {
 *    @param { Boolean } isPass   @default  false             是否穿透点击
 *    @param { Boolean } isMask   @default  false             是否打开蒙板
 *    @param { Boolean } scroll   @default  true              是否允许滑动
 *    @param { Boolean } isShut   @default  false             是否蒙版点隐
 *    @param { Number }   type    @default  0                 弹窗类型
 *    @param { String }   txt     @default  ""                弹窗文字
 *    @param { String } maskColor @default  "rgba(0,0,0,.6)"  蒙版背景颜色
 *    @param { String } bgColor   @default  "rgba(0,0,0,.6)"  弹窗背景颜色
 *    @param { String }  color    @default  "#fff"            弹窗文字颜色
 *    @param { String } fontSize  @default  "30rpx"           弹窗文字大小
 *    @param { String }  class    @default  ""                自定义弹窗附加类名
 *    @param { String }  style    @default  ""                自定义弹窗附加样式
 *
 *    @param { String } iconColor @default  ""                png图标颜色
 *  }
 */

import Vue from "vue"
import prompt from "./prompt.vue"

const PopupBox = Vue.extend(prompt)

let instance // PopupBox实例
let ins = 0 // 弹窗ID
let insArr = [] // 当前弹窗列表

// msg 弹窗
prompt.msg = function (txt, opts) {
  let time = prompt.timeEngine(opts)
  let text = prompt.toStr(txt)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showMsg(text, opts, ins)
    else instance.showMsg(text, {}, ins)
    prompt.autoEngine(time)
  })
  return ins
}

// error 弹框
prompt.error = function (txt, opts) {
  prompt.status(txt, opts, 0)
}

// success 弹窗
prompt.success = function (txt, opts) {
  prompt.status(txt, opts, 1)
}

// info 弹框
prompt.info = function (txt, opts) {
  prompt.status(txt, opts, 2)
}

// info 弹框
prompt.question = function (txt, opts) {
  prompt.status(txt, opts, 3)
}

// status 弹窗
prompt.status = function (txt, opts, status) {
  let time = prompt.timeEngine(opts)
  let text = prompt.toStr(txt)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showStatus(status, text, opts, ins)
    else instance.showStatus(status, text, {}, ins)
    prompt.autoEngine(time)
  })
  return ins
}

// load 弹窗
prompt.load = function (txt, opts) {
  let time = prompt.timeEngine(opts)
  let text = prompt.toStr(txt)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showLoad(text, opts, ins)
    else instance.showLoad(text, {}, ins)
    prompt.autoEngine(time)
  })
  return ins
}

// modal 弹窗
prompt.modal = function (txt, opts) {
  let time = prompt.timeEngine(opts)
  let text = prompt.toStr(txt)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showModal(text, opts, ins)
    else instance.showModal(text, {}, ins)
    prompt.autoEngine(time)
  })
  return ins
}

// 手动关闭函数（不传参数时，先隐藏最后一个弹出的）
prompt.hide = function (insId) {
  if (!instance) return false
  Vue.nextTick(() => {
    if (insArr.length == 0) return false
    if ((!insId && typeof insId !== "number") || typeof insId === "object") {
      let del = insArr.pop()
      instance.hide(del) // hide函数
    } else {
      insArr.forEach((element, index) => {
        if (element === insId) {
          insArr.splice(index, 1)
          instance.hide(element)
        }
      })
    }
  })
}

// 全部关闭函数
prompt.hideAll = function (data) {
  if (!instance) return false
  Vue.nextTick(() => {
    insArr = []
    instance.hideAll()
  })
}

// 获取当前弹窗列表
prompt.getList = function () {
  return insArr
}

// 获取某弹窗的配置
prompt.getOpt = function (insId) {
  if (!instance) return false
  if ((!insId && typeof insId !== "number") || typeof insId === "object") {
    if (insArr.length > 0) return instance.getOpt(insArr[insArr.length - 1])
    else return false
  } else {
    return instance.getOpt(insId)
  }
}

// 以当前的弹窗列表，按照index关闭（冷门）
prompt.hideIndex = function (index) {
  if (!instance) return false
  if (insArr[index] >= 0) prompt.hide(insArr[index])
}

/* 以下为私域函数 */

// 公用 - 时间计算引擎
prompt.timeEngine = function (opts) {
  if (!instance) {
    instance = new PopupBox().$mount()
    document.body.appendChild(instance.$el)
  }
  insArr.push(ins)
  if (opts !== undefined) {
    if (typeof opts === "number") return opts
    else if (opts.time !== undefined && typeof opts.time === "number") return opts.time
    else return 3000
  } else return 3000
}

// 公用 - 自动关闭引擎
prompt.autoEngine = function (time) {
  let insID = ins
  if (time != 0) {
    setTimeout(() => {
      prompt.hide(insID)
    }, time)
  }
  ins++
}

prompt.toStr = function (txt) {
  if (typeof txt !== "string") return JSON.stringify(txt)
  else return txt
}

export default prompt
