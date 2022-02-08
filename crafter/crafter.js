if (!(typeof window.CustomEvent === "function")) {
  // 设置传参事件兼容性（IE 14-）
  var CustomEvent = function (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent("CustomEvent")
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
}

window.craft = {
  browser: { // 终端判断 - 调用：if(browser.versions.终端名称){...}
    versions: (function () {
      var u = navigator.userAgent,
        app = navigator.appVersion
      return {
        IE: u.indexOf("Trident") > -1, // IE内核
        Opera: u.indexOf("Presto") > -1, // opera内核
        WebKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
        Firefox: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        IOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        Android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, // android终端
        iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf("iPad") > -1, // 是否iPad
        webApp: u.indexOf("Safari") == -1, // 是否web应该程序，没有头部与底部
        weixin: u.indexOf("MicroMessenger") > -1, // 是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq", // 是否QQ
      }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(), // 语言版本 browser.language
    app: navigator.appVersion || "The device does not support 'appVersion' query",
  },

  /**
   * craft.randomList 从数组中获取一个随机的元素
   * @param { Array } arr *必要* 要遍历的数组
   * @param { Boolean } f 可选 是否返回一个筛选后的数组
   * @param {*} r 可选 返回替换过的数组，传值为替换内容
   * @returns { Object } value元素 index下标 filter筛选后的数组 replace替换后的数组
   */
  randomList: function (arr, f, r) {
    if (!this.isArrFn(arr)) throw new Error("The 1st para must be a 'Array'")
    var i = Math.floor(((Math.random() * 10) % arr.length) + 1)
    var returnObj = {
      value: arr[i],
      index: i,
    }
    if (f) {
      var arr1 = Object.assign([], arr)
      arr1.splice(i, 1)
      returnObj.filter = arr1
    }
    if (r != undefined) {
      var arr2 = Object.assign([], arr)
      arr2.splice(i, 1, r)
      returnObj.replace = arr2
    }
    return returnObj
  },

  /**
   * craft.getQuery 获取页面指定参数的值
   * @param { String } name 可选 要查询的页面参数名
   * @param { Boolean } beta 可选 额外返回一个当前页面所有参数的数组对象
   * @returns { Object } value查询的参数值(没有时为null) allObj所有参数对象 allArr所有参数数组 allArrObj(beta) length参数键值对个数
   */
  getQuery: function (name, beta) {
    if (typeof name == "object") throw new Error("The function argument to getQuery can not be 'Object' or 'Function'")
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    var searchUrl = window.location.search.substring(1)
    var r = searchUrl.match(reg)
    var returnObj = { value: null, allObj: {}, allArr: [], length: 0 }
    if (r != null) returnObj.value = decodeURI(r[2])
    var arr = searchUrl.split("&")
    arr.forEach(function (item, index) {
      var para = item.split("=")
      if (beta) returnObj.allArrObj[index] = { [para[0]]: para[1] }
      returnObj.allArr[index] = item
      returnObj.allObj[para[0]] = para[1]
    })
    returnObj.length = arr.length
    return returnObj
  },

  /**
   * craft.getObject 获取对象信息
   * @param { Object } obj *必要* 目标对象
   * @returns { Object } keyList键数组 valList值数组 length对象长度
   */
  getObject: function (obj) {
    if (!this.isObjFn(obj)) throw new Error("The function argument to getQuery must be a 'Object'")
    var returnObj = {
      keyList: Object.keys(obj),
      valList: Object.values(obj),
      length: Object.keys(obj).length,
    }
    return returnObj
  },

  /**
   * craft.isArrFn 精确判断是否为真数组
   * @param { * } x
   * @returns { Boolean }
   */
  isArrFn: function (x) {
    return Object.prototype.toString.call(x) === "[object Array]"
  },

  /**
   * craft.isObjFn 精确判断是否为真对象
   * @param { * } x
   * @returns { Boolean }
   */
  isObjFn: function (x) {
    return Object.prototype.toString.call(x) === "[object Object]"
  },

  /**
   * craft.isDomFn 判断是否为DOM对象
   * @param { * } dom
   * @returns { Boolean }
   */
  isDomFn: function (dom) {
    if (typeof HTMLElement === "object") return dom instanceof HTMLElement
    else return dom && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string"
  },

  /**
   * linkTo 挂载跳转事件
   * @param { String } url *必须* 要跳转的url路径
   * @param { Function } step 可选 跳转事件挂载函数（可通过event.detail获取预跳转的链接）
   * 若 step 不填，则会直接跳转，与 window.location.href 同效
   * 若 step 填写，将不会跳转，需要自己写 window.location.href。
   * 如果 step 挂载函数，请不要在函数末尾带"()"，不然将无法通过 event.detail 获取预跳转的链接
   */
  linkTo: function (url, step) {
    if (typeof url != "string") throw new Error("The function argument to linkTo must be a 'String'")
    if (!step) {
      // 只传了url
      this.xEvent(0, "linkUrl", function () {
        window.location.href = url
      })
      this.link(url)
      this.xEvent(-1, "linkUrl", step)
    } else {
      // 传了url和step
      if (typeof step == "function") {
        this.xEvent(0, "linkUrl", step)
        this.link(url)
        this.xEvent(-1, "linkUrl", step)
      } else console.warn("Invalid Function")
    }
  },

  /**
   * link 仅抛出跳转事件
   * @param { String } url
   */
  link: function (url) {
    this.xEvent(1, "linkUrl", url)
  },

  /**
   * linkFn 仅监听跳转事件
   * @param { Function } Func
   */
  linkFn: function (Func) {
    this.xEvent(0, "linkUrl", Func)
  },

  linkFn: function (url, method, fn) {
    if (typeof url != "function") throw new Error("linkFn 1st para must be a 'String'")
    if (typeof method == "function") {
      method()

      switch (fn) {
        case "replace" || 1:
          window.location.replace(url)
          break
        default:
          window.location.href = url
      }
    }

    bbb()

    function aaa(n) {
      console.log(n)
    }

    function bbb() {
      aaa("aaa")
    }
  },

  /**
   * craft.xEvent 自定义事件
   * @param { Number(-1|0|1) } act *必要* 操作(-1:删除 0:监听 1:触发)
   * @param { String } e_name *必要* 自定义事件名称
   * @param { Function || * } Fn act为-1或0时必要，Fn代表监听事件触发函数。当act为1时可选，Fn代表事件传参
   * 当在事件中传参时，监听Fn中可使用 event.detail 来获取传入的参数 ( Eg: function(event){console.log(event.detail)} )
   * @param { HTMLElement } ele 可选 仅在act为-1或0时生效，代表事件要挂载的元素
   */
  xEvent: function (act, e_name, Fn, ele) {
    if (act == -1) {
      if (typeof Fn != "function") console.warn("when xEvent use -1: remove, 3rd para must be a 'Function'")
      if (!ele) {
        if (removeEventListener) removeEventListener(e_name, Fn)
        else detachEvent(e_name, Fn)
      } else {
        if (!this.isDomFn(ele)) throw new Error("4th para must be a HTMLElement")
        if (ele.removeEventListener) ele.removeEventListener(e_name, Fn)
        else ele.detachEvent(e_name, Fn)
      }
    } else if (act == 0) {
      if (typeof Fn != "function") throw new Error("when xEvent use 0: cerate, 3rd para must be a 'Function'")
      if (!ele) {
        if (addEventListener) addEventListener(e_name, Fn)
        else attachEvent(e_name, Fn)
      } else {
        if (!this.isDomFn(ele)) throw new Error("4th para must be a HTMLElement")
        if (ele.addEventListener) ele.addEventListener(e_name, Fn)
        else ele.attachEvent(e_name, Fn)
      }
    } else if (act == 1) {
      if (!ele) {
        if (!Fn) dispatchEvent(new Event(e_name))
        else dispatchEvent(new CustomEvent(e_name, { detail: Fn }))
      } else {
        if (!this.isDomFn(ele)) throw new Error("4th para must be a HTMLElement")
        if (!Fn) ele.dispatchEvent(new Event(e_name))
        else ele.dispatchEvent(new CustomEvent(e_name, { detail: Fn }))
      }
    } else console.error("1st para:\n -1: remove | 0: cerate | 1: active")
  },

  xStorage: function (type, act, key, val) {
    if (act != "c" && typeof key != "string") throw new Error("3rd para is key, at set/get/remove must be a 'String'")
    switch (type) {
      case 0:
        switch (act) {
          case "s":
            window.localStorage.setItem
            break
          case "g":
            break
          case "r":
            break
          case "c":
            break
        }
        break
      case 1:
        switch (act) {
          case "s":
            break
          case "g":
            break
          case "r":
            break
          case "c":
            break
        }
        break
    }
  },
  // SysConvert(数字num, num是m进制, 要转换成的n进制);
  SysConvert: function (num, m, n) {
    if (2 > m || m > 36 || 2 > n || n > 36) {
      console.log(Event.srcElement)
      // console.log(search.caller.name);
      // console.log(arguments.callee.caller.name);
      return false
    }
    var s = num + ""
    var result = parseInt(s, m).toString(n)
    return result
  },
}
