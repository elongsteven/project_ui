import { promptAPI } from "./public/prompt.js"

export let prompt = promptAPI

export let vRoute = {
  change: function (fn) {
    if (!fn) fn()
  },
}
