import App from "./App"
import PCIe from "@/components/PCI/PCIe.vue"
import { prompt, vRoute, craft, vPrint, storage, storageSync, xEvent } from "@/components/PCI/PCIe.js"
// import './router' // 引入路由

// #ifndef VUE3
import Vue from "vue"
Vue.config.productionTip = false
Vue.component("basic", PCIe) // 引入全局组件 2.x
Vue.prototype.$print = vPrint
Vue.prototype.$prompt = prompt // 注册方法
Vue.prototype.$vRoute = vRoute
Vue.prototype.$storage = storage
Vue.prototype.$storageSync = storageSync
Vue.prototype.$xEvent = xEvent
Vue.prototype.$craft = craft
App.mpType = "app"
const app = new Vue({
  ...App,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue"
export function createApp() {
  const app = createSSRApp(App)
  // app.config.globalProperties.$prompt = prompt // 引入弹窗方法 3.x（vue3暂时弃坑）
  // app.component('prompt', prompt) // 引入全局组件 3.x
  return {
    app,
  }
}
// #endif
