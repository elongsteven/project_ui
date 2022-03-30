## prompt.js

针对 uni-app 的弹框组件

**几个优势**

* 没有令人头大的父子组件或爷孙组件动态传参
* 不需要在各个页面中引用组件及标签，一个函数轻松搞定
* 配置项中的所有属性都是可选的，且每项配置都有默认值

Vue版本支持：2.x

### 使用




uni-app 的顶栏层级是998，而本组件层级是从1000开始递增的

 * -///== 对公函数 ==///-
 * @Func    this.$prompt.msg(text, opts);             创建一个信息弹窗
 * @Func    this.$prompt.status(text, opts, status);  创建一个状态弹窗
 * @Func    this.$prompt.load(txt, opts);             创建一个加载弹窗
 * @Func    this.$prompt.error(txt, opts);            状态弹窗：错误信息 同this.$prompt.status(text, opts, 0);
 * @Func    this.$prompt.success(txt, opts);          状态弹窗：成功信息 同this.$prompt.status(text, opts, 1);
 * @Func    this.$prompt.info(txt, opts);             状态弹窗：提示信息 同this.$prompt.status(text, opts, 2);
 * @Func    this.$prompt.question(txt, opts);         状态弹窗：问题信息 同this.$prompt.status(text, opts, 3);
 * @Func    this.$prompt.modal();                     创建一个modal弹框，此弹框不同于其他任何弹框，配置项也均为独立存在，详见 @modal
 * @param   { String }            text                *必填* 弹窗文字内容
 * @param   { Object || Number }  opts                *必填* 显示时长(单位:ms) 或 弹窗配置,属性详见 @opts
 * @param   { Number || String }  status              *可选* 状态弹窗的状态定义 0:错误 1:成功 2:提示 3:问题 也可以传图片路径，如果不写该参数 则表现同于msg弹窗
 * @returns { Number }            insId               每创建一个弹窗，都会返回当前这个弹窗实例的ID，可用于关闭等操作
 *
 * @Func this.$prompt.hide(insId);                    关闭指定的弹窗
 * @param { Number } insId                            *可选* 要关闭的弹窗实例ID，若不填写 则默认关闭最后一个弹出的弹窗
 *
 * @Func this.$prompt.hideType(type);                 关闭指定类型的弹窗
 * @param { Number } type                             *必填* 要关闭的弹窗类型，0:msg 1:status 2:load 3:modal
 *
 * @Func this.$prompt.hideAll();                      关闭所有弹窗
 *
 * @Func this.$prompt.getList();                      获取当前正在运行的弹窗列表
 *
 * -///== 私域函数 ==///-
 * @Func craft.settingEngine(txt, opts, type);        文字与时间处理器
 * @return { Object }                                 { text: 内容文字, time: 显示时长 }
 * @Func craft.autoEngine(time);                      自动关闭引擎
 * @Func craft.ArrDebug(arr);                         Debugger 数组调试用工具
 *
 *   -   -   -   -   -   -   -   -   -
 * 写在前面：所有的配置项均有默认值，因此 所有的配置项皆为选填项
 * @opts {
 *  // 公用配置
 *    @property { Boolean } isPass    @default false            是否穿透点击
 *    @property { Boolean } isMask    @default false            是否打开蒙板
 *    @property { Boolean } scroll    @default true             是否允许滑动
 *    @property { Boolean } isShut    @default false            是否蒙版点隐
 *    @property { Boolean } isBlur    @default false            是否开启高斯
 *    @property { Boolean } isRow     @default false            是否使附加元素和文字同行显示
 *    @property { String }  maskColor @default 'rgba(0,0,0,.6)' 蒙版底色
 *    @property { String }  bgColor   @default 'rgba(0,0,0,.6)' 弹窗底色
 *    @property { String }  color     @default '#fff'           弹窗文字颜色
 *    @property { String }  fontSize  @default '30rpx'          弹窗文字大小
 *    @property { String }  shadow    @default '0 0 8rpx 5rpx rgba(0,0,0,0.2)'   弹窗阴影
 *    @property { String }  class     @default '30rpx'          弹窗附加类名
 *    @property { String }  style     @default '30rpx'          弹窗附加样式
 *    @property { String }  ani_m     @default 'fade'           蒙版动画样式名称
 *    @property { String }  ani_c     @default 'z-fade'         弹窗动画样式名称
 *    @property { Function }  cb      @default undefined        弹窗关闭时会触发的回调函数
 *  // status 弹窗配置
 *    @property { String } iconWidth  @default '80rpx'          图标宽度
 *    @property { String } iconColor  @default ''               图标颜色(仅支持纯色)
 *    @property { String } iconClass  @default ''               图标附加类名
 *    @property { String } iconStyle  @default ''               图标附加样式
 *  // load 弹窗配置
 *    @property { Boolean } isRow     @default false            是否使加载动画和文字同行显示
 *    @property { String } loadColor  @default '#fff'           加载层元素颜色
 *    @property { String } loadSize   @default '80rpx'          加载层大小
 *    @property { String } loadClass  @default ''               加载层附加类名
 * }
 *   -   -   -   -   -   -   -   -   -
 * @modal {
 *
 * }





/**
 * 需求整理   --来自开发者
 * 目标版本：1.16
 * 现状分析：当前版本的底层是操作浏览器的DOM对象，这种实现方式无法兼容APP，只有Web端可以正常运行
 * 组件初心：兼容且适配多端的弹出层组件，解决uni-app原生弹窗不美观且无法自由控制的问题
 * 优化方案：改变底层逻辑，推翻当前实现方式 重构底层。
 * 思路：
 *  1. 使用 uni.$emit uni.$on 实现底层通信交互逻辑
 *  2. 弹窗组件仅有一个入口函数，在函数的末尾做判断来执行相应的弹窗，不同的调用均仅在js中做分线
 *  3. 所有的计算均在js中执行，尽量让view中的逻辑精简以提升性能（曲线救国(?)）
 *    a. 原 View 中的 Engine，搬到 js 中
 *    b. 计时关闭保留在 js 中
 *    c. 考虑倒计时逻辑功能怎么移植到 js 中
 */

/**
 * TODO:
 * [√] 1. 写DEMO，页面通过总线事件传参 prompt监听注入 测试。
 * [√] 2. 整理总线函数，写计算函数，事件传参
 * [√] 3. prompt组件监听唯一事件，通过参数标识判断需要执行的弹窗类型，弹窗在用户视图显示
 * [√] 4. PCIe总线计时器，调用关闭弹窗，事件传参
 * [√] 5. prompt监听关闭类函数，通过参数判断关闭方式，执行回调函数，弹窗"明周期"结束
 * [√] 6. 每个弹窗都要有 "唯一ID" 以及 "TYPE标识" 保证 "线程分离"，避免"暗周期"的出现
 */

/**
 * uni事件监听功能整理
 * uni.$emit(eventName, Obj) // 触发全局自定义事件，传参类型为对象
 * uni.$on(eventName, callback(Obj)) // 监听全局自定义事件，回调函数中的参数就是触发时传过来的参数
 * uni.$once(eventName, callback(Obj)) // 监听全局的自定义事件，事件由 uni.$emit 触发，但仅触发一次，在第一次触发之后移除该监听器。（其实没太懂 "事件由 uni.$emit 触发" 这句）
 * uni.$off([eventName, callback(Obj)]) // 移除全局自定义事件监听器。若uni.$off不传参，则移除App级别的所有事件监听器；
 */


 // 每次创建监听器前先删除之前的监听器，防止串线
  // 出现的问题整理：
  // 1. 如果每次注册前先清理，则物理返回到之前的页面时事件会消失
  // 2. 如果用特殊防抖处理，会发现，uni的事件属性为异步函数！
  // 问题解析：原本为解决不同页面串线而设计的 uni.$off，如今却导致了物理返回后不能正常运作
  // 解决方案：调取每个页面的唯一ID（路径）