import * as echarts from "../../ec-canvas/echarts";

var db_util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;

var allFlags = [
  {
    title: '任务详情',
    sevent: '-6',
    six: '-5',
    five: '-4',
    four: '-3',
    three: '-2',
    two: '-1',
    one: '今'
  },
  {
    title: '早起',
    sevent: 0,
    six: 1,
    five: 0,
    four: 1,
    three: 0,
    two: 1,
    one: 1
  }
]

var option = {
  title: {
    text: '最近七日Flags完成情况',
    left: 'center',
    textStyle: {
      //文字颜色
      color: '#8f8f8f',
      //字体风格,'normal','italic','oblique'
      fontStyle: 'normal',
      //字体系列
      fontFamily: 'sans-serif',
      //字体大小
      fontSize: 12
    }
  },
  xAxis: {
    type: 'category',
    data: ['-6day', '-5', '-4', '-3', '-2', '-1day', 'Today'],
    axisLine: {
      lineStyle: {
        // 设置x轴颜色
        color: '#8f8f8f'
      }
    },
  },
  yAxis: {
    type: 'value',
    min: 0, // 设置y轴刻度的最小值
    max: 1,  // 设置y轴刻度的最大值
    splitNumber: 2,  // 设置y轴刻度间隔个数
    axisLine: {
      lineStyle: {
        // 设置y轴颜色
        color: '#8f8f8f'
      }
    },
  },
  series: [{
    data: [0, 0.2, 1, 1, 0.5, 1, 0],
    type: 'line',
    itemStyle: {
      normal: {
        // 拐点上显示数值
        label: {
          show: true
        },
        borderColor: '#bb9ad3',  // 拐点边框颜色
        lineStyle: {
          // 使用rgba设置折线透明度为0，可以视觉上隐藏折线
          color: '#cfb5e2'
        }
      }
    },
    color: ['#bb9ad3']
  }]
};
var chart;
function initChart(canvas, width, height) {
  console.log('herehere', width, height, canvas)
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    message: '',
    allFlags: allFlags
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const weekData = wx.cloud.database().collection('weekData');
    const flags = wx.cloud.database().collection('flags');
    const weekFlags = wx.cloud.database().collection('weekFlags');
    let temp = [];
    let flagsTemp = allFlags;
    let flag = [];
    new Promise((resolve, reject) => {
      // weekData.add({
      //   data: {
      //     mon: 10,
      //     thes: 20,
      //     wed: 30,
      //     thur: 40,
      //     fri: 50,
      //     sat: 60, 
      //     sun: 70
      //   }
      // })
      weekData.get({
        success: function (res) {
          temp = res.data[0];
          resolve();
        }
      });
      
    })
    .then(() => {
      let option = {
        series: [
          {
            data: temp.week.slice(-7),
            // data: [0.2, 0.2, 0.2, 0.2, 0.5, 0.2, 0],
          }
        ]
      };
      chart.setOption(option);
    });

    new Promise((resolve, reject) => {
      // weekFlags.add({
      //   data: {
      //     mon: 0,
      //     thes: 1,
      //     wed: 1,
      //     thur: 0,
      //     fri: 0,
      //     sat: 1,
      //     sun: 1,
      //     title: '早起'
      //   }
      // })
      const dates = db_util.getSevent().split('~');
      console.log('haaaaa:', dates)
      flags.where({
        startDate: _.lte(Number(dates[1])),
        deadline: _.gte(Number(dates[0]))
      })
        .get({
          success(res) {
            res.data.forEach(item => {
              flag.push(item.title, item.flagTime)
            })
            console.log('hhhhhhasdgee:', flag);
          }
        })
      weekFlags.get({
        success: function (res) {
          flagsTemp.push(res.data[0]);
          resolve();
        }
      });

    })
      .then(() => {
        this.setData({
          allFlags: flagsTemp
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  submitQuestion: function () {
    let user = wx.getStorageSync('userInfo');
    if (user != null && user._id != null && user._id != "") {
      let bugs = {};
      bugs.text = this.data.message;
      bugs.user_id = user._id;
      if (bugs.text == '') {
        wx.showToast({
          title: '请输入问题或建议',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      bugs.create_time = db_util.getLocalTime(new Date().getTime());
      // let me = this;
      // db_util.add('mm_bugs', bugs, function (e) {
      //   Notify({ type: 'danger', background: "#FF9DCA", message: '提交成功!' });
      //   me.setData({
      //     message: ""
      //   });

      // });
      console.log('quessssssss:', bugs)
    } else {
      wx.showToast({
        title: '您还没有登录哦',
        icon: 'none',
        duration: 2000
      })

    }
  },
  inputQuestion: function (e) {
    let message = this.data.message;
    message = e.detail.value;
    this.setData({
      message: message
    });
  },
})