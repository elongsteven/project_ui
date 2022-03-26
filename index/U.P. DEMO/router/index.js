import Vue from "vue";
import uniCrazyRouter from "@/component/crazy-router";
Vue.use(uniCrazyRouter);

uniCrazyRouter.beforeEach(async (to, from, next) => {
  // 逻辑代码

  next();
});

uniCrazyRouter.afterEach((to, from) => {
  // 逻辑代码
});

uniCrazyRouter["on" + "Error"]((to, from) => {
  // 逻辑代码
});
