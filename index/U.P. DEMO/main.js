import App from "./App"
import PCIe from "@/component/PCI/PCIe.vue"
import { prompt } from "@/component/PCI/PCIe.js"

// #ifndef VUE3
import Vue from "vue"
Vue.config.productionTip = false
Vue.component("page", PCIe) // 引入全局组件 2.x
Vue.prototype.$prompt = prompt // 注册方法
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
  app.config.globalProperties.$prompt = prompt // 引入弹窗方法 3.x（vue3暂时弃坑）
  // app.component('prompt', prompt) // 引入全局组件 3.x
  return {
    app,
  }
}
// #endif
