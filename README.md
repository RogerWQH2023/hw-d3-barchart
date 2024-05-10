# React+D3实现柱状图

demo网站：[CloudFlare Demo网站](https://hw-d3-barchart.pages.dev/)

尝试使用d3进行柱形图的绘制，将柱形图封装为组件

- 预计实现功能：
  - [x] 坐标轴自适应，正负值显示，单位
  - [x] 宽高自适应（可以自由调整外部容器的大小，将自动填满外部容器）
  - [x] 自定义数据
  - [x] 自定义颜色
  - [x] 可选的label
  - [x] 可选的交互（显示tooltip）
  - [x] 柱状图动态更新（transition）
  - [x] 支持多个barchart同时使用？（目前的select方法可能导致多个组件之间发生冲突）
    - （废弃）引入了UUID包，每个柱状图组件的入口id由uuidv4()生成，防止相互冲突
    - 改为select Ref对象。
  - [x] 分离组件和绘图的文件，合并输入参数为对象，提供类型提示