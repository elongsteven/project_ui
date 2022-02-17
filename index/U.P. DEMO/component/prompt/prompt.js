/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-02-09 | Ver 1.0
 *
 * @Func this.$prompt.msg(text, opts);  创建一个弹窗
 * @param      { String }      text     弹窗文字内容
 * @param { Object || Number } opts     弹窗配置(Obj) 或 显示时长(Num 单位:ms)
 *
 *   -   -   -   -   -   -   -   -   -
 * @param { Object } opts {
 *  // 公用部分
 *    @property { Boolean } isPass   @default  false             是否穿透点击
 *    @property { Boolean } isMask   @default  false             是否打开蒙板
 *    @property { Boolean } scroll   @default  true              是否允许滑动
 *    @property { Boolean } isShut   @default  false             是否蒙版点隐
 * }
 *
 *
 *
 *
 *
 * @Func this.$prompt.hideAll();        手动关闭当前所有弹窗
 *
 *   -   -   -   -   -   -   -   -   -   -
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
// 各种状态，顺序为 [ msg, status, load ]
let timeout = [undefined, undefined, undefined] // 自动关闭配置项  默认 undefined
let popArr = [] // 0:msg  1:status  2:load  3:modal

// msg 弹窗
prompt.msg = function (txt, opts) {
  const PT = 0
  let setting = prompt.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showMsg(setting.text, opts, ins)
    else instance.showMsg(setting.text, {}, ins)
    prompt.autoEngine(setting.time, PT)
  })
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
  const PT = 1
  let setting = prompt.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showStatus(status, setting.text, opts, ins)
    else instance.showStatus(status, setting.text, {}, ins)
    prompt.autoEngine(setting.time, PT)
  })
  return ins
}

// load 弹窗
prompt.load = function (txt, opts) {
  const PT = 2
  let setting = prompt.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showLoad(setting.text, opts, ins)
    else instance.showLoad(setting.text, {}, ins)
    prompt.autoEngine(setting.time)
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
    if (popArr.length === 0) return false
    if ((!insId && typeof insId !== "number") || typeof insId === "object") {
      let del = popArr.pop()
      instance.hide(del) // hide函数
    } else {
      popArr.forEach((element, index) => {
        if (element.insID === insId) {
          popArr.splice(index, 1)
          instance.hide(element)
        }
      })
    }
  })
}

// 按照类型关闭弹窗
prompt.hideType = function (type) {
  if (!instance) return false
  popArr.forEach((element, index) => {
    if (element.type === type) {
      popArr.splice(index, 1)
      instance.hide(element)
    }
  })
}

// 全部关闭函数
prompt.hideAll = function (data) {
  if (!instance) return false
  Vue.nextTick(() => {
    popArr = []
    instance.hideAll()
  })
}

// 获取当前弹窗列表
prompt.getList = function () {
  return popArr
}

/* 以下为私域函数 */

// 公用配置引擎
prompt.settingEngine = function (txt, opts, type) {
  if (!instance) {
    instance = new PopupBox().$mount()
    document.body.appendChild(instance.$el)
  }
  prompt.hideType(type)
  if (typeof txt !== "string") txt = JSON.stringify(txt)
  popArr.push({ type: type, insID: ins })
  if (opts !== undefined) {
    if (typeof opts === "number") return { text: txt, time: opts }
    else if (opts.time !== undefined && typeof opts.time === "number") return { text: txt, time: opts.time }
    else return { text: txt, time: 3000 }
  } else return { text: txt, time: 3000 }
}

// 公用 - 自动关闭引擎
prompt.autoEngine = function (time) {
  let insID = ins
  if (time != 0) {
    setTimeout(() => {
      prompt.hide(insID)
      ins++
    }, time)
  } else ins++
}

// Debugger 数组调试用工具
prompt.ArrDebug = function (arr) {
  arr.forEach(item => {
    console.log(item)
  })
}

export default prompt
