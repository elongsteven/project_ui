/** PROMPT | C: 2022-02-08 | by: Elong
 * last update: 2022-03-30 | Ver 1.16 Stable */

/* 对PCIe开放 */
export let promptAPI = {
  ins: 0, // 弹窗ID
  popArr: [], // [type]  0:msg  1:status  2:load  3:modal
  icons: ["/static/pci_icon/fail.png", "/static/pci_icon/success.png", "/static/pci_icon/info.png", "/static/pci_icon/question.png"],
  // msg 弹窗
  msg: function (txt, opts) {
    const PT = 0;
    let setting = craft.settingEngine(txt, opts, PT); // setting: {opts,time} | popArr: push(type,insID)
    uni.$emit("showPrompt_" + setting.eventName, setting.opts);
    craft.autoEngine(setting.time, setting.eventName);
    return promptAPI.ins;
  },
  // error 弹框
  error: function (txt, opts) {
    return promptAPI.status(txt, opts, 0);
  },
  // success 弹窗
  success: function (txt, opts) {
    return promptAPI.status(txt, opts, 1);
  },
  // info 弹框
  info: function (txt, opts) {
    return promptAPI.status(txt, opts, 2);
  },
  // info 弹框
  question: function (txt, opts) {
    return promptAPI.status(txt, opts, 3);
  },
  // status 弹窗
  status: function (txt, opts, status) {
    const PT = 1;
    let setting = craft.settingEngine(txt, opts, PT, status);
    uni.$emit("showPrompt_" + setting.eventName, setting.opts);
    craft.autoEngine(setting.time, setting.eventName);
    return promptAPI.ins;
  },
  // load 弹窗
  load: function (txt, opts) {
    const PT = 2;
    let setting = craft.settingEngine(txt, opts, PT);
    uni.$emit("showPrompt_" + setting.eventName, setting.opts);
    craft.autoEngine(setting.time, setting.eventName);
    return promptAPI.ins;
  },
  // modal 弹窗
  modal: function (view, opts) {
    const PT = 3;
    let setting = craft.settingEngine(view, opts, PT);
    uni.$emit("showPrompt_" + setting.eventName, setting.opts);
    craft.autoEngine(0);
    return promptAPI.ins;
  },
  // 插槽弹窗
  mine: function (opts) {
    const PT = 4;
    // let setting = craft.settingEngine(view, opts, PT)
    /* 公用变量 */
    if (!opts || typeof opts !== "object") opts = {}; // opts格式化
    let Z = parseInt(1000 + Number(promptAPI.ins));
    /* opts单元初始化计算 */
    let initialOpt = {
      id: promptAPI.ins, // ID注入
      show: true,
      type: PT,
      pass: "u-pe-auto",
      scroll: opts.scroll === undefined ? true : opts.scroll, // 是否允许滑动
      isShut: opts.isShut === undefined ? true : opts.isShut, // 是否点击蒙版关闭
      ani_m: opts.ani_m === undefined || !Array.isArray(opts.ani_m) ? ["fade"] : opts.ani_m,
      ani_c: opts.ani_c === undefined || !Array.isArray(opts.ani_c) ? ["fade"] : opts.ani_c,
      MaskStyle: "z-index:" + Z + ((opts.isMask === undefined ? true : opts.isMask) ? ";background:" + (opts.maskColor || "rgba(0,0,0,.6)") : ""), // 蒙版样式计算
      Z,
      cb: opts.cb
    };
    /* 公用引擎初始化完毕 */
    promptAPI.hideType(PT); // 先关闭
    promptAPI.popArr.push({ type: PT, insID: promptAPI.ins });
    uni.$emit("showPrompt_" + setting.eventName, initialOpt);
    craft.autoEngine(0);
    return promptAPI.ins;
  },
  // 手动关闭函数（不传参数时，先隐藏最后一个弹出的）
  hide: function (insId, eventName) {
    if (promptAPI.popArr.length === 0) return false;
    // (!insId && typeof insId !== "number" && insId.trim() !== "") || typeof insId === "object"
    if (typeof insId !== "number") {
      let del = promptAPI.popArr.pop();
      uni.$emit("hidePrompt_" + eventName, del);
    } else {
      promptAPI.popArr.forEach((element, index) => {
        if (element.insID === insId) {
          promptAPI.popArr.splice(index, 1);
          uni.$emit("hidePrompt_" + eventName, element);
        }
      });
    }
  },
  // 按照类型关闭弹窗
  hideType: function (type) {
    if (promptAPI.popArr.length === 0) return false;
    let eventName = encodeURIComponent(getCurrentPages()[getCurrentPages().length - 1].route);
    promptAPI.popArr.forEach((element, index) => {
      if (element.type === type) {
        promptAPI.popArr.splice(index, 1);
        uni.$emit("hidePrompt_" + eventName, element);
      }
    });
  },
  // 全部关闭函数
  hideAll: function () {
    if (promptAPI.popArr.length === 0) return false;
    let eventName = encodeURIComponent(getCurrentPages()[getCurrentPages().length - 1].route);
    uni.$emit("hidePrompt_" + eventName, { type: "all", insID: promptAPI.popArr });
    promptAPI.popArr = [];
  },
  // 获取当前弹窗列表
  getList: function () {
    return promptAPI.popArr;
  }
};

/* 私域 */
let craft = {
  /* 弹窗计算引擎  文字计算，时间计算，配置计算，默认赋值... */
  settingEngine: function (txt, opts, type, others) {
    /* 公用变量 */
    let formatOpt = typeof opts !== "object" ? {} : opts; // opts格式化
    let isPass = formatOpt.isPass === undefined ? false : formatOpt.isPass; // 是否允许穿透
    let isMask = formatOpt.isMask === undefined ? false : formatOpt.isMask; // 是否打开蒙板
    let isBlur = formatOpt.isBlur === undefined ? true : formatOpt.isBlur; // 是否打开底层高斯
    let Z = parseInt(1000 + Number(promptAPI.ins));
    /* opts单元初始化计算 */
    let initialOpt = {
      id: promptAPI.ins, // ID注入
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
      cb: formatOpt.cb
    };
    /* 其他单元计算 */
    if (initialOpt.type === 1) {
      // status 图标附加属性
      initialOpt.IconStyle = "width:" + (formatOpt.iconWidth || "80rpx") + (formatOpt.iconColor ? ";filter: drop-shadow(100vw 0 " + formatOpt.iconColor + ");right: 100vw" : "") + ";" + (formatOpt.iconStyle || "");
      initialOpt.IconUrl = others !== undefined ? (typeof others === "number" ? promptAPI.icons[others] : others) : null;
      initialOpt.IconClass = "u-mg-8rp" + (formatOpt.iconClass || "");
    } else if (initialOpt.type === 2) {
      // loading 加载层附加属性
      initialOpt.LoadClass = "u-mg-24rp" + (formatOpt.loadClass || "");
      initialOpt.loadColor = formatOpt.loadColor || "#fff";
      initialOpt.LoadSize = formatOpt.loadSize || "80rpx";
    } else if (initialOpt.type === 3) {
      let view = txt;
      /* 处理格式化后的数据列 */
      if (!formatOpt.vtStyle) formatOpt.vtStyle = {};
      if (!formatOpt.vdStyle) formatOpt.vdStyle = {};
      if (!formatOpt.vtStyle.fontSize) formatOpt.vtStyle.fontSize = "34rpx";
      if (!formatOpt.vtStyle.fontWeight) formatOpt.vtStyle.fontWeight = "bold";
      if (!formatOpt.btn || formatOpt.btn.length === 0) formatOpt.btn = [{ key: "确定" }];
      formatOpt.btn.forEach((item, index) => {
        if (!item.key) item.key = "未定义";
        if (!item.fn) item.fn = undefined;
        if (!item.time) item.time = 0;
        if (!item.style) {
          if (formatOpt.btn.length < 2) item.style = { color: "#4E90F6" };
          else if (formatOpt.btn.length === 2) {
            if (index === 0) item.style = { color: "#ED0009" };
            else item.style = { color: "#4E90F6" };
          } else item.style = {};
        }
        if (!item.style.fontWeight) item.style.fontWeight = "bold";
        if (!item.style.borderLeft) item.style.borderLeft = "1rpx solid" + formatOpt.lineColor;
      });
      // modal弹窗 部分配置是独立存在的 与公用的引默认值擎不同
      initialOpt.txt = "";
      initialOpt.MaskStyle = (isPass ? "z-index:-1" : "z-index:" + Z) + (isMask ? ";background:" + (formatOpt.maskColor || "rgba(255,255,255,.86)") : ""); // 蒙版样式计算
      initialOpt.PromptStyle = "box-shadow:" + (formatOpt.shadow || "0 0 8rpx 5rpx rgba(0,0,0,0.2)") + ";z-index:" + Z + ";background:" + (formatOpt.bgColor || "rgba(255,255,255,.86)") + ";color:" + (formatOpt.color || "#333") + ";fontSize:" + (formatOpt.fontSize || "30rpx") + ";" + (formatOpt.style || ""); // 弹窗样式计算
      initialOpt.PromptClass = (isBlur ? "blurCloud " : "") + (formatOpt.class || "");
      // modal弹窗 拓展属性
      initialOpt.lineColor = formatOpt.lineColor || "#ccc"; // 分线颜色
      initialOpt.VTitle = view.title || ""; // 弹窗标题文字
      initialOpt.VDesc = view.desc || ""; // 弹窗描述文字
      initialOpt.vtStyle = formatOpt.vtStyle || {};
      initialOpt.vdStyle = formatOpt.vdStyle || {};
      initialOpt.btnList = formatOpt.btn;
      initialOpt.setTime = formatOpt.setTime || 0;
      initialOpt.setFn = formatOpt.setFn || undefined;
      initialOpt.setHide = formatOpt.setHide === undefined ? true : formatOpt.setHide; // 倒计时结束是否自动关闭
    }
    /* 公用引擎初始化完毕 */
    promptAPI.hideType(type); // 先关闭
    promptAPI.popArr.push({ type, insID: promptAPI.ins });
    return {
      opts: initialOpt,
      time: opts !== undefined ? (typeof opts === "number" ? opts : opts.time !== undefined && typeof opts.time === "number" ? opts.time : 3000) : 3000,
      eventName: encodeURIComponent(getCurrentPages()[getCurrentPages().length - 1].route)
    };
  },
  autoEngine: function (time, eventName) {
    let insID = promptAPI.ins;
    if (time != 0) {
      setTimeout(() => {
        promptAPI.hide(insID, eventName);
      }, time);
      promptAPI.ins++;
    } else promptAPI.ins++;
  },
  ArrDebug: function (arr) {
    arr.forEach(item => {
      this.$print(item);
    });
  }
};
