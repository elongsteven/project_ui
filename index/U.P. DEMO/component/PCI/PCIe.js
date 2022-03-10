import { promptAPI } from "./public/prompt/prompt.js"

export let prompt = promptAPI

let pageDataComp = function (obj) {
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
    // console.log(this.index, this.history)
  },
  set: function (page, from) {
    if (from === "created") {
      if (!this.FIRST) return false
      else this.FIRST = false
    }
    console.log(page)
  },
}
