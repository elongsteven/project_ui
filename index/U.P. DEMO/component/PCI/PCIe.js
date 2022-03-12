import { promptAPI } from "./public/prompt/prompt.js"

export let prompt = promptAPI

export const vPrint = function (...content) {
  // let trace = console.trace()
  try {
    console.groupCollapsed(...content)
    console.log(new Error().stack.split("\n")[2].trim())
    console.groupEnd()
  } catch (e) {
    console.log(...content)
  }
}
// 异步缓存操作（仅获取信息和查值时需要使用async await）
export let storage = {
  set: function (key, val) {
    if (!key) key = "_temp"
    if (!val) val = undefined
    uni.setStorage({
      key,
      data: val,
      success: function (res) {
        this.vPrint("异步写入成功", key, ":", val)
      },
      fail: function () {
        this.vPrint(key, "异步写入失败")
      },
    })
  },
  get: function (key) {
    if (!key) return false
    return new Promise(resolve => {
      uni.getStorage({
        key,
        success: function (res) {
          resolve(res.data)
        },
        fail: function () {
          this.vPrint(key, "异步读取失败")
          resolve(false)
        },
      })
    })
  },
  remove: function (key) {
    if (!key) return false
    uni.removeStorage({
      key,
      success: function () {
        this.vPrint("异步移除成功", key)
      },
      fail: function () {
        this.vPrint(key, "异步移除失败")
      },
    })
  },
  info: function () {
    return new Promise(resolve => {
      uni.getStorageInfo({
        success: function (res) {
          resolve({ keys: res.keys, currentSize: res.currentSize, limitSize: res.limitSize })
        },
        fail: function () {
          this.vPrint("异步读取所有信息失败")
          resolve(false)
        },
      })
    })
  },
  clear: function () {
    uni.clearStorage()
  },
}
// 同步缓存操作
export let storageSync = {
  set: function (key, val) {
    if (!key) key = "_temp"
    if (!val) val = undefined
    try {
      uni.setStorageSync(key, val)
      return true
    } catch (e) {
      this.vPrint(key, "同步写入失败:", e)
      return false
    }
  },
  get: function (key) {
    if (!key) return false
    try {
      const value = uni.getStorageSync(key)
      if (value) return value
    } catch (e) {
      this.vPrint(key, "同步读取失败:", e)
      return false
    }
  },
  remove: function (key) {
    if (!key) return false
    try {
      uni.removeStorageSync(key)
      return true
    } catch (e) {
      this.vPrint(key, "同步移除失败:", e)
      return false
    }
  },
  info: function () {
    try {
      const res = uni.getStorageInfoSync()
      return { keys: res.keys, currentSize: res.currentSize, limitSize: res.limitSize }
    } catch (e) {
      this.vPrint("同步读取所有信息失败:", e)
      return false
    }
  },
  clear: function () {
    try {
      uni.clearStorageSync()
      return true
    } catch (e) {
      this.vPrint("同步清空失败:", e)
      return false
    }
  },
}

export let craft = {
  pageDataComp: function (obj) {
    if (!obj || typeof obj === "object") {
      console.warn("参数类型需为对象")
      return ""
    }
    let dataStr = ""
    let i = 0
    for (var key in data) {
      if (i > 0) dataStr += "&"
      else dataStr += "?"
      dataStr += key + "=" + JSON.stringify(data[key])
      i++
    }
    return dataStr
  },
}

export let vRoute = {
  FIRST: true,
  index: 0,
  history: [],
  executor: function (methods) {
    return new Promise((resolve, reject) => {
      let returns = methods()
      setTimeout(() => {
        resolve(returns)
      })
      // .then(() => {
      // })
      // .catch(error => {
      //   reject(error)
      // })
    })
  },
  computer: function (url, opts, from) {
    return new Promise(resolve => {
      let routes = getCurrentPages()
      uni.$emit("router", { from: routes[routes.length - 1].route, to: url })
      if (!opts) opts = {}
      let rule = {
        url,
        fail: opts.fail && typeof opts.fail == "function" ? opts.fail : undefined,
        success: opts.success && typeof opts.success == "function" ? opts.success : undefined,
        complete: opts.complete && typeof opts.complete == "function" ? opts.complete : undefined,
      }
      if (from == "path") {
        rule.animationType = opts.animate && typeof opts.animate == "string" ? opts.animate : undefined
        rule.animationDuration = opts.time && typeof opts.time == "number" ? opts.time : undefined
        rule.events = opts.events && typeof opts.events == "object" ? opts.events : undefined
        resolve(rule)
      } else resolve(rule)
    })
  },
  async path(url, opts) {
    let rule = await this.computer(url, opts, "path")
    if (opts && opts.fn) await this.executor(opts.fn)
    uni.navigateTo(rule)
  },
  replace: function (url, param) {
    uni.redirectTo({ url })
  },
  launch: function (url, param) {
    uni.reLaunch({ url })
  },
  tab: function (url, param) {
    uni.switchTab({ url })
  },
  back: function (delta, param) {},
  load: function (url, param) {},
  change: function (from, to) {
    // uni.$emit("router", { from, to })
    // if (this.index === 0) this.history.push(from)
    // if (this.history[this.index - 1] === from) this.history.push(to)
    // this.index++
    // this.vPrint(this.index, this.history)
  },
  set: function (page, from) {
    if (from === "created") {
      if (!this.FIRST) return false
      else this.FIRST = false
    }
    this.vPrint(page)
  },
}
