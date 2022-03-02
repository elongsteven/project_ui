<script>
export default {
  onLaunch: function () {
    console.log("App Launch")
  },
  onShow: function () {
    console.log("App Show")
  },
  onHide: function () {
    console.log("App Hide")
  },
  watch: {
    $route: function (from, to) {
      console.group("pages")
      getCurrentPages().forEach(item => {
        console.log(item.route)
      })
      console.groupEnd("pages")
      // console.log("getCurrentPages", [getCurrentPages().length - 1].route)
      // console.log("getCurrentPages", getCurrentPages()[getCurrentPages().length - 1].route)
      // this.$vRoute.change(from, to)
    },
  },
}
</script>

<style>
/* css引入 */
@import "../../uni-project/uni-project";
</style>
