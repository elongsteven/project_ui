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
      this.$prompt.routeChange(from, to)
    },
  },
}
</script>

<style>
/* css引入 */
@import "../../uni-project/uni-project";
</style>
