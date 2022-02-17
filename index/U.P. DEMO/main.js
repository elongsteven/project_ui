import App from "./App"
// import {  } from './util/components.js'
import prompt from "./component/prompt/prompt"

// #ifndef VUE3
import Vue from "vue"
Vue.config.productionTip = false
Vue.prototype.$prompt = prompt // 引入弹窗方法 2.x
Vue.component("prompt", prompt) // 引入全局组件 2.x
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
