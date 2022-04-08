<template>
  <basic>
    <view slot="page">
      <view class="u-t-c u-f-b">CANVAS DEMO</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="shareClick">CANVAS ON</view>
      <canvas id="canvas" style="border-radius: 12px"></canvas>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to index</view>
    </view>
  </basic>
</template>

<script>
const canvasTmplOpts = {
  el: "#canvas",
  width: 1280,
  height: 2276,
  renderList: []
};
export default {
  data() {
    return {
      canvasTmpl: {},
      imgSrc: ""
    };
  },
  onReady() {},
  onLoad(options) {
    this.$nextTick(() => {
      this.canvasTmpl = new BlueCanvasTmpl(canvasTmplOpts);
    });
  },
  methods: {
    goto() {
      this.$vRoute.path("/pages/index/index");
    },
    font(size) {
      return `${size}px bold arial, 微软雅黑, sans-serif`;
    },
    shareClick() {
      // this.$axios
      //   .get("/home/beautifulAngel/getShareQrUrl", {
      //     params: {
      //       type: "1"
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.code == 10001) {
      //       unLogin();
      //       return;
      //     } else {
      //       //海报、头像、二维码、用户名
      //       this.sharePoster({
      //         posterImg: this.listData.share_poster_img,
      //         headImg: this.listData.member_info.head_img,
      //         qrCode: res.data.info,
      //         nickName: this.listData.member_info.nickname
      //       });
      //     }
      //   });
      this.sharePoster({
        posterImg: "@/static/ajln.jpg",
        headImg: "@/static/headImg.jpg",
        qrCode: "@/static/qrCode.jpg",
        nickName: "Elong"
      });
    },
    sharePoster(opts = {}) {
      const vm = this;
      const { posterImg, headImg, qrCode, nickName } = opts;
      this.canvasTmpl.update(
        this.$utils.extend(canvasTmplOpts, {
          renderList: [
            {
              type: "image",
              src: posterImg,
              x: 0,
              y: 0,
              width: 1280,
              height: 2276
            },
            {
              type: "image",
              x: 130,
              y: 130,
              width: 200,
              height: 200,
              src: headImg
            },
            {
              type: "text",
              content: nickName.length < 10 ? nickName : nickName.slice(0, 10) + " ......",
              font: this.font(60),
              style: "black",
              x: 400,
              y: 190
            },
            {
              type: "image",
              src: qrCode,
              width: 266,
              height: 266,
              x: 900,
              y: 1650
            }
          ],
          rendered() {
            const shareImg = this.canvas.toDataURL("image/png");
            console.log(shareImg);
            // //app分享
            // if (vm.config.device.isApp) {
            //   dtb.shareImage(shareImg);
            // } else {
            //   //普通显示
            //   vm.imgSrc = shareImg;
            // }
          }
        })
      );

      if (!this.config.device.isApp) {
        this.maskIsShow = true;
      }
    }
  }
};
</script>

<style></style>
