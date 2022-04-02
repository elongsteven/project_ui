<template>
  <basic>
    <view slot="page">
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="goto">go to p1</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$xEvent.once('eee')">once eee</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$xEvent.once('aaa')">once aaa</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$xEvent.once('ccc')">once ccc</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-info" @click="$print($xEvent.list)">getList</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$xEvent.emit('eee')">once eee</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$xEvent.emit('aaa')">once aaa</view>
      <view class="u-mg-t-16rp u-pd-tb-15rp u-btn u-btn-success" @click="$xEvent.emit('ccc')">once ccc</view>
      <view>这里跳转时执行了一个从1到16000的循环</view>
      <view>测试文字 app 与 h5 的差异</view>
      <view class="u-f-1rp">1</view>
      <view class="u-f-2rp">2</view>
      <view class="u-f-3rp">3</view>
      <view class="u-f-4rp">4</view>
      <view class="u-f-5rp">5</view>
      <view class="u-f-6rp">6</view>
      <view class="u-f-7rp">7</view>
      <view class="u-f-8rp">8</view>
      <view class="u-f-9rp">9</view>
      <view class="u-f-10rp">10</view>
      <view class="u-f-11rp">11</view>
      <view class="u-f-12rp">12</view>
      <view class="u-f-13rp">13</view>
      <view class="u-f-14rp">14</view>
      <view class="u-f-15rp">15</view>
      <view class="u-f-16rp">16</view>
      <view class="u-f-17rp">17</view>
      <view class="u-f-18rp">18</view>
      <view class="u-f-19rp">19</view>
      <view class="u-f-20rp">20</view>
      <view class="u-f-21rp">21</view>
      <view class="u-f-22rp">22</view>
      <view class="u-f-23rp">23</view>
      <view class="u-f-24rp">24</view>
      <view class="u-f-25rp">25</view>
      <view class="u-f-26rp">26</view>
      <view class="u-f-27rp">27</view>
      <view class="u-f-28rp">28</view>
      <view class="u-f-29rp">29</view>
      <view class="u-f-30rp">30</view>
      <view class="u-f-31rp">31</view>
      <view class="u-f-32rp">32</view>
      <view class="u-f-33rp">33</view>
      <view class="u-f-34rp">34</view>
      <view class="u-f-35rp">35</view>
      <view class="u-f-36rp">36</view>
      <view class="u-f-37rp">37</view>
      <view class="u-f-38rp">38</view>
      <view class="u-f-39rp">39</view>
    </view>
  </basic>
</template>

<script>
export default {
  data() {
    return {}
  },
  onReady() {
    this.$prompt.modal(
      { title: "加载中", desc: "请稍后..." },
      {
        isPass: true,
        setTime: 30,
        setFn: this.fn3,
        lineColor: "#fff",
        btn: [
          { key: "Delete", style: { color: "#999" }, fn: this.fn1 },
          { key: "Cancel", fn: this.fn1, time: 10 },
        ],
      }
    )
  },
  methods: {
    goto() {
      this.$vRoute.path("/pages/index/p1", {
        fn: function () {
          for (var i = 0; i < 16000; i++) {
            console.log(i)
          }
        },
      })
    },
  },
}
</script>

<style></style>
