let ctx = null
let obj = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {},

  onReady() {
    this.animation()
  },

  animation() {
    const query = wx.createSelectorQuery()
    query.select('#firstCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        ctx = canvas.getContext('2d')
        obj = {
          width: 300,
          height: 300,
          dx: 20, // 刻度宽度
          dy: 4, // 刻度高度
          num: 24, // 刻度条数
          r: 70, // 半径
          start: -90, // 开始角度，与结束角度相对称
          progress: 75, // 显示进度 （单位百分比）
          index: 0, // 开始刻度
          defaultColor: '#dee1e4', // 开始颜色
          activeColor: '#2fd498' // 进度条颜色
        };
        obj.deg = (180 - 2 * obj.start) / obj.num;

        canvas.width = obj.width;
        canvas.height = obj.height;

        for (var x = 0; x < obj.num; x++) { //灰色刻度线
          draw(x, obj.defaultColor);
        }

        function draw(x, color) { // 画出环形刻度线
          ctx.save();
          var deg = Math.PI / 180 * (obj.start + obj.deg * x); // 角度换算弧度
          var offsetY = -(Math.sin(deg) * obj.r); // 计算刻度Y轴位置
          var offsetX = -(Math.cos(deg) * obj.r); // 计算刻度X轴位置
          ctx.fillStyle = color;
          ctx.translate(obj.width / 2 - offsetX, obj.height / 2 - offsetY); // 修改画布坐标原点
          ctx.rotate(deg); // 旋转刻度
          ctx.fillRect(0, 0, obj.dx, obj.dy); // 画出刻度
          ctx.restore();
        }

        function animate(s, time) {
          if (obj.progress == 0) { // 进度为0直接退出函数
            return false;
          }
          draw(s, obj.activeColor);

          var num = obj.progress * (obj.num / 100); //格数计算

          var timmer = setTimeout(function () {
            obj.index = s + 1;

            if (s >= num) {
              clearTimeout(timmer);
            } else {
              if (s > num - 10) { // 剩余10格动画减速
                animate(obj.index, time + 20);
              } else {
                animate(obj.index, time);
              }

            }
          }, time)
        }
        animate(obj.index, 10)
      })
  }
})