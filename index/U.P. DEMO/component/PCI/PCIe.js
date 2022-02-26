import { promptAPI } from "./public/prompt.js"

export let prompt = promptAPI

export let vRoute = {
  FIRST: true,
  index: 0,
  history: [],
  path: function (url, param) {
    console.log(url, param)
  },
  only: function () {},
  sole: function () {},
  tab: function () {},
  back: function () {},
  load: function () {},
  change: function (from, to) {
    uni.$emit("router", { from, to })
    if (this.index === 0) this.history.push(from)
    if (this.history[this.index - 1] === from) this.history.push(to)
    this.index++
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
