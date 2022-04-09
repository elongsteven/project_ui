/**
 * Router Controller
 */
import Vue from "vue";
import uniCrazyRouter from "@/components/crazy-router";
Vue.use(uniCrazyRouter);

uniCrazyRouter.beforeEach(async (to, from, next) => {
  // 逻辑代码
  vPrint(from, to);
  next();
});

uniCrazyRouter.afterEach((to, from) => {
  // 逻辑代码
  setTimeout(() => {
    xEvent.emit("afterRoute", { to, from });
  });
  vPrint(from, to);
});

uniCrazyRouter["on" + "Error"]((to, from) => {
  // 逻辑代码
});

/* 指定页面的事件 */
export let xEvent = {
  pageId: function () {
    return encodeURIComponent(getCurrentPages()[getCurrentPages().length - 1].route);
  },
  list: [],
  emit: function (name, data) {
    let eventID = this.pageId() + name;
    uni.$emit(eventID, data);
    this.list.some(function (val, index) {
      if (val.eventID === eventID && val.type === "once") this.list.splice(index, 1);
      return val.eventID === eventID && val.type === "once";
    }, this);
  },
  on: function (name, fn) {
    let eventID = this.pageId() + name;
    if (!fn) fn = function () {};
    this.list.push({ name, type: "keep", path: decodeURIComponent(this.pageId()), fn, eventID });
    uni.$on(eventID, fn);
  },
  once: function (name, fn) {
    let eventID = this.pageId() + name;
    if (!fn) fn = function () {};
    this.list.push({ name, type: "once", path: decodeURIComponent(this.pageId()), fn, eventID });
    uni.$once(eventID, fn);
  },
  off: function (name, fn) {
    let eventID = this.pageId() + name;
    if (!fn) fn = function () {};
    uni.$off(eventID, fn);
    let del_off = this.list.some(function (val, index) {
      if (val.eventID === eventID) this.list.splice(index, 1);
      return val.eventID === eventID;
    }, this);
  }
};

/* 全局功能 */
export let craft = {
  asyncFunc: function (Fn, thenFn, catchFn) {
    return new Promise((resolve, reject) => {
      let returns = Fn();
      setTimeout(() => {
        resolve(returns);
      });
    })
      .then(thenFn())
      .catch(error => {
        catchFn(error);
      });
  }
};

/* 弹窗API */
import { promptAPI } from "./public/prompt/prompt.js";
export let prompt = promptAPI;

/* 控制台打印 */
export const vPrint = function (...content) {
  // let trace = console.trace()
  try {
    console.groupCollapsed(...content);
    console.log(new Error().stack.split("\n")[2].trim());
    console.groupEnd();
  } catch (e) {
    console.log(...content);
  }
};

/* 异步缓存API（仅获取信息和查值时需要使用async await）*/
export let storage = {
  set: function (key, val) {
    if (!key) key = "_temp";
    if (!val) val = undefined;
    uni.setStorage({
      key,
      data: val,
      success: function (res) {
        this.vPrint("异步写入成功", key, ":", val);
      },
      fail: function () {
        this.vPrint(key, "异步写入失败");
      }
    });
  },
  get: function (key) {
    if (!key) return false;
    return new Promise(resolve => {
      uni.getStorage({
        key,
        success: function (res) {
          resolve(res.data);
        },
        fail: function () {
          this.vPrint(key, "异步读取失败");
          resolve(false);
        }
      });
    });
  },
  remove: function (key) {
    if (!key) return false;
    uni.removeStorage({
      key,
      success: function () {
        this.vPrint("异步移除成功", key);
      },
      fail: function () {
        this.vPrint(key, "异步移除失败");
      }
    });
  },
  info: function () {
    return new Promise(resolve => {
      uni.getStorageInfo({
        success: function (res) {
          resolve({ keys: res.keys, currentSize: res.currentSize, limitSize: res.limitSize });
        },
        fail: function () {
          this.vPrint("异步读取所有信息失败");
          resolve(false);
        }
      });
    });
  },
  clear: function () {
    uni.clearStorage();
  }
};

/* 同步缓存API */
export let storageSync = {
  set: function (key, val) {
    if (!key) key = "_temp";
    if (!val) val = undefined;
    try {
      uni.setStorageSync(key, val);
      return true;
    } catch (e) {
      this.vPrint(key, "同步写入失败:", e);
      return false;
    }
  },
  get: function (key) {
    if (!key) return false;
    try {
      const value = uni.getStorageSync(key);
      if (value) return value;
    } catch (e) {
      this.vPrint(key, "同步读取失败:", e);
      return false;
    }
  },
  remove: function (key) {
    if (!key) return false;
    try {
      uni.removeStorageSync(key);
      return true;
    } catch (e) {
      this.vPrint(key, "同步移除失败:", e);
      return false;
    }
  },
  info: function () {
    try {
      const res = uni.getStorageInfoSync();
      return { keys: res.keys, currentSize: res.currentSize, limitSize: res.limitSize };
    } catch (e) {
      this.vPrint("同步读取所有信息失败:", e);
      return false;
    }
  },
  clear: function () {
    try {
      uni.clearStorageSync();
      return true;
    } catch (e) {
      this.vPrint("同步清空失败:", e);
      return false;
    }
  }
};

/* 路由API（未完成）- 与原生不冲突 */
export let vRoute = {
  _time: 1000,
  _antiShake: false,
  antiShaker: function (fn, param) {
    if (!this._antiShake) {
      this._antiShake = true;
      fn(param);
      setTimeout(() => {
        this._antiShake = false;
      }, this._time);
    }
  },
  // 跳转 (打开一个新页面)
  path(url, opts) {
    let rule = this.computer(url, opts, "path");
    this.antiShaker(uni.navigateTo, rule);
  },
  // 替换 (关闭当前页面，打开新页面)
  replace: function (url, opts) {
    let rule = this.computer(url, opts, "replace");
    this.antiShaker(uni.redirectTo, rule);
  },
  // 重启 (打开新页面，关闭所有页面)
  launch: function (url, opts) {
    let rule = this.computer(url, opts, "launch");
    this.antiShaker(uni.reLaunch, rule);
  },
  // Tab栏跳转
  tab: function (url, opts) {
    let rule = this.computer(url, opts, "tab");
    this.antiShaker(uni.switchTab, rule);
  },
  // 返回上一页
  back: function (delta, opts) {
    let rule = this.computer(delta, opts, "back");
    this.antiShaker(uni.redirectTo, rule);
  },
  // 预加载页面
  load: function (url, opts) {
    let rule = this.computer(url, opts, "load");
    this.antiShaker(uni.preloadPage, rule);
  },
  // 获取当前所有激活的页面
  getAlive: function () {
    let allAlivePage = getCurrentPages();
    let list = [];
    allAlivePage.forEach(pageConfig => {
      list.push(pageConfig.route);
    });
    return list;
  },
  // 获取前几页的页面路径
  getPre: num => {
    if (!num) num = 1;
    num = num + 1;
    let pages = getCurrentPages();
    let prePage;
    try {
      prePage = pages[pages.length - num].route;
    } catch (e) {
      prePage = undefined;
    }
    // #ifdef H5
    return prePage;
    // #endif
    return prePage.$vm;
  },
  // 公用: 计算属性
  computer: function (url, opts, type) {
    let routes = getCurrentPages();
    // if (url.substring(0, 1) != "/") url = "/" + url;
    if (!opts) opts = {};
    let rule = {
      url,
      complete: opts.complete && typeof opts.complete == "function" ? opts.complete : undefined,
      fail: opts.fail && typeof opts.fail == "function" ? opts.fail : undefined
    };
    if (type != "load") rule.success = opts.success && typeof opts.success == "function" ? opts.success : undefined;
    if (type == "path" || type == "back") {
      rule.animationType = opts.animate && typeof opts.animate == "string" ? opts.animate : undefined;
      rule.animationDuration = opts.time && typeof opts.time == "number" ? opts.time : undefined;
      if (type == "path") rule.events = opts.events && typeof opts.events == "object" ? opts.events : undefined;
    }
    uni.$emit("router", { from: routes[routes.length - 1].route, to: url });
    return rule;
  },
  // 公用: 计算对象转URL参数
  pageDataComp: function (obj) {
    if (!obj || typeof obj === "object") {
      console.warn("参数类型需为对象");
      return "";
    }
    let dataStr = "";
    let i = 0;
    for (var key in data) {
      if (i > 0) dataStr += "&";
      else dataStr += "?";
      dataStr += key + "=" + JSON.stringify(data[key]);
      i++;
    }
    return dataStr;
  }
  //URL路径判断
  //获取当前页面所有参数
};