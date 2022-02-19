/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-02-19 | Ver 1.6.0 */

import Vue from "vue"
import prompt from "./prompt.vue"

const PopupBox = Vue.extend(prompt)

let instance // PopupBox实例
let ins = 0 // 弹窗ID
let popArr = [] // [type]  0:msg  1:status  2:load  3:modal

// msg 弹窗
prompt.msg = function (txt, opts) {
  const PT = 0
  let setting = craft.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showMsg(setting.text, opts, ins, PT)
    else instance.showMsg(setting.text, {}, ins, PT)
    craft.autoEngine(setting.time)
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
  let setting = craft.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showStatus(status, setting.text, opts, ins, PT)
    else instance.showStatus(status, setting.text, {}, ins, PT)
    craft.autoEngine(setting.time)
  })
  return ins
}

// load 弹窗
prompt.load = function (txt, opts) {
  const PT = 2
  let setting = craft.settingEngine(txt, opts, PT)
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showLoad(setting.text, opts, ins, PT)
    else instance.showLoad(setting.text, {}, ins, PT)
    craft.autoEngine(setting.time)
  })
  return ins
}

// modal 弹窗
prompt.modal = function (view, opts) {
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
  Vue.nextTick(() => {
    if (typeof opts === "object") instance.showModal(view, opts, ins, PT)
    else instance.showModal(view, {}, ins, PT)
    craft.autoEngine(0)
  })
  return ins
}

// 手动关闭函数（不传参数时，先隐藏最后一个弹出的）
prompt.hide = function (insId) {
  if (!instance) return false
  Vue.nextTick(() => {
    if (popArr.length === 0) return false
    if ((!insId && typeof insId !== "number" && insId.trim() !== "") || typeof insId === "object") {
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
prompt.hideAll = function () {
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

prompt.routeChange = function () {
  prompt.hideAll()
}

/* 以下为私域函数 */
let craft = {
  settingEngine: function (txt, opts, type) {
    if (!instance) {
      instance = new PopupBox().$mount()
      // document.body.appendChild(instance.$el)
    }
    prompt.hideType(type)
    if (typeof txt !== "string") txt = JSON.stringify(txt)
    popArr.push({ type: type, insID: ins })
    if (opts !== undefined) {
      if (typeof opts === "number") return { text: txt, time: opts }
      else if (opts.time !== undefined && typeof opts.time === "number") return { text: txt, time: opts.time }
      else return { text: txt, time: 3000 }
    } else return { text: txt, time: 3000 }
  },
  autoEngine: function (time) {
    let insID = ins
    if (time != 0) {
      setTimeout(() => {
        prompt.hide(insID)
        ins++
      }, time)
    } else ins++
  },
  ArrDebug: function (arr) {
    arr.forEach(item => {
      console.log(item)
    })
  },
}

export default prompt
